#!/usr/bin/env python3
"""Validate the observable COW exit taxonomy."""

from __future__ import annotations

import csv
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    subprocess.run(["python3", str(ROOT / "analysis/classify_cow_exits.py")], cwd=ROOT, check=True, capture_output=True, text=True)
    with (ROOT / "data/processed/cow_exit_taxonomy_v1.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    summary = json.loads((ROOT / "analysis/output/cow-exit-taxonomy.json").read_text())
    assert len(rows) == summary["exits"] == 49
    assert sum(summary["categoryCounts"].values()) == 49
    assert len({row["exit_id"] for row in rows}) == 49
    allowed = {
        "same_code_interruption_reentry",
        "immediate_successor_entry_candidate",
        "nearby_system_entry_candidate",
        "terminal_exit_unclassified",
    }
    assert {row["observable_category"] for row in rows} <= allowed
    assert all(row["causal_transition_type"] == "" for row in rows)
    assert all(row["causal_review_status"] == "unreviewed" for row in rows)
    assert summary["causalLabelsReviewed"] == 0
    assert any(row["same_code_reentry_date"] for row in rows)
    assert any(row["nearby_entry_candidates"] for row in rows)
    report = (ROOT / "analysis/output/COW_EXIT_TAXONOMY.md").read_text()
    assert "non-causal" in report
    assert "not proof" in report
    print("✓ all 49 COW exits receive one observable category")
    print("✓ re-entry and nearby-entry candidate rules")
    print("✓ zero unreviewed causal labels asserted")
    print("COW exit taxonomy validation passed.")


if __name__ == "__main__":
    main()
