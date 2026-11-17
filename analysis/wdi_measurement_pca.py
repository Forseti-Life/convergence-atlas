#!/usr/bin/env python3
"""Partial empirical measurement PCA using six WDI indicators."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = "2026-10-06"
INPUT = ROOT / f"data/processed/wdi_state_year_{SNAPSHOT}.csv"
OUTPUT = ROOT / "analysis/output"
VARIABLES = [
    ("log_gdp", "GDP (log)", "gdp_current_usd", True),
    ("log_population", "Population (log)", "population_total", True),
    ("trade", "Trade % GDP", "trade_percent_gdp", False),
    ("education", "Secondary enrollment", "secondary_enrollment_gross_percent", False),
    ("rd", "R&D % GDP", "research_development_percent_gdp", False),
    ("log_gdp_per_capita", "Real GDP per capita (log)", "gdp_per_capita_constant_2015_usd", True),
]


def load_complete_cases() -> tuple[list[dict], np.ndarray]:
    with INPUT.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    complete = []
    values = []
    for row in rows:
        if any(row[source] == "" for _, _, source, _ in VARIABLES):
            continue
        vector = []
        valid = True
        for _, _, source, use_log in VARIABLES:
            value = float(row[source])
            if use_log:
                if value <= 0:
                    valid = False
                    break
                value = np.log(value)
            vector.append(value)
        if valid:
            complete.append(row)
            values.append(vector)
    return complete, np.array(values)


def pca(matrix: np.ndarray) -> dict:
    standardized = (matrix - matrix.mean(axis=0)) / matrix.std(axis=0, ddof=1)
    _, singular, vectors = np.linalg.svd(standardized, full_matrices=False)
    for index in range(len(vectors)):
        largest = np.argmax(np.abs(vectors[index]))
        if vectors[index, largest] < 0:
            vectors[index] *= -1
    eigenvalues = singular**2 / (len(matrix) - 1)
    explained = eigenvalues / eigenvalues.sum()
    return {
        "explained": explained,
        "vectors": vectors,
        "means": matrix.mean(axis=0),
        "standardDeviations": matrix.std(axis=0, ddof=1),
    }


def loading_records(result: dict) -> list[dict]:
    records = []
    for component, ratio in enumerate(result["explained"]):
        loadings = [
            {"variable": VARIABLES[index][0], "label": VARIABLES[index][1], "loading": float(result["vectors"][component, index])}
            for index in range(len(VARIABLES))
        ]
        loadings.sort(key=lambda item: abs(item["loading"]), reverse=True)
        records.append({"component": component + 1, "explainedVariance": float(ratio), "loadings": loadings})
    return records


def component_similarity(left: dict, right: dict, components: int = 3) -> list[float]:
    similarities = []
    for index in range(components):
        value = abs(float(np.dot(left["vectors"][index], right["vectors"][index])))
        similarities.append(value)
    return similarities


def main() -> None:
    complete, matrix = load_complete_cases()
    years = np.array([int(row["year"]) for row in complete])
    full = pca(matrix)
    early_mask = (years >= 1996) & (years <= 2010)
    late_mask = (years >= 2011) & (years <= 2025)
    early = pca(matrix[early_mask])
    late = pca(matrix[late_mask])
    similarities = component_similarity(early, late)
    countries = {row["world_bank_code"] for row in complete}

    results = {
        "metadata": {
            "analysisType": "partial empirical complete-case PCA",
            "source": "World Bank WDI",
            "snapshot": SNAPSHOT,
            "completeCases": len(complete),
            "countriesEconomies": len(countries),
            "yearRange": [int(years.min()), int(years.max())],
            "earlyCases": int(early_mask.sum()),
            "lateCases": int(late_mask.sum()),
            "selectionBiasWarning": "Selection bias: complete cases condition heavily on R&D and education availability; results are not representative of all countries or years."
        },
        "variables": [item[0] for item in VARIABLES],
        "components": loading_records(full),
        "periodStability": {
            "early": [1996, 2010],
            "late": [2011, 2025],
            "absoluteCosineSimilarityByComponent": similarities,
        },
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "wdi-measurement-pca.json").write_text(json.dumps(results, indent=2) + "\n")
    lines = [
        "# WDI Empirical Measurement PCA",
        "",
        "**Status:** Partial Phase 2 measurement test  ",
        f"**Complete cases:** {len(complete):,} across {len(countries)} countries/economies  ",
        f"**Years:** {years.min()}–{years.max()}",
        "",
        "> Complete cases are strongly selected by R&D and education availability. This is not a representative global Big Cycle factor and is not joined to transition outcomes.",
        "",
        "## Explained variance and loadings",
        "",
    ]
    for component in results["components"][:3]:
        lines.append(f"### PC{component['component']} — {component['explainedVariance'] * 100:.1f}%")
        lines.append("")
        lines.append("; ".join(f"{item['label']} `{item['loading']:+.3f}`" for item in component["loadings"]))
        lines.append("")
    lines.extend([
        "## Period stability",
        "",
        "Absolute cosine similarity compares same-numbered loading vectors in 1996–2010 and 2011–2025. Values near one indicate similar direction, but component swapping can make this diagnostic conservative.",
        "",
        "| Component | Absolute cosine similarity |",
        "|---:|---:|",
    ])
    for index, value in enumerate(similarities, start=1):
        lines.append(f"| PC{index} | {value:.3f} |")
    lines.extend([
        "",
        "## Gate C decision",
        "",
        "Gate C remains open. This six-variable complete-case analysis lacks debt, inequality, governance, reserve-currency, and material-power measures and cannot establish a universal Big Cycle construct.",
        "",
    ])
    (OUTPUT / "WDI_MEASUREMENT_PCA.md").write_text("\n".join(lines))
    print(json.dumps({
        "completeCases": len(complete),
        "countriesEconomies": len(countries),
        "yearRange": results["metadata"]["yearRange"],
        "explainedFirstThree": sum(item["explainedVariance"] for item in results["components"][:3]),
        "periodSimilarity": similarities,
    }, indent=2))


if __name__ == "__main__":
    main()
