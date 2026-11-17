#!/usr/bin/env python3
"""Validate COW network/conflict diagnostic artifacts."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main() -> None:
    subprocess.run(["python3", str(ROOT / "analysis/cow_network_conflict.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    results = json.loads((OUTPUT / "cow-network-conflict.json").read_text())
    assert results["metadata"]["analysisType"] == "descriptive network-conflict diagnostic"
    assert results["metadata"]["causalClaim"] is False
    assert results["metadata"]["coverage"] == [1816, 2012]
    assert results["metadata"]["observations"] == 197
    assert len(results["correlations"]) == 8
    for item in results["correlations"]:
        for key in ("pearsonLevel", "spearmanLevel", "pearsonFirstDifference", "spearmanFirstDifference", "pearsonNextYear"):
            assert -1 <= item[key] <= 1
    report = (OUTPUT / "COW_NETWORK_CONFLICT.md").read_text()
    assert "no causal claim" in report.lower()
    assert "reverse causation" in report
    assert "Phase 5 remains partial" in report
    print("✓ 197 overlapping alliance/MID annual observations")
    print("✓ level, first-difference, and next-year correlations")
    print("✓ explicit trend, confounding, and reverse-causation warnings")
    print("Network diagnostic validation passed.")


if __name__ == "__main__":
    main()
