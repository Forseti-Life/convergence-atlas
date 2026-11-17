#!/usr/bin/env python3
"""Validate partial empirical WDI measurement PCA."""

from __future__ import annotations

import json
import math
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main() -> None:
    subprocess.run(["python3", str(ROOT / "analysis/wdi_measurement_pca.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    result = json.loads((OUTPUT / "wdi-measurement-pca.json").read_text())
    meta = result["metadata"]
    assert meta["analysisType"] == "partial empirical complete-case PCA"
    assert meta["completeCases"] > 500
    assert meta["countriesEconomies"] > 50
    assert meta["earlyCases"] > 100
    assert meta["lateCases"] > 100
    assert "selection" in meta["selectionBiasWarning"].lower()
    assert len(result["variables"]) == 6
    assert len(result["components"]) == 6
    assert math.isclose(sum(item["explainedVariance"] for item in result["components"]), 1, abs_tol=1e-9)
    assert all(len(item["loadings"]) == 6 for item in result["components"])
    similarities = result["periodStability"]["absoluteCosineSimilarityByComponent"]
    assert len(similarities) == 3
    assert all(0 <= value <= 1 for value in similarities)
    report = (OUTPUT / "WDI_MEASUREMENT_PCA.md").read_text()
    assert "strongly selected" in report
    assert "Gate C remains open" in report
    assert "cannot establish a universal Big Cycle construct" in report
    print(f"✓ {meta['completeCases']:,} complete cases across {meta['countriesEconomies']} countries/economies")
    print("✓ six-variable empirical PCA and explained variance")
    print("✓ early/late period loading-stability diagnostics")
    print("✓ selection-bias warning and Gate C remains open")
    print("WDI measurement PCA validation passed.")


if __name__ == "__main__":
    main()
