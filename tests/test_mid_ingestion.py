#!/usr/bin/env python3
"""Validate COW MID v5.0 ingestion."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA = "f1d2f47ed02cd62e348e755a37108e302cb6a6e576a5fa03f6f7a8d5cbdc8009"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    archive = ROOT / "data/raw/cow_mids/v5.0/MID-5-Data-and-Supporting-Materials.zip"
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == EXPECTED_SHA
    subprocess.run(["python3", str(ROOT / "research/ingest_cow_mids.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    manifest = json.loads((ROOT / "data/manifests/cow_mids_v5.json").read_text())
    disputes = read(ROOT / "data/processed/cow_mid_disputes_v5.csv")
    participants = read(ROOT / "data/processed/cow_mid_participants_v5.csv")
    state_year = read(ROOT / "data/processed/cow_mid_state_year_v5.csv")
    system_year = read(ROOT / "data/processed/cow_mid_system_year_v5.csv")

    assert len(disputes) == manifest["nativeDisputes"] > 0
    assert len(participants) == manifest["nativeParticipants"] > len(disputes)
    assert len(state_year) == manifest["stateYearRows"] > 0
    assert len(system_year) == manifest["systemYearRows"]
    assert manifest["coverage"] == [1816, 2014]
    assert len({row["dispute_id"] for row in disputes}) == len(disputes)
    assert len({(row["cow_code"], row["year"]) for row in state_year}) == len(state_year)
    assert all(0 <= int(row["max_hostility_level"]) <= 5 for row in state_year)
    assert any(int(row["war_onsets"]) > 0 for row in system_year)
    assert any(int(row["fatal_dispute_onsets"]) > 0 for row in system_year)
    assert "categorical code" in manifest["limitations"][1]
    assert "ends in 2014" in manifest["limitations"][0]

    print(f"✓ MID v5 archive checksum and source version")
    print(f"✓ {len(disputes):,} disputes and {len(participants):,} participant records")
    print(f"✓ {len(state_year):,} state-year and {len(system_year)} system-year rows")
    print("✓ hostility, fatality-category, war-onset, and coverage checks")
    print("MID ingestion validation passed.")


if __name__ == "__main__":
    main()
