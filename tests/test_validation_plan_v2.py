#!/usr/bin/env python3
"""Validate the practical Validation Plan v2 structure and claim policy."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    plan_path = ROOT / "docs/EMPIRICAL_VALIDATION_PLAN.md"
    archive_path = ROOT / "docs/archive/EMPIRICAL_VALIDATION_PLAN_V1.md"
    plan = plan_path.read_text()

    assert archive_path.exists() and archive_path.stat().st_size > 10000
    assert "Version:** 2.0" in plan
    assert "Practical Evidence and Claim Levels" in plan
    for level in ("L0 — Conceptual", "L1 — Sourced exploratory", "L2 — Empirically anchored", "L3 — Predictive"):
        assert level in plan
    phases = re.findall(r"^# Phase ([0-9]) —", plan, flags=re.MULTILINE)
    assert phases == [str(index) for index in range(10)]
    assert "L1 sourced exploratory model" in plan
    assert "Real-world probabilities, dates, causal claims, and predictive assertions" in plan
    assert "existing research" in plan.lower()
    assert "does not need to reproduce original research" in plan.lower()
    assert plan.count("## Gate ") >= 9
    assert "Passing L1 does not authorize L2 or L3 language" in plan

    calibration = (ROOT / "docs/CALIBRATION_POLICY.md").read_text()
    assert "existing literature" in calibration.lower()
    assert "Proxy-derived" in calibration
    assert "Original empirical work remains necessary" in calibration

    print("✓ four claim levels and ten practical phases")
    print("✓ original research-heavy plan preserved as v1 archive")
    print("✓ literature/proxy sufficiency and sensitivity requirements")
    print("✓ L3 forecasting remains separately gated")
    print("Validation Plan v2 test passed.")


if __name__ == "__main__":
    main()
