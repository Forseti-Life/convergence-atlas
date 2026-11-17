#!/usr/bin/env python3
"""Validate generated model insight diagnostics."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main() -> None:
    subprocess.run(["node", str(ROOT / "analysis/model_insight_sweep.mjs")], cwd=ROOT, check=True, capture_output=True, text=True)
    result = json.loads((OUTPUT / "model-insights.json").read_text())
    assert result["metadata"]["forecast"] is False
    assert result["metadata"]["horizon"] == 5000
    assert result["metadata"]["baseYear"] == 2026
    assert result["metadata"]["horizonCalendarYear"] == 7026
    assert result["oneAtATime"]["baseline"]["reached"] is True
    assert result["oneAtATime"]["baseline"]["dominanceCalendarYear"] is not None
    assert len(result["oneAtATime"]["ranges"]) == 12
    assert len(result["screening"]) == 11
    assert all(item["iterations"] == 192 for item in result["screening"])
    assert len(result["consolidationFragmentationMap"]) == 81
    assert len(result["economicSurface"]) == 25
    counterfactual = result["observabilityCounterfactual"]
    assert abs(counterfactual["conditioningProbability"] - 18 / 66) < 1e-12
    observability = {item["observability"]: item for item in counterfactual["rows"]}
    assert observability[1]["dominanceYear"] is not None
    assert observability[1]["dominanceCalendarYear"] <= observability[0.6]["dominanceCalendarYear"]
    assert observability[0.6]["dominanceYear"] is not None
    assert observability[0.5]["dominanceYear"] is None
    calibration = result["waveCalibration"]
    assert calibration["primary"] == "COW State System Membership v2024"
    assert calibration["roundedDefault"]["probability"] == 0.11
    assert abs(calibration["germanConsolidation"]["probability"] - 9 / 41) < 1e-12
    assert calibration["germanConsolidation"]["dominanceYear"] > calibration["wartimeInterruption"]["dominanceYear"]
    assert calibration["aircraftSecondary"]["midpoint"]["dominanceYear"] < calibration["wartimeInterruption"]["dominanceYear"]
    assert abs(calibration["aircraftSecondary"]["midpoint"]["probability"] - 0.5238095238095238) < 1e-12
    assert calibration["futurePermanenceRule"] == 1
    acceleration_rows = [item for item in result["oneAtATime"]["rows"] if item["parameter"] == "consolidationAcceleration"]
    assert acceleration_rows[0]["value"] == 0
    assert acceleration_rows[-1]["dominanceCalendarYear"] < acceleration_rows[1]["dominanceCalendarYear"]
    assert any(item["parameter"] == "consolidationAcceleration" for item in result["screening"])
    report = (OUTPUT / "MODEL_INSIGHTS.md").read_text()
    assert "not forecasts" in report
    assert "COW sovereign-wave calibration" in report
    assert "secondary corporate comparison" in report
    assert "Dominance calendar year" in report
    assert "No reach by 7026" in report
    web = (ROOT / "web/model-insights.mjs").read_text()
    assert "MODEL_INSIGHTS" in web
    print("✓ one-at-a-time and Morris-style sensitivity diagnostics")
    print("✓ 81-cell phase map and 25-cell economic surface")
    print("✓ observability feasibility threshold")
    print("✓ COW-primary wave calibration with secondary aircraft comparison")
    print("Model insight analysis validation passed.")


if __name__ == "__main__":
    main()
