#!/usr/bin/env python3
"""Validate COW wave-definition robustness analysis."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main():
    subprocess.run(["python3", str(ROOT / "analysis/cow_wave_robustness.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    result = json.loads((OUTPUT / "cow-wave-robustness.json").read_text())
    assert result["metadata"]["specificationCount"] == 40
    assert result["metadata"]["forecast"] is False
    assert result["grid"]["gapYears"] == [1, 3, 5, 7, 10]
    assert result["grid"]["minimumUniqueExits"] == [2, 3, 5, 10]
    assert len(result["baselineWaves"]) == 4
    assert abs(result["baselineMean"] - 0.1585536941227998) < 1e-12
    assert result["roundedDefault"] == 0.15
    assert len(result["leaveOneOut"]) == 4
    loo = [item["leaveOneOutMean"] for item in result["leaveOneOut"]]
    assert min(loo) < 0.121
    assert max(loo) > 0.20
    summary = result["summary"]
    assert summary["grossEstimatedSpecifications"] == 20
    assert summary["durableEstimatedSpecifications"] == 17
    assert summary["grossMeanMinimum"] < 0.10
    assert summary["grossMeanMaximum"] > 0.29
    assert summary["durableMeanMinimum"] < summary["durableMeanMaximum"]
    assert len(result["specifications"]) == 40
    assert all(item["mode"] in {"gross", "durable"} for item in result["specifications"])
    report = (OUTPUT / "COW_WAVE_ROBUSTNESS.md").read_text()
    assert "not a confidence interval" in report
    assert "distribution rather than one fixed default" in report
    assert "COW_WAVE_ROBUSTNESS" in (ROOT / "web/cow-wave-robustness.mjs").read_text()
    print("✓ 40 gross/durable wave-definition specifications")
    print("✓ four leave-one-major-wave-out estimates")
    print("✓ broad definition-sensitivity range disclosed")
    print("COW wave robustness validation passed.")


if __name__ == "__main__":
    main()
