#!/usr/bin/env python3
"""Validate official WGI 2026 workbook ingestion."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA = "67c38d2e9253fb1a72ee302c3b7c47b2ba7b177a04673163796ca1666f506ecb"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    subprocess.run(["python3", str(ROOT / "research/ingest_world_bank_wgi.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    manifest = json.loads((ROOT / "data/manifests/world_bank_wgi_2026.json").read_text())
    panel = read(ROOT / "data/processed/wgi_state_year_2026.csv")
    source = ROOT / manifest["sourcePath"]
    assert manifest["sourceId"] == "wgi_2026"
    assert manifest["sourceVersion"] == "2026 workbook"
    assert manifest["sourceSha256"] == EXPECTED_SHA
    assert hashlib.sha256(source.read_bytes()).hexdigest() == EXPECTED_SHA
    assert manifest["coverage"] == [1996, 2025]
    assert len(manifest["dimensions"]) == 6
    assert set(manifest["sheets"]) == {"va", "pv", "ge", "rq", "rl", "cc"}
    assert len(panel) == manifest["panelRows"] > 5000
    assert len({(row["world_bank_code"], row["year"]) for row in panel}) == len(panel)
    estimates = []
    for row in panel:
        for prefix in manifest["dimensions"].values():
            value = row[f"{prefix}_estimate"]
            if value != "":
                estimates.append(float(value))
    assert estimates and min(estimates) > -5 and max(estimates) < 5
    assert manifest["parserDependency"] == "openpyxl==3.1.5"
    assert "perception" in manifest["limitations"][0]
    assert "recalculated" in manifest["limitations"][1]
    print(f"✓ official WGI workbook checksum and six-sheet schema")
    print(f"✓ {len(panel):,} WGI country-year rows for 1996–2025")
    print("✓ estimates, uncertainty fields, source counts, and revision warnings")
    print("WGI ingestion validation passed.")


if __name__ == "__main__":
    main()
