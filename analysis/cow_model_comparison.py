#!/usr/bin/env python3
"""Compare annual COW membership-exit models in rolling-origin tests."""

import csv
import json
import math
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE_YEAR = ROOT / "data/processed/cow_state_year_v2024.csv"
OUTPUT = ROOT / "analysis/output"
ORIGINS = [1875, 1900, 1925, 1950, 1975, 2000]
PRODUCTION_CONFLICT_INTERVAL = 25
PRODUCTION_QUALIFYING_SHARE = 0.476
PRODUCTION_EVENT_PROBABILITY = 0.15
EPSILON = 1e-9


def read_rows(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def annual_panel():
    records = defaultdict(dict)
    for row in read_rows(STATE_YEAR):
        year, code = int(row["year"]), int(row["cow_code"])
        current = records[year].setdefault(code, {"entry": 0, "exit": 0})
        current["entry"] = max(current["entry"], int(row["entry_year"]))
        current["exit"] = max(current["exit"], int(row["exit_year"]))
    panel = {}
    for year, institutions in records.items():
        panel[year] = {
            "year": year,
            "exposure": len(institutions),
            "entries": sum(item["entry"] for item in institutions.values()),
            "exits": sum(item["exit"] for item in institutions.values()),
        }
    return panel


def sigmoid(value):
    if value >= 0:
        return 1 / (1 + math.exp(-min(value, 40)))
    exp_value = math.exp(max(value, -40))
    return exp_value / (1 + exp_value)


def solve(matrix, vector):
    size = len(vector)
    augmented = [matrix[row][:] + [vector[row]] for row in range(size)]
    for column in range(size):
        pivot = max(range(column, size), key=lambda row: abs(augmented[row][column]))
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        divisor = augmented[column][column]
        if abs(divisor) < 1e-12:
            divisor = 1e-12
        augmented[column] = [value / divisor for value in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            factor = augmented[row][column]
            augmented[row] = [left - factor * right for left, right in zip(augmented[row], augmented[column])]
    return [augmented[row][-1] for row in range(size)]


def recent(panel, year, field, years=5):
    return sum(panel.get(prior, {}).get(field, 0) for prior in range(year - years, year))


def features(name, panel, year):
    trend = (year - 1816) / 100
    exits = recent(panel, year, "exits")
    entries = recent(panel, year, "entries")
    active = panel[year]["exposure"] / 100
    if name == "trend":
        return [1, trend]
    if name == "birth_death":
        return [1, math.log1p(entries), math.log1p(exits), active]
    if name == "wave_memory":
        return [1, int(exits > 0), math.log1p(exits)]
    if name == "full_wave":
        return [1, trend, math.log1p(entries), math.log1p(exits), active]
    raise ValueError(name)


def fit_logistic(name, panel, train_years, ridge=0.1):
    width = len(features(name, panel, train_years[0]))
    total_exits = sum(panel[year]["exits"] for year in train_years)
    total_exposure = sum(panel[year]["exposure"] for year in train_years)
    base = min(1 - EPSILON, max(EPSILON, total_exits / total_exposure))
    beta = [math.log(base / (1 - base))] + [0] * (width - 1)
    for _ in range(60):
        gradient = [0.0] * width
        information = [[0.0] * width for _ in range(width)]
        for year in train_years:
            x = features(name, panel, year)
            n, y = panel[year]["exposure"], panel[year]["exits"]
            probability = sigmoid(sum(coefficient * value for coefficient, value in zip(beta, x)))
            weight = max(1e-12, n * probability * (1 - probability))
            for left in range(width):
                gradient[left] += (y - n * probability) * x[left]
                for right in range(width):
                    information[left][right] += weight * x[left] * x[right]
        for index in range(1, width):
            gradient[index] -= ridge * beta[index]
            information[index][index] += ridge
        step = solve(information, gradient)
        beta = [value + change for value, change in zip(beta, step)]
        if max(abs(change) for change in step) < 1e-9:
            break
    return beta


def predict(model, panel, year, fitted):
    if model == "no_exit":
        return 0.0
    if model == "production_prior":
        return PRODUCTION_QUALIFYING_SHARE * PRODUCTION_EVENT_PROBABILITY / PRODUCTION_CONFLICT_INTERVAL
    if model == "constant_hazard":
        return fitted
    x = features(model, panel, year)
    return sigmoid(sum(coefficient * value for coefficient, value in zip(fitted, x)))


def score(probability, exits, exposure):
    clipped = min(1 - EPSILON, max(EPSILON, probability))
    return {
        "brierTotal": exits * (1 - probability) ** 2 + (exposure - exits) * probability ** 2,
        "logLossTotal": -(exits * math.log(clipped) + (exposure - exits) * math.log(1 - clipped)),
        "absoluteCountError": abs(exits - exposure * probability),
    }


def run():
    panel = annual_panel()
    models = ["no_exit", "production_prior", "constant_hazard", "trend", "birth_death", "wave_memory", "full_wave"]
    folds, totals = [], {model: defaultdict(float) for model in models}
    for origin in ORIGINS:
        train_years = [year for year in sorted(panel) if year < origin]
        test_years = [year for year in range(origin, min(origin + 25, 2025)) if year in panel]
        train_exits = sum(panel[year]["exits"] for year in train_years)
        train_exposure = sum(panel[year]["exposure"] for year in train_years)
        fitted = {
            "no_exit": None,
            "production_prior": None,
            "constant_hazard": train_exits / train_exposure,
        }
        for model in ["trend", "birth_death", "wave_memory", "full_wave"]:
            fitted[model] = fit_logistic(model, panel, train_years)
        fold = {"origin": origin, "testEnd": test_years[-1], "trainYears": len(train_years), "testYears": len(test_years), "observedExits": sum(panel[year]["exits"] for year in test_years), "models": []}
        for model in models:
            aggregate = defaultdict(float)
            for year in test_years:
                probability = predict(model, panel, year, fitted[model])
                metrics = score(probability, panel[year]["exits"], panel[year]["exposure"])
                aggregate["exposure"] += panel[year]["exposure"]
                aggregate["observedExits"] += panel[year]["exits"]
                aggregate["predictedExits"] += panel[year]["exposure"] * probability
                for key, value in metrics.items():
                    aggregate[key] += value
            result = {
                "model": model,
                "exposure": int(aggregate["exposure"]),
                "observedExits": int(aggregate["observedExits"]),
                "predictedExits": aggregate["predictedExits"],
                "brier": aggregate["brierTotal"] / aggregate["exposure"],
                "logLoss": aggregate["logLossTotal"] / aggregate["exposure"],
                "annualExitCountMae": aggregate["absoluteCountError"] / len(test_years),
            }
            fold["models"].append(result)
            for key in ["exposure", "observedExits", "predictedExits", "brierTotal", "logLossTotal", "absoluteCountError"]:
                totals[model][key] += aggregate[key]
            totals[model]["testYears"] += len(test_years)
        folds.append(fold)
    summary = []
    for model in models:
        item = totals[model]
        summary.append({
            "model": model,
            "exposure": int(item["exposure"]),
            "observedExits": int(item["observedExits"]),
            "predictedExits": item["predictedExits"],
            "brier": item["brierTotal"] / item["exposure"],
            "logLoss": item["logLossTotal"] / item["exposure"],
            "annualExitCountMae": item["absoluteCountError"] / item["testYears"],
        })
    return {"metadata": {"generated": "2026-10-09", "origins": ORIGINS, "testBlockYears": 25, "forecast": False}, "models": models, "summary": sorted(summary, key=lambda item: item["logLoss"]), "folds": folds, "limitations": ["The comparison predicts COW membership exit, not permanent subjugation.", "No-exit probabilities are clipped to 1e-9 only when calculating finite log loss.", "Wave-memory test features use only observed prior years, including prior years within each test block.", "The production prior is a reduced-form annual mapping, not the full structural simulation.", "Sparse exits make all estimates unstable."]}


def write_outputs(result):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "cow-model-comparison.json").write_text(json.dumps(result, indent=2) + "\n")
    with (OUTPUT / "cow-model-comparison.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(result["summary"][0]))
        writer.writeheader(); writer.writerows(result["summary"])
    lines = ["# COW Exit Model Comparison", "", "**Status:** Rolling-origin descriptive benchmark; not an Apex Institution forecast", "", "| Model | Predicted exits | Observed exits | Brier | Log loss | Annual count MAE |", "|---|---:|---:|---:|---:|---:|"]
    for row in result["summary"]:
        lines.append(f"| {row['model']} | {row['predictedExits']:.2f} | {row['observedExits']} | {row['brier']:.6f} | {row['logLoss']:.6f} | {row['annualExitCountMae']:.3f} |")
    by_model = {row["model"]: row for row in result["summary"]}
    best = result["summary"][0]
    lines.extend([
        "",
        "## Findings",
        "",
        f"- `{best['model']}` has the lowest held-out log loss ({best['logLoss']:.6f}).",
        f"- The production prior predicts {by_model['production_prior']['predictedExits']:.1f} exits versus {by_model['production_prior']['observedExits']} observed, so its favorable proper score does not mean its event count is calibrated.",
        f"- The richer full-wave model has worse log loss ({by_model['full_wave']['logLoss']:.6f}) than the constant-hazard model ({by_model['constant_hazard']['logLoss']:.6f}).",
        f"- The no-exit model has the lowest annual count MAE ({by_model['no_exit']['annualExitCountMae']:.3f}) because exits are rare, but its asserted zero risk is severely penalized by log loss when exits occur.",
        "",
        "Lower scores are better. Ranking by log loss does not establish causality; it tests whether added structure improves chronological prediction of the narrow COW exit target.",
        "",
        "## Limitations",
        "",
    ])
    lines.extend(f"- {item}" for item in result["limitations"])
    (OUTPUT / "COW_MODEL_COMPARISON.md").write_text("\n".join(lines) + "\n")
    (ROOT / "web/cow-model-comparison.mjs").write_text(f"// Generated by analysis/cow_model_comparison.py; do not edit manually.\nexport const COW_MODEL_COMPARISON = Object.freeze({json.dumps(result, separators=(',', ':'))});\n")


def main():
    result = run(); write_outputs(result)
    print(json.dumps({"summary": result["summary"]}, indent=2))


if __name__ == "__main__":
    main()
