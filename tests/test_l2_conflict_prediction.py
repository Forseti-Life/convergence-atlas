#!/usr/bin/env python3
"""Validate provisional next-year MID onset benchmark."""

from __future__ import annotations

import json
import math
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "analysis/output"


def main() -> None:
    subprocess.run(["python3", str(ROOT / "analysis/l2_conflict_prediction.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    result = json.loads((OUTPUT / "l2-conflict-benchmark.json").read_text())
    meta = result["metadata"]
    assert meta["analysisType"] == "provisional next-year MID onset benchmark"
    assert meta["mappingStatus"] == "provisional_unreviewed"
    assert meta["notInstitutionalTransition"] is True
    assert meta["trainYears"][-1] < meta["testYears"][0]
    assert "revised" in meta["vintageLeakageWarning"]
    assert set(result["models"]) == {"null", "size_only", "economic", "governance", "full"}
    for model in result["models"].values():
        assert model["observations"] > 100
        assert model["events"] > 10
        assert 0 <= model["brier"] <= 1
        assert model["logLoss"] > 0 and math.isfinite(model["logLoss"])
        assert 0 <= model["auc"] <= 1
    report = (OUTPUT / "L2_CONFLICT_BENCHMARK.md").read_text()
    assert "Not an institutional-transition model" in report
    assert "Mappings are provisional" in report
    assert "one temporal split" in report
    print("✓ strict 1996–2008 train and 2009–2014 test split")
    print("✓ null, size, economic, governance, and full benchmarks")
    print("✓ Brier, log-loss, AUC, and baseline improvements")
    print("✓ conflict-only and historical-vintage warnings")
    print("L2 conflict benchmark validation passed.")


if __name__ == "__main__":
    main()
