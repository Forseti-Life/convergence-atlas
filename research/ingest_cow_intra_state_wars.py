#!/usr/bin/env python3
"""Ingest COW Intra-State War v5.1 into war, participant, and state-year tables."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "data/raw/cow_intra_state_wars/v5.1/Intra-State-Wars-v5.1.zip"
EXPECTED_SHA = "b2d1f4892d3cbb02604cf8e506c5c2c3e87fb85df75276f69b1089e67fb25236"
WAR_MEMBER = "INTRA-STATE WARS v5.1 CSV.csv"
PARTICIPANT_MEMBER = "INTRA-STATE_State_participants v5.1 CSV.csv"
PROCESSED = ROOT / "data/processed"
MANIFESTS = ROOT / "data/manifests"


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_member(archive: zipfile.ZipFile, name: str) -> list[dict[str, str]]:
    with archive.open(name) as member:
        return list(csv.DictReader(io.TextIOWrapper(member, encoding="cp1252", newline="")))


def write(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def valid_year(value: str) -> int | None:
    try:
        year = int(float(value))
    except (TypeError, ValueError):
        return None
    return year if year > 0 else None


def main() -> None:
    if checksum(ARCHIVE) != EXPECTED_SHA:
        raise ValueError("Intra-state archive checksum mismatch")
    with zipfile.ZipFile(ARCHIVE) as archive:
        wars = read_member(archive, WAR_MEMBER)
        participants = read_member(archive, PARTICIPANT_MEMBER)
    if {row["Version"] for row in wars} != {"5.1"} or {row["Version"] for row in participants} != {"5.1"}:
        raise ValueError("Unexpected intra-state source version")

    normalized_wars = []
    war_by_id = {}
    for row in wars:
        start = valid_year(row["StartYr1"])
        end = valid_year(row["EndYr1"])
        if start is None or end is None:
            continue
        record = {
            "war_id": row["WarNum"],
            "war_name": row["WarName"],
            "region_code": row["V5RegionNum"],
            "war_type": row["WarType"],
            "host_cow_code": row["CcodeA"],
            "state_side": row["SideA"],
            "challenger_side": row["SideB"],
            "internationalized": row["Intnl"],
            "start_year": start,
            "end_year": end,
            "duration_days": row["WDuratDays"],
            "outcome_code": row["Outcome"],
            "battle_deaths": row["TotalBDeaths"],
            "source_version": "5.1",
        }
        normalized_wars.append(record)
        war_by_id[row["WarNum"]] = record

    normalized_participants = []
    state_year_metrics = defaultdict(lambda: {
        "active_wars": set(),
        "war_onsets": set(),
        "challenger_victory_wars": set(),
        "total_battle_deaths_reported": 0,
    })
    for row in participants:
        start = valid_year(row["StartYr1"])
        end = valid_year(row["EndYr1"])
        code = valid_year(row["CcodeA"])
        if start is None or end is None or code is None:
            continue
        record = {
            "war_id": row["WarNum"],
            "war_name": row["WarName"],
            "cow_code": code,
            "state_name": row["SideA"],
            "war_type": row["WarType"],
            "internationalized": row["Intnl"],
            "start_year": start,
            "end_year": end,
            "outcome_code": row["Outcome"],
            "state_deaths": row["Deaths A"],
            "challenger_deaths": row["Deaths B"],
            "battle_deaths": row["TotalBDeaths"],
            "source_version": "5.1",
        }
        normalized_participants.append(record)
        deaths = valid_year(row["TotalBDeaths"]) or 0
        for year in range(start, end + 1):
            metric = state_year_metrics[(code, year)]
            metric["active_wars"].add(row["WarNum"])
            if year == start:
                metric["war_onsets"].add(row["WarNum"])
            if row["Outcome"] == "2":
                metric["challenger_victory_wars"].add(row["WarNum"])
            if year == end:
                metric["total_battle_deaths_reported"] += deaths

    state_year = []
    for (code, year), metric in sorted(state_year_metrics.items(), key=lambda item: (item[0][1], item[0][0])):
        state_year.append({
            "cow_code": code,
            "year": year,
            "active_intra_state_wars": len(metric["active_wars"]),
            "intra_state_war_onsets": len(metric["war_onsets"]),
            "challenger_victory_wars": len(metric["challenger_victory_wars"]),
            "battle_deaths_reported_at_end": metric["total_battle_deaths_reported"],
            "source_version": "5.1",
        })

    write(PROCESSED / "cow_intra_state_wars_v5_1.csv", normalized_wars)
    write(PROCESSED / "cow_intra_state_participants_v5_1.csv", normalized_participants)
    write(PROCESSED / "cow_intra_state_state_year_v5_1.csv", state_year)
    outcomes = defaultdict(int)
    for row in normalized_wars:
        outcomes[row["outcome_code"]] += 1
    manifest = {
        "sourceId": "cow_intra_state_wars",
        "sourceVersion": "v5.1",
        "sourceUrl": "https://correlatesofwar.org/wp-content/uploads/Intra-State-Wars-v5.1.zip",
        "archivePath": str(ARCHIVE.relative_to(ROOT)),
        "archiveSha256": checksum(ARCHIVE),
        "retrievedAt": "2026-10-07T14:07:00-04:00",
        "licenseDecision": "local analysis only; redistribution unresolved",
        "warRows": len(normalized_wars),
        "participantRows": len(normalized_participants),
        "stateYearRows": len(state_year),
        "coverage": [min(row["start_year"] for row in normalized_wars), max(row["end_year"] for row in normalized_wars)],
        "outcomeCounts": dict(sorted(outcomes.items())),
        "outcomeCodes": {"1":"state side wins", "2":"challenger side wins", "3":"compromise", "4":"transformed", "5":"ongoing", "6":"stalemate", "7":"continues below war threshold"},
        "limitations": [
            "Intra-state war is not equivalent to loss of sovereign system membership.",
            "Outcome codes describe war termination, not automatic consolidation or fragmentation.",
            "Battle-death missing-value codes are preserved in normalized source tables.",
            "Coverage ends in 2014."
        ]
    }
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    path = MANIFESTS / "cow_intra_state_wars_v5_1.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"wars": len(normalized_wars), "participants": len(normalized_participants), "stateYearRows": len(state_year), "coverage": manifest["coverage"], "outcomes": manifest["outcomeCounts"]}, indent=2))


if __name__ == "__main__":
    main()
