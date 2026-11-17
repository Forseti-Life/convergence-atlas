#!/usr/bin/env python3
"""Validate COW Intra-State War v5.1 ingestion."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA = "b2d1f4892d3cbb02604cf8e506c5c2c3e87fb85df75276f69b1089e67fb25236"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    archive = ROOT / "data/raw/cow_intra_state_wars/v5.1/Intra-State-Wars-v5.1.zip"
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == EXPECTED_SHA
    subprocess.run(["python3", str(ROOT / "research/ingest_cow_intra_state_wars.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    manifest = json.loads((ROOT / "data/manifests/cow_intra_state_wars_v5_1.json").read_text())
    wars = read(ROOT / "data/processed/cow_intra_state_wars_v5_1.csv")
    participants = read(ROOT / "data/processed/cow_intra_state_participants_v5_1.csv")
    state_year = read(ROOT / "data/processed/cow_intra_state_state_year_v5_1.csv")
    assert manifest["sourceVersion"] == "v5.1"
    assert manifest["coverage"] == [1818, 2014]
    assert len(wars) == manifest["warRows"] > 300
    assert len(participants) == manifest["participantRows"] >= len(wars)
    assert len(state_year) == manifest["stateYearRows"] > 500
    assert set(manifest["outcomeCodes"]) == {"1", "2", "3", "4", "5", "6", "7"}
    assert int(manifest["outcomeCounts"]["1"]) > 0
    assert int(manifest["outcomeCounts"]["2"]) > 0
    assert len({(row["cow_code"], row["year"]) for row in state_year}) == len(state_year)
    assert all(row["source_version"] == "5.1" for row in state_year)
    assert "not equivalent" in manifest["limitations"][0]
    print(f"✓ Intra-State War v5.1 archive checksum")
    print(f"✓ {len(wars)} wars, {len(participants)} participants, {len(state_year):,} state-year rows")
    print("✓ seven documented outcome codes and semantic warnings")
    print("Intra-state war ingestion validation passed.")


if __name__ == "__main__":
    main()
