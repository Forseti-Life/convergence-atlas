#!/usr/bin/env python3
"""Validate COW Formal Alliances v4.1 ingestion."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA = "a2422bb361dcc4b0ab5ff0e46f65a7ab2b4c6eafa97bdd9910302dac75e786b6"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    archive = ROOT / "data/raw/cow_alliances/v4.1/alliance_v4.1_csv.zip"
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == EXPECTED_SHA
    subprocess.run(["python3", str(ROOT / "research/ingest_cow_alliances.py")], cwd=ROOT, check=True, capture_output=True, text=True)

    manifest = json.loads((ROOT / "data/manifests/cow_alliances_v4_1.json").read_text())
    state_year = read(ROOT / "data/processed/cow_alliance_state_year_v4_1.csv")
    system_year = read(ROOT / "data/processed/cow_alliance_system_year_v4_1.csv")
    assert manifest["sourceVersion"] == "v4.1"
    assert manifest["coverage"] == [1816, 2012]
    assert len(state_year) == manifest["stateYearRows"] > 0
    assert len(system_year) == manifest["systemYearRows"] == 197
    assert all(row["source_version"] == "4.1" for row in state_year)
    assert len({(row["cow_code"], row["year"]) for row in state_year}) == len(state_year)
    assert len({row["year"] for row in system_year}) == len(system_year)
    assert all(0 <= float(row["network_density"]) <= 1 for row in system_year)
    assert all(0 <= float(row["largest_component_share"]) <= 1 for row in system_year)
    assert all(0 <= float(row["degree_hhi"]) <= 1 for row in system_year)
    assert "Coverage ends in 2012" in manifest["limitations"][0]
    assert "redistribution" in manifest["licenseDecision"]

    print(f"✓ alliance archive checksum and v4.1 schema")
    print(f"✓ {len(state_year):,} state-year network rows")
    print(f"✓ {len(system_year)} system-year snapshots for 1816–2012")
    print("✓ density, component, degree, and concentration ranges")
    print("COW alliance ingestion validation passed.")


if __name__ == "__main__":
    main()
