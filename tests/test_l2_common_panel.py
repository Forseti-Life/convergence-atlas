#!/usr/bin/env python3
"""Validate the provisional L2 common panel and feasibility gate."""

from __future__ import annotations

import csv
import json
import math
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    subprocess.run(["python3", str(ROOT / "analysis/l2_common_panel.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    results = json.loads((OUTPUT / "l2-common-panel.json").read_text())
    panel = read(ROOT / "data/processed/l2_provisional_state_year.csv")
    mappings = read(ROOT / "data/crosswalks/cow-wdi-provisional.csv")
    meta = results["metadata"]
    assert meta["analysisType"] == "provisional L2 common-panel feasibility"
    assert meta["mappingStatus"] == "provisional_unreviewed"
    assert meta["yearRange"] == [1996, 2014]
    assert meta["institutions"] > 150
    assert meta["panelRows"] == len(panel) > 2500
    assert meta["completeCases"] > 500
    assert len(mappings) == results["mappingCandidates"]
    assert all(row["mapping_status"] == "provisional_unreviewed" for row in panel)
    assert len({(row["institution_id"], row["year"]) for row in panel}) == len(panel)
    assert all(row["review_status"] == "unreviewed" for row in read(ROOT / "data/crosswalks/cow-v2024-candidates.csv"))
    assert results["eventSupport"]["membershipExitPredictiveGate"] == "FAIL"
    assert results["eventSupport"]["membershipExits"] < results["eventSupport"]["minimumEventsForTwelvePredictorRule"]
    assert math.isclose(sum(item["explainedVariance"] for item in results["components"]), 1, abs_tol=1e-9)
    assert all(0 <= item["coverageRate"] <= 1 for item in results["missingness"].values())
    report = (OUTPUT / "L2_COMMON_PANEL.md").read_text()
    assert "unreviewed candidate mappings" in report
    assert "not supported" in report
    assert "not a substitute" in report
    print(f"✓ {meta['panelRows']:,} provisional state-year rows across {meta['institutions']} Institutions")
    print(f"✓ {meta['completeCases']:,} complete economic/governance PCA cases")
    print("✓ explicit unreviewed-mapping status and missingness")
    print("✓ insufficient-event gate blocks confirmatory transition prediction")
    print("L2 common-panel validation passed.")


if __name__ == "__main__":
    main()
