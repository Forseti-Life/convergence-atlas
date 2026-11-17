#!/usr/bin/env python3
"""Ingest COW State System Membership v2024 into reproducible CSV tables."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import zipfile
from collections import Counter
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "data" / "raw" / "cow_states" / "v2024" / "States2024.zip"
INTERIM = ROOT / "data" / "interim"
PROCESSED = ROOT / "data" / "processed"
MANIFESTS = ROOT / "data" / "manifests"
CROSSWALKS = ROOT / "data" / "crosswalks"
EXPECTED_SHA256 = "c11689e8c0aa70ede855f6b605c4dd71c7b04122b71d5827dab5ba06b32e2015"
MEMBER_NAME = "States2024/statelist2024.csv"
EXPECTED_COLUMNS = [
    "stateabb", "ccode", "statenme", "styear", "stmonth", "stday",
    "endyear", "endmonth", "endday", "version",
]

ALIASES = {
    "United States": "United States of America",
    "Bolivia": "Bolivia",
    "Brunei": "Brunei",
    "Cabo Verde": "Cape Verde",
    "Congo, Democratic Republic of the": "Democratic Republic of the Congo",
    "Congo, Republic of the": "Congo",
    "Côte d'Ivoire": "Ivory Coast",
    "Czechia": "Czech Republic",
    "Eswatini": "Swaziland",
    "Holy See (Observer State)": "Papal States",
    "Laos": "Laos",
    "Micronesia": "Federated States of Micronesia",
    "Moldova": "Moldova",
    "North Korea": "North Korea",
    "North Macedonia": "Macedonia",
    "Russia": "Russia",
    "Saint Kitts and Nevis": "St. Kitts and Nevis",
    "Saint Lucia": "St. Lucia",
    "Saint Vincent and the Grenadines": "St. Vincent and the Grenadines",
    "South Korea": "South Korea",
    "State of Palestine (Observer State)": "Palestine",
    "Syria": "Syria",
    "Tanzania": "Tanzania",
    "Timor-Leste": "East Timor",
    "Türkiye": "Turkey",
    "Vietnam": "Vietnam",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_date(row: dict[str, str], prefix: str) -> date:
    if prefix == "start":
        return date(int(row["styear"]), int(row["stmonth"]), int(row["stday"]))
    return date(int(row["endyear"]), int(row["endmonth"]), int(row["endday"]))


def normalized_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.casefold().replace("’", "'").replace("&", "and"))


def write_csv(path: Path, rows: list[dict], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)


def read_native_rows() -> list[dict[str, str]]:
    if not ARCHIVE.exists():
        raise FileNotFoundError(f"Missing source archive: {ARCHIVE}")
    actual = sha256(ARCHIVE)
    if actual != EXPECTED_SHA256:
        raise ValueError(f"COW archive checksum mismatch: expected {EXPECTED_SHA256}, got {actual}")
    with zipfile.ZipFile(ARCHIVE) as archive:
        with archive.open(MEMBER_NAME) as member:
            text = io.TextIOWrapper(member, encoding="utf-8-sig", newline="")
            reader = csv.DictReader(text)
            if reader.fieldnames != EXPECTED_COLUMNS:
                raise ValueError(f"Unexpected COW schema: {reader.fieldnames}")
            rows = list(reader)
    if not rows or {row["version"] for row in rows} != {"2024"}:
        raise ValueError("COW source does not contain only version 2024 rows")
    return rows


def build_outputs(native_rows: list[dict[str, str]]) -> dict[str, list[dict]]:
    spells = []
    state_year = []
    transitions = []
    annual_counts: Counter[int] = Counter()

    for index, row in enumerate(native_rows, start=1):
        start = parse_date(row, "start")
        end = parse_date(row, "end")
        spell_id = f"cow-{int(row['ccode']):03d}-{start.isoformat()}"
        censored = end == date(2024, 12, 31)
        spells.append({
            "spell_id": spell_id,
            "cow_code": int(row["ccode"]),
            "cow_abbreviation": row["stateabb"],
            "cow_name": row["statenme"],
            "valid_from": start.isoformat(),
            "valid_to": end.isoformat(),
            "right_censored": int(censored),
            "source_version": row["version"],
        })
        transitions.append({
            "transition_id": f"{spell_id}-entry",
            "cow_code": int(row["ccode"]),
            "cow_name": row["statenme"],
            "event_date": start.isoformat(),
            "transition_type": "system_membership_entry",
            "source_version": row["version"],
        })
        if not censored:
            transitions.append({
                "transition_id": f"{spell_id}-exit",
                "cow_code": int(row["ccode"]),
                "cow_name": row["statenme"],
                "event_date": end.isoformat(),
                "transition_type": "system_membership_exit",
                "source_version": row["version"],
            })
        for year in range(start.year, end.year + 1):
            state_year.append({
                "cow_code": int(row["ccode"]),
                "cow_abbreviation": row["stateabb"],
                "cow_name": row["statenme"],
                "year": year,
                "spell_id": spell_id,
                "entry_year": int(year == start.year),
                "exit_year": int(year == end.year and not censored),
                "source_version": row["version"],
            })
            annual_counts[year] += 1

    count_rows = [
        {"year": year, "active_membership_spells": annual_counts[year], "source_version": "2024"}
        for year in sorted(annual_counts)
    ]
    return {
        "spells": spells,
        "state_year": state_year,
        "transitions": transitions,
        "annual_counts": count_rows,
    }


def build_crosswalk_candidates(spells: list[dict]) -> list[dict]:
    with (CROSSWALKS / "institution-identifiers.csv").open(newline="", encoding="utf-8") as handle:
        seed_rows = list(csv.DictReader(handle))
    current = [row for row in spells if row["valid_to"] == "2024-12-31"]
    by_normalized: dict[str, list[dict]] = {}
    for row in current:
        by_normalized.setdefault(normalized_name(row["cow_name"]), []).append(row)

    candidates = []
    for seed in seed_rows:
        target = ALIASES.get(seed["canonical_name"], seed["canonical_name"])
        matches = by_normalized.get(normalized_name(target), [])
        if len(matches) == 1:
            match = matches[0]
            method = "alias" if seed["canonical_name"] in ALIASES else "normalized_exact"
            candidates.append({
                "institution_id": seed["institution_id"],
                "canonical_name": seed["canonical_name"],
                "candidate_cow_code": match["cow_code"],
                "candidate_cow_name": match["cow_name"],
                "match_method": method,
                "candidate_status": "provisional_candidate",
                "review_status": "unreviewed",
            })
        else:
            candidates.append({
                "institution_id": seed["institution_id"],
                "canonical_name": seed["canonical_name"],
                "candidate_cow_code": "",
                "candidate_cow_name": "",
                "match_method": "unmatched" if not matches else "ambiguous",
                "candidate_status": "unresolved",
                "review_status": "unreviewed",
            })
    return candidates


def main() -> None:
    native_rows = read_native_rows()
    outputs = build_outputs(native_rows)
    INTERIM.mkdir(parents=True, exist_ok=True)
    PROCESSED.mkdir(parents=True, exist_ok=True)
    MANIFESTS.mkdir(parents=True, exist_ok=True)

    write_csv(INTERIM / "cow_state_spells_v2024.csv", outputs["spells"], list(outputs["spells"][0]))
    write_csv(PROCESSED / "cow_state_year_v2024.csv", outputs["state_year"], list(outputs["state_year"][0]))
    write_csv(PROCESSED / "cow_state_transitions_v2024.csv", outputs["transitions"], list(outputs["transitions"][0]))
    write_csv(PROCESSED / "cow_system_counts_v2024.csv", outputs["annual_counts"], list(outputs["annual_counts"][0]))
    candidates = build_crosswalk_candidates(outputs["spells"])
    write_csv(CROSSWALKS / "cow-v2024-candidates.csv", candidates, list(candidates[0]))

    manifest = {
        "sourceId": "cow_states",
        "sourceVersion": "v2024",
        "sourceUrl": "https://correlatesofwar.org/wp-content/uploads/States2024.zip",
        "archivePath": str(ARCHIVE.relative_to(ROOT)),
        "archiveSha256": sha256(ARCHIVE),
        "retrievedAt": "2026-10-06T13:18:00-04:00",
        "licenseDecision": "analysis-only; raw archive excluded from version control; redistribution unresolved",
        "nativeMember": MEMBER_NAME,
        "nativeRows": len(native_rows),
        "spellRows": len(outputs["spells"]),
        "stateYearRows": len(outputs["state_year"]),
        "transitionRows": len(outputs["transitions"]),
        "annualCountRows": len(outputs["annual_counts"]),
        "crosswalkCandidates": {
            "provisional": sum(row["candidate_status"] == "provisional_candidate" for row in candidates),
            "unresolved": sum(row["candidate_status"] == "unresolved" for row in candidates),
            "verified": 0
        },
        "limitations": [
            "Membership entries and exits are not yet classified as consolidation, fragmentation, or dissolution.",
            "Crosswalk candidates are unreviewed and must not be promoted automatically.",
            "Annual expansion counts a spell active if any portion of the year is covered.",
            "COW system-membership criteria are source-specific and do not equal universal recognition."
        ]
    }
    manifest_path = MANIFESTS / "cow_states_v2024.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "nativeRows": len(native_rows),
        "stateYearRows": len(outputs["state_year"]),
        "transitionRows": len(outputs["transitions"]),
        "provisionalCandidates": manifest["crosswalkCandidates"]["provisional"],
        "unresolvedCandidates": manifest["crosswalkCandidates"]["unresolved"],
        "manifest": str(manifest_path),
    }, indent=2))


if __name__ == "__main__":
    main()
