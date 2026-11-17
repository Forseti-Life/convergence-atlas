#!/usr/bin/env python3
"""Descriptive COW alliance network versus MID conflict diagnostic."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
PROCESSED = ROOT / "data/processed"
OUTPUT = ROOT / "analysis/output"


def read_by_year(path: Path) -> dict[int, dict[str, float]]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    result = {}
    for row in rows:
        year = int(row["year"])
        result[year] = {key: float(value) for key, value in row.items() if key not in {"year", "source_version"}}
    return result


def ranks(values: np.ndarray) -> np.ndarray:
    order = np.argsort(values, kind="mergesort")
    result = np.empty(len(values), dtype=float)
    index = 0
    while index < len(values):
        end = index
        while end + 1 < len(values) and values[order[end + 1]] == values[order[index]]:
            end += 1
        result[order[index:end + 1]] = (index + end) / 2 + 1
        index = end + 1
    return result


def corr(left: np.ndarray, right: np.ndarray) -> float:
    if len(left) < 3 or np.std(left) == 0 or np.std(right) == 0:
        return 0.0
    return float(np.corrcoef(left, right)[0, 1])


def main() -> None:
    alliance = read_by_year(PROCESSED / "cow_alliance_system_year_v4_1.csv")
    mids = read_by_year(PROCESSED / "cow_mid_system_year_v5.csv")
    years = sorted(set(alliance) & set(mids))
    features = ["network_density", "largest_component_share", "degree_hhi", "max_degree"]
    outcomes = ["dispute_onsets", "war_onsets"]
    correlations = []

    for feature in features:
        x = np.array([alliance[year][feature] for year in years])
        dx = np.diff(x)
        for outcome in outcomes:
            y = np.array([mids[year][outcome] for year in years])
            dy = np.diff(y)
            next_y = np.array([mids.get(year + 1, {}).get(outcome, np.nan) for year in years])
            valid = ~np.isnan(next_y)
            correlations.append({
                "feature": feature,
                "outcome": outcome,
                "pearsonLevel": corr(x, y),
                "spearmanLevel": corr(ranks(x), ranks(y)),
                "pearsonFirstDifference": corr(dx, dy),
                "spearmanFirstDifference": corr(ranks(dx), ranks(dy)),
                "pearsonNextYear": corr(x[valid], next_y[valid]),
                "observations": len(years),
            })

    strongest = sorted(correlations, key=lambda item: abs(item["spearmanFirstDifference"]), reverse=True)
    results = {
        "metadata": {
            "analysisType": "descriptive network-conflict diagnostic",
            "allianceVersion": "v4.1",
            "midVersion": "v5.0",
            "coverage": [min(years), max(years)],
            "observations": len(years),
            "causalClaim": False,
        },
        "correlations": correlations,
        "strongestFirstDifference": strongest[:5],
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "cow-network-conflict.json").write_text(json.dumps(results, indent=2) + "\n")

    lines = [
        "# COW Alliance Network and Conflict Diagnostic",
        "",
        "**Status:** Descriptive; no causal claim  ",
        f"**Coverage:** {min(years)}–{max(years)} ({len(years)} overlapping annual observations)",
        "",
        "> Alliance coverage ends in 2012 and MID coverage ends in 2014. Correlation can reflect system growth, coding changes, omitted variables, or reverse causation.",
        "",
        "## Correlations",
        "",
        "| Alliance feature | Conflict outcome | Spearman level | Spearman first difference | Pearson next year |",
        "|---|---|---:|---:|---:|",
    ]
    for item in correlations:
        lines.append(
            f"| {item['feature']} | {item['outcome']} | {item['spearmanLevel']:+.3f} "
            f"| {item['spearmanFirstDifference']:+.3f} | {item['pearsonNextYear']:+.3f} |"
        )
    lines.extend([
        "",
        "## Guardrails",
        "",
        "- Level correlations are especially vulnerable to common time trends.",
        "- First differences reduce but do not eliminate confounding or simultaneity.",
        "- Alliance structure may respond to conflict expectations, creating reverse causation.",
        "- This diagnostic does not test trade, finance, ownership, infrastructure, or corporate networks.",
        "- Phase 5 remains partial and Gate F remains unevaluated.",
        "",
    ])
    (OUTPUT / "COW_NETWORK_CONFLICT.md").write_text("\n".join(lines))
    print(json.dumps({"years": len(years), "coverage": [min(years), max(years)], "strongest": strongest[0]}, indent=2))


if __name__ == "__main__":
    main()
