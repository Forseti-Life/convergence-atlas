#!/usr/bin/env python3
"""Validate Phase 1 data scaffolding without claiming external mappings are complete."""

from __future__ import annotations

import csv
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CROSSWALK = ROOT / "data" / "crosswalks" / "institution-identifiers.csv"
CATALOG = ROOT / "data" / "catalog.yml"


def main() -> None:
    subprocess.run(
        ["node", str(ROOT / "research" / "generate_crosswalk_seed.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    before = CROSSWALK.read_bytes()
    subprocess.run(
        ["node", str(ROOT / "research" / "generate_crosswalk_seed.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    assert CROSSWALK.read_bytes() == before, "crosswalk seed generation must be deterministic"

    with CROSSWALK.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    assert len(rows) == 195
    assert len({row["institution_id"] for row in rows}) == 195
    assert len({row["canonical_name"] for row in rows}) == 195
    assert all(row["entity_type"] == "state" for row in rows)
    assert all(row["mapping_status"] == "unresolved" for row in rows)
    assert all(not row["iso_alpha2"] for row in rows)
    assert all(not row["iso_alpha3"] for row in rows)
    assert all(not row["cow_code"] for row in rows)
    assert all(not row["world_bank_code"] for row in rows)
    assert all(not row["ucdp_gwno"] for row in rows)
    assert not any("Amazon" in row["canonical_name"] or "Meta Platforms" in row["canonical_name"] for row in rows)

    catalog = CATALOG.read_text(encoding="utf-8")
    assert 'catalog_version: "1.1.0"' in catalog
    assert "license_review_required: true" in catalog
    assert "corporate_data_deferred: true" in catalog
    assert catalog.count("source_id:") == 13
    assert "manual_access_and_license_review_required" in catalog
    assert "ingested_local_noncommercial_snapshot" in catalog
    assert "ingested_official_workbook_local_noncommercial" in catalog

    schema = (ROOT / "data" / "crosswalks" / "SCHEMA.md").read_text(encoding="utf-8")
    for column in rows[0]:
        assert f"`{column}`" in schema, f"schema does not document {column}"

    print("✓ 195 unique state-only crosswalk seed rows")
    print("✓ external identifiers remain explicitly unresolved")
    print("✓ deterministic generation and documented schema")
    print("✓ thirteen-source ingestion catalog with license gates")
    print("Phase 1 data scaffold validation passed.")


if __name__ == "__main__":
    main()
