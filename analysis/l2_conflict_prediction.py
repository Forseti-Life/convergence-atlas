#!/usr/bin/env python3
"""L2 benchmark: predict next-year MID onset, not institutional transition."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data/processed/l2_provisional_state_year.csv"
OUTPUT = ROOT / "analysis/output"
ECONOMIC = [
    "gdp_current_usd", "population_total", "trade_percent_gdp",
    "secondary_enrollment_gross_percent", "research_development_percent_gdp",
    "gdp_per_capita_constant_2015_usd",
]
GOVERNANCE = [
    "voice_accountability_estimate", "political_stability_estimate",
    "government_effectiveness_estimate", "regulatory_quality_estimate",
    "rule_of_law_estimate", "control_of_corruption_estimate",
]
LOG_COLUMNS = {"gdp_current_usd", "population_total", "gdp_per_capita_constant_2015_usd"}


def sigmoid(value: np.ndarray) -> np.ndarray:
    return 1 / (1 + np.exp(-np.clip(value, -35, 35)))


def fit_logistic(matrix: np.ndarray, target: np.ndarray, penalty: float = 1.0) -> np.ndarray:
    design = np.column_stack([np.ones(len(matrix)), matrix])
    coefficients = np.zeros(design.shape[1])
    regularizer = np.eye(design.shape[1]) * penalty
    regularizer[0, 0] = 0
    for _ in range(100):
        probability = sigmoid(design @ coefficients)
        weights = np.maximum(probability * (1 - probability), 1e-6)
        gradient = design.T @ (target - probability) - regularizer @ coefficients
        hessian = (design.T * weights) @ design + regularizer
        step = np.linalg.solve(hessian, gradient)
        coefficients += step
        if np.max(np.abs(step)) < 1e-8:
            break
    return coefficients


def predict(matrix: np.ndarray, coefficients: np.ndarray) -> np.ndarray:
    return sigmoid(np.column_stack([np.ones(len(matrix)), matrix]) @ coefficients)


def auc(target: np.ndarray, probability: np.ndarray) -> float:
    positives = probability[target == 1]
    negatives = probability[target == 0]
    if not len(positives) or not len(negatives):
        return 0.5
    comparisons = (positives[:, None] > negatives[None, :]).sum()
    ties = (positives[:, None] == negatives[None, :]).sum()
    return float((comparisons + 0.5 * ties) / (len(positives) * len(negatives)))


def metrics(target: np.ndarray, probability: np.ndarray) -> dict:
    clipped = np.clip(probability, 1e-9, 1 - 1e-9)
    return {
        "observations": len(target),
        "events": int(target.sum()),
        "eventRate": float(target.mean()),
        "brier": float(np.mean((probability - target) ** 2)),
        "logLoss": float(-np.mean(target * np.log(clipped) + (1 - target) * np.log(1 - clipped))),
        "auc": auc(target, probability),
        "meanPrediction": float(probability.mean()),
    }


def main() -> None:
    with INPUT.open(newline="", encoding="utf-8") as handle:
        source = list(csv.DictReader(handle))
    by_key = {(row["institution_id"], int(row["year"])): row for row in source}
    records = []
    all_features = ECONOMIC + GOVERNANCE
    for row in source:
        year = int(row["year"])
        next_row = by_key.get((row["institution_id"], year + 1))
        if not next_row or any(row[column] == "" for column in all_features):
            continue
        values = []
        valid = True
        for column in all_features:
            value = float(row[column])
            if column in LOG_COLUMNS:
                if value <= 0:
                    valid = False
                    break
                value = np.log(value)
            values.append(value)
        if valid:
            records.append({"year": year, "values": values, "target": int(next_row["mid_dispute_onsets"]) > 0})

    train = [row for row in records if row["year"] <= 2008]
    test = [row for row in records if row["year"] >= 2009]
    x_train = np.array([row["values"] for row in train])
    y_train = np.array([row["target"] for row in train], dtype=float)
    x_test = np.array([row["values"] for row in test])
    y_test = np.array([row["target"] for row in test], dtype=float)
    mean = x_train.mean(axis=0)
    standard_deviation = x_train.std(axis=0, ddof=1)
    x_train = (x_train - mean) / standard_deviation
    x_test = (x_test - mean) / standard_deviation

    definitions = {
        "null": [],
        "size_only": [0, 1],
        "economic": list(range(6)),
        "governance": list(range(6, 12)),
        "full": list(range(12)),
    }
    results = {}
    base_probability = np.full(len(y_test), y_train.mean())
    results["null"] = metrics(y_test, base_probability)
    for name, indices in definitions.items():
        if name == "null":
            continue
        coefficients = fit_logistic(x_train[:, indices], y_train)
        probability = predict(x_test[:, indices], coefficients)
        results[name] = {**metrics(y_test, probability), "coefficients": coefficients.tolist()}
    for item in results.values():
        item["brierImprovementVsNull"] = results["null"]["brier"] - item["brier"]
        item["logLossImprovementVsNull"] = results["null"]["logLoss"] - item["logLoss"]

    output = {
        "metadata": {
            "analysisType": "provisional next-year MID onset benchmark",
            "mappingStatus": "provisional_unreviewed",
            "predictionTarget": "Any MID dispute onset in year t+1",
            "trainYears": [1996, 2008],
            "testYears": [2009, 2014],
            "notInstitutionalTransition": True,
            "vintageLeakageWarning": "Current revised WDI/WGI histories are used and may differ from values available at prediction time."
        },
        "models": results,
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "l2-conflict-benchmark.json").write_text(json.dumps(output, indent=2) + "\n")
    lines = [
        "# L2 Next-Year MID Onset Benchmark",
        "",
        "**Status:** Provisional, unreviewed mappings, current revised histories  ",
        "**Target:** Any MID dispute onset in year t+1  ",
        "**Not an institutional-transition model**",
        "",
        "> This benchmark tests the conflict pathway only. It cannot validate consolidation, fragmentation, or Apex Institution dominance.",
        "",
        "| Model | Test rows | Events | Brier | Δ Brier vs null | Log loss | Δ log loss | AUC |",
        "|---|---:|---:|---:|---:|---:|---:|---:|",
    ]
    for name, item in results.items():
        lines.append(f"| {name} | {item['observations']} | {item['events']} | {item['brier']:.4f} | {item['brierImprovementVsNull']:+.4f} | {item['logLoss']:.4f} | {item['logLossImprovementVsNull']:+.4f} | {item['auc']:.3f} |")
    lines.extend([
        "",
        "## Guardrails",
        "",
        "- Mappings are provisional and unreviewed.",
        "- Current revised WDI/WGI values can leak later revisions into historical tests.",
        "- Complete-case selection is substantial.",
        "- MID onset is a conflict outcome, not institutional transition.",
        "- Model comparisons are exploratory and use one temporal split.",
        "",
    ])
    (OUTPUT / "L2_CONFLICT_BENCHMARK.md").write_text("\n".join(lines))
    print(json.dumps({name: {key: value for key, value in item.items() if key != "coefficients"} for name, item in results.items()}, indent=2))


if __name__ == "__main__":
    main()
