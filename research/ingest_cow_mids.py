#!/usr/bin/env python3
"""Ingest COW MID v5.0 into dispute, participant, state-year, and system-year features."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "data/raw/cow_mids/v5.0/MID-5-Data-and-Supporting-Materials.zip"
EXPECTED_SHA = "f1d2f47ed02cd62e348e755a37108e302cb6a6e576a5fa03f6f7a8d5cbdc8009"
MIDA = "MIDA 5.0.csv"
MIDB = "MIDB 5.0.csv"
PROCESSED = ROOT / "data/processed"
MANIFESTS = ROOT / "data/manifests"


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_member(archive: zipfile.ZipFile, name: str) -> list[dict[str, str]]:
    with archive.open(name) as member:
        return list(csv.DictReader(io.TextIOWrapper(member, encoding="utf-8-sig", newline="")))


def write_csv(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    if checksum(ARCHIVE) != EXPECTED_SHA:
        raise ValueError("MID archive checksum mismatch")
    with zipfile.ZipFile(ARCHIVE) as archive:
        disputes = read_member(archive, MIDA)
        participants = read_member(archive, MIDB)
    if not disputes or not participants:
        raise ValueError("MID source tables are empty")
    if {row["version"] for row in disputes} != {"5"} or {row["version"] for row in participants} != {"5"}:
        raise ValueError("MID source contains an unexpected version")

    dispute_by_id = {row["dispnum"]: row for row in disputes}
    normalized_disputes = []
    system_onsets: dict[int, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    system_active: dict[int, set[str]] = defaultdict(set)
    for row in disputes:
        start_year = int(row["styear"])
        end_year = int(row["endyear"])
        normalized_disputes.append({
            "dispute_id": row["dispnum"],
            "start_year": start_year,
            "end_year": end_year,
            "outcome_code": row["outcome"],
            "settlement_code": row["settle"],
            "fatality_code": row["fatality"],
            "fatality_precision": row["fatalpre"],
            "highest_action_code": row["hiact"],
            "hostility_level": row["hostlev"],
            "reciprocal": row["recip"],
            "side_a_count": row["numa"],
            "side_b_count": row["numb"],
            "ongoing_2014": row["ongo2014"],
            "source_version": "5.0",
        })
        system_onsets[start_year]["dispute_onsets"] += 1
        if int(row["hostlev"]) == 5:
            system_onsets[start_year]["war_onsets"] += 1
        if int(row["fatality"]) > 0:
            system_onsets[start_year]["fatal_dispute_onsets"] += 1
        for year in range(start_year, end_year + 1):
            system_active[year].add(row["dispnum"])

    state_metrics: dict[tuple[int, int], dict] = {}
    participant_rows = []
    for row in participants:
        dispute = dispute_by_id[row["dispnum"]]
        start_year = int(row["styear"])
        end_year = int(row["endyear"])
        ccode = int(row["ccode"])
        participant_rows.append({
            "dispute_id": row["dispnum"],
            "cow_code": ccode,
            "cow_abbreviation": row["stabb"],
            "start_year": start_year,
            "end_year": end_year,
            "side_a": row["sidea"],
            "revisionist_state": row["revstate"],
            "fatality_code": row["fatality"],
            "highest_action_code": row["hiact"],
            "hostility_level": row["hostlev"],
            "originator": row["orig"],
            "source_version": "5.0",
        })
        for year in range(start_year, end_year + 1):
            key = (ccode, year)
            metric = state_metrics.setdefault(key, {
                "cow_code": ccode,
                "cow_abbreviation": row["stabb"],
                "year": year,
                "active_disputes": set(),
                "dispute_onsets": 0,
                "originated_onsets": 0,
                "fatal_disputes": set(),
                "war_disputes": set(),
                "max_hostility_level": 0,
                "source_version": "5.0",
            })
            metric["active_disputes"].add(row["dispnum"])
            metric["max_hostility_level"] = max(metric["max_hostility_level"], int(row["hostlev"]))
            if int(row["fatality"]) > 0:
                metric["fatal_disputes"].add(row["dispnum"])
            if int(row["hostlev"]) == 5 or int(dispute["hostlev"]) == 5:
                metric["war_disputes"].add(row["dispnum"])
            if year == start_year:
                metric["dispute_onsets"] += 1
                if row["orig"] == "1":
                    metric["originated_onsets"] += 1

    state_year = []
    for key in sorted(state_metrics, key=lambda item: (item[1], item[0])):
        metric = state_metrics[key]
        state_year.append({
            "cow_code": metric["cow_code"],
            "cow_abbreviation": metric["cow_abbreviation"],
            "year": metric["year"],
            "active_disputes": len(metric["active_disputes"]),
            "dispute_onsets": metric["dispute_onsets"],
            "originated_onsets": metric["originated_onsets"],
            "fatal_disputes": len(metric["fatal_disputes"]),
            "war_disputes": len(metric["war_disputes"]),
            "max_hostility_level": metric["max_hostility_level"],
            "source_version": metric["source_version"],
        })

    system_year = []
    minimum_year = min(min(int(row["styear"]), int(row["endyear"])) for row in disputes)
    maximum_year = max(max(int(row["styear"]), int(row["endyear"])) for row in disputes)
    all_years = list(range(minimum_year, maximum_year + 1))
    for year in all_years:
        onsets = system_onsets[year]
        system_year.append({
            "year": year,
            "active_disputes": len(system_active[year]),
            "dispute_onsets": onsets["dispute_onsets"],
            "fatal_dispute_onsets": onsets["fatal_dispute_onsets"],
            "war_onsets": onsets["war_onsets"],
            "source_version": "5.0",
        })

    PROCESSED.mkdir(parents=True, exist_ok=True)
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    write_csv(PROCESSED / "cow_mid_disputes_v5.csv", normalized_disputes)
    write_csv(PROCESSED / "cow_mid_participants_v5.csv", participant_rows)
    write_csv(PROCESSED / "cow_mid_state_year_v5.csv", state_year)
    write_csv(PROCESSED / "cow_mid_system_year_v5.csv", system_year)
    manifest = {
        "sourceId": "cow_mids",
        "sourceVersion": "v5.0",
        "sourceUrl": "https://correlatesofwar.org/wp-content/uploads/MID-5-Data-and-Supporting-Materials.zip",
        "archivePath": str(ARCHIVE.relative_to(ROOT)),
        "archiveSha256": checksum(ARCHIVE),
        "retrievedAt": "2026-10-06T13:31:00-04:00",
        "licenseDecision": "analysis-only; raw and row-level derived data excluded from redistribution pending terms review",
        "nativeDisputes": len(disputes),
        "nativeParticipants": len(participants),
        "stateYearRows": len(state_year),
        "systemYearRows": len(system_year),
        "coverage": [min(all_years), max(all_years)],
        "limitations": [
            "Coverage ends in 2014.",
            "Fatality is a categorical code and is not converted to battle-death counts.",
            "Dispute involvement is not equivalent to institutional consolidation pressure.",
            "Participant data do not establish direct dyadic interaction in every multi-party dispute."
        ]
    }
    path = MANIFESTS / "cow_mids_v5.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "disputes": len(disputes),
        "participants": len(participants),
        "stateYearRows": len(state_year),
        "systemYearRows": len(system_year),
        "coverage": manifest["coverage"],
        "manifest": str(path),
    }, indent=2))


if __name__ == "__main__":
    main()
