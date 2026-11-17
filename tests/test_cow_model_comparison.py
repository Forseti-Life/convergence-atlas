#!/usr/bin/env python3
"""Validate chronological COW exit-model comparison."""

import json
import math
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main():
    subprocess.run(["python3", str(ROOT / "analysis/cow_model_comparison.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    result = json.loads((OUTPUT / "cow-model-comparison.json").read_text())
    assert result["metadata"]["origins"] == [1875, 1900, 1925, 1950, 1975, 2000]
    assert result["metadata"]["testBlockYears"] == 25
    assert result["metadata"]["forecast"] is False
    assert len(result["folds"]) == 6
    assert len(result["models"]) == 7
    assert set(result["models"]) == {"no_exit", "production_prior", "constant_hazard", "trend", "birth_death", "wave_memory", "full_wave"}
    summary = {item["model"]: item for item in result["summary"]}
    assert all(item["exposure"] == 15525 for item in summary.values())
    assert all(item["observedExits"] == 35 for item in summary.values())
    assert all(math.isfinite(item["brier"]) and math.isfinite(item["logLoss"]) for item in summary.values())
    assert result["summary"][0]["model"] == "production_prior"
    assert 15 < summary["production_prior"]["predictedExits"] < summary["constant_hazard"]["predictedExits"]
    assert summary["constant_hazard"]["predictedExits"] > 80
    assert summary["full_wave"]["logLoss"] > summary["constant_hazard"]["logLoss"]
    assert summary["no_exit"]["annualExitCountMae"] < summary["full_wave"]["annualExitCountMae"]
    assert all(fold["testEnd"] - fold["origin"] == 24 for fold in result["folds"])
    assert "not permanent subjugation" in result["limitations"][0]
    report = (OUTPUT / "COW_MODEL_COMPARISON.md").read_text()
    assert "production prior predicts" in report
    assert "richer full-wave model has worse log loss" in report
    assert "does not mean its event count is calibrated" in report
    assert "COW_MODEL_COMPARISON" in (ROOT / "web/cow-model-comparison.mjs").read_text()
    print("✓ six chronological 25-year test blocks and seven models")
    print("✓ proper scores retain unfavorable full-wave results")
    print("✓ narrow COW-exit target and sparse-event limits disclosed")
    print("COW model comparison validation passed.")


if __name__ == "__main__":
    main()
