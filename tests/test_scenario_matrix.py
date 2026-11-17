#!/usr/bin/env python3
"""Validate the generated ten-scenario challenge matrix."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main():
    subprocess.run(["node", str(ROOT / "analysis/generate_scenario_matrix.mjs")], cwd=ROOT, check=True, capture_output=True, text=True)
    paths = [OUTPUT / "scenario-matrix.json", OUTPUT / "scenario-matrix.csv", OUTPUT / "SCENARIO_MATRIX.md", ROOT / "web/scenario-matrix.mjs"]
    before = [path.read_bytes() for path in paths]
    subprocess.run(["node", str(ROOT / "analysis/generate_scenario_matrix.mjs")], cwd=ROOT, check=True, capture_output=True, text=True)
    assert before == [path.read_bytes() for path in paths]
    result = json.loads(paths[0].read_text())
    assert result["metadata"]["scenarioCount"] == 11
    assert result["metadata"]["horizon"] == 5000
    assert result["metadata"]["baseYear"] == 2026
    assert result["metadata"]["horizonCalendarYear"] == 7026
    assert result["metadata"]["forecast"] is False
    scenarios = {item["id"]: item for item in result["scenarios"]}
    assert len(scenarios) == 11
    cow = scenarios["cow-central"]
    assert cow["replicates"] == 1000
    assert cow["apexNearProbability"] < 0.01
    assert scenarios["cow-no-acceleration"]["apexProbabilityCalendarYears"]["p50"] > cow["apexProbabilityCalendarYears"]["p50"], "acceleration pulls the median Apex year earlier"
    assert scenarios["wartime-gross-exit"]["dominanceCalendarYear"] < scenarios["german-consolidation"]["dominanceCalendarYear"] < cow["dominanceCalendarYear"]
    assert all(0 <= item["apexProbability"] <= item["targetFiveProbability"] <= 1 for item in scenarios.values())
    assert scenarios["aircraft-secondary"]["category"] == "secondary corporate"
    assert scenarios["fragmentation-counter-wave"]["apexProbability"] < 0.5
    assert scenarios["post-cold-war"]["apexProbability"] == 0
    report = paths[2].read_text()
    assert "not forecasts" in report
    assert "unconditional-defeat rule" in report
    assert "7026" in report
    assert "Apex run share by 7026" in report
    print("✓ ten deterministic challenge scenarios and byte-identical regeneration")
    print("✓ sovereign anchors, secondary corporate case, and mechanism challenges")
    print("Scenario matrix validation passed.")


if __name__ == "__main__":
    main()
