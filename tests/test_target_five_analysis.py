#!/usr/bin/env python3
"""Validate target-five boundary and parameter-sweep analysis."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main():
    subprocess.run(["node", str(ROOT / "analysis/target_five_analysis.mjs")], cwd=ROOT, check=True, capture_output=True, text=True)
    paths = [OUTPUT / "target-five-analysis.json", OUTPUT / "target-five-analysis.csv", OUTPUT / "TARGET_FIVE_ANALYSIS.md", ROOT / "web/target-five-analysis.mjs"]
    before = [path.read_bytes() for path in paths]
    subprocess.run(["node", str(ROOT / "analysis/target_five_analysis.mjs")], cwd=ROOT, check=True, capture_output=True, text=True)
    assert before == [path.read_bytes() for path in paths]
    result = json.loads(paths[0].read_text())
    assert result["metadata"]["generated"] == "2026-10-09"
    assert result["metadata"]["baseYear"] == 2026
    assert result["metadata"]["horizonCalendarYear"] == 7026
    assert result["metadata"]["targetCount"] == 5
    assert result["metadata"]["startAgentsLocked"] == 225
    assert result["metadata"]["horizon"] == 5000
    assert result["metadata"]["forecast"] is False
    fastest = result["boundaries"]["fastest"]
    slowest = result["boundaries"]["longestBounded"]
    assert fastest["targetCalendarYear"] == 2029
    assert fastest["targetFiveProbability"] == 1
    assert fastest["effectiveInstitutionEventProbability"] == 0.95
    assert 0 < slowest["targetFiveProbability"] < 1
    assert result["boundaries"]["scope"]["unconstrainedLongestExists"] is False
    assert result["boundaries"]["scope"]["currentWaveResolutionYears"] == 3
    anchors = {item["name"]: item for item in result["anchors"]}
    cow = anchors["COW central"]
    assert cow["replicates"] == 1000
    assert cow["apexNearProbability"] < 0.01, "durable baseline does not produce Apex coordination within a century"
    assert anchors["COW central without acceleration"]["apexProbabilityCalendarYears"]["p50"] > cow["apexProbabilityCalendarYears"]["p50"]
    assert anchors["Durable COW mean loss"]["apexProbabilityCalendarYears"]["p50"] > cow["apexProbabilityCalendarYears"]["p50"], "15% core is faster than the 11.2% durable mean"
    assert anchors["Historical-only frequency; no current wave"]["apexProbabilityCalendarYears"]["p50"] > cow["apexProbabilityCalendarYears"]["p50"], "the coherent historical-only comparison removes the current wave and restores slower spacing"
    assert anchors["Historical-only frequency; no current wave"]["parameters"]["qualifyingShare"] == 0.36
    assert anchors["COW central without internal conflict"]["targetCalendarYear"] < cow["targetCalendarYear"]
    assert anchors["Aircraft midpoint · secondary"]["targetCalendarYear"] < anchors["Wartime gross exit"]["targetCalendarYear"] < anchors["German consolidation"]["targetCalendarYear"] < cow["targetCalendarYear"]
    assert anchors["Post-Cold-War"]["targetFiveProbability"] == 0
    assert cow["apexProbabilityCalendarYears"]["p25"] < cow["apexProbabilityCalendarYears"]["p50"] < cow["apexProbabilityCalendarYears"]["p75"] < cow["apexProbabilityCalendarYears"]["p95"]
    for anchor in anchors.values():
        assert 0 <= anchor["apexProbability"] <= anchor["targetFiveProbability"] <= 1
    assert len(result["interactions"]["frequency"]) == 25
    assert len(result["interactions"]["severityConflict"]) == 48
    acceleration = next(item for item in result["oneAtATimeSummary"] if item["parameter"] == "consolidationAcceleration")
    assert acceleration["reachedValues"] >= 5
    assert result["excludedFromStructuralTarget"] == ["institutionalAdoptionRate", "selectedYear"]
    assert "no finite unconstrained longest" in paths[2].read_text().lower()
    assert "Run share at five by 7026" in paths[2].read_text()
    assert "TARGET_FIVE_ANALYSIS" in paths[3].read_text()
    print("✓ fixed-2029 high-intensity preset, slow preset probability, and replicate event probabilities")
    print("✓ stochastic anchors, OAT sweep, and 73 interaction-grid cases")
    print("✓ seeded byte-identical target-five artifacts")
    print("Target-five analysis validation passed.")


if __name__ == "__main__":
    main()
