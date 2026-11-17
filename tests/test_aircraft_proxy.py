#!/usr/bin/env python3
"""Validate aircraft/aerospace consolidation proxy calculations."""

from __future__ import annotations

import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    proxy = json.loads((ROOT / "research/aerospace-consolidation-proxy.v1.json").read_text())
    observations = proxy["observations"]
    assert len(observations) == 4
    for item in observations:
        calculated = 1 - (item["playersAfter"] / item["playersBefore"])
        assert math.isclose(calculated, item["institutionLossProbability"], abs_tol=1e-12)
        assert item["sourceUrl"].startswith("https://")
    bounds = proxy["aircraftOnlyBounds"]
    assert math.isclose(bounds["lower"], 1 / 3)
    assert math.isclose(bounds["upper"], 5 / 7)
    assert math.isclose(bounds["midpoint"], (bounds["lower"] + bounds["upper"]) / 2)
    assert bounds["roundedScenarioDefault"] == 0.5
    assert len(proxy["lineageMarkers"]) >= 5
    assert "not a current large-commercial-airliner prime" in proxy["marketDefinition"]["militaryAerospace"]
    report = (ROOT / "docs/AIRCRAFT_MANUFACTURING_CONSOLIDATION_PROXY.md").read_text()
    assert "not an exhaustive census" in report.lower()
    assert "33.3%–71.4%" in report
    assert "mandatory-observability" in report
    print("✓ four bounded aerospace consolidation-wave observations")
    print("✓ observed 33.3%–71.4% Institution loss range")
    print("✓ 52.4% midpoint and rounded 50% scenario default")
    print("✓ market-segment and lineage limitations")
    print("Aircraft consolidation proxy validation passed.")


if __name__ == "__main__":
    main()
