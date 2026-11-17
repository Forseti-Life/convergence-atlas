#!/usr/bin/env python3
"""Validate World Bank WDI snapshot ingestion."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = "2026-10-06"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    subprocess.run(["python3", str(ROOT / "research/ingest_world_bank_wdi.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    manifest = json.loads((ROOT / f"data/manifests/world_bank_wdi_{SNAPSHOT}.json").read_text())
    panel = read(ROOT / f"data/processed/wdi_state_year_{SNAPSHOT}.csv")
    candidates = read(ROOT / f"data/crosswalks/wdi-{SNAPSHOT}-candidates.csv")

    assert manifest["apiVersion"] == "v2"
    assert manifest["snapshot"] == SNAPSHOT
    assert len(manifest["indicators"]) == 6
    assert len(panel) == manifest["panelRows"] > 10000
    assert len(candidates) == 195
    assert manifest["crosswalkCandidates"]["verified"] == 0
    assert all(row["review_status"] == "unreviewed" for row in candidates)
    assert all(row["candidate_status"] != "verified" for row in candidates)
    assert min(int(row["year"]) for row in panel) == 1960
    assert max(int(row["year"]) for row in panel) == 2025
    assert len({(row["world_bank_code"], row["year"]) for row in panel}) == len(panel)

    for relative, expected in manifest["rawFiles"].items():
        assert hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() == expected
    for item in manifest["missingness"].values():
        assert 0 <= item["coverageRate"] <= 1
        assert item["nonMissing"] > 0
    assert "revised historical values" in manifest["limitations"][1]
    assert "non-commercial" in manifest["licenseDecision"]

    print(f"✓ {manifest['countryRecords']} World Bank country/economy records")
    print(f"✓ {len(panel):,} country-year rows across six indicators")
    print("✓ raw JSON checksums and indicator missingness")
    print(f"✓ {manifest['crosswalkCandidates']['provisional']} provisional candidates; zero verified")
    print("World Bank WDI ingestion validation passed.")


if __name__ == "__main__":
    main()
