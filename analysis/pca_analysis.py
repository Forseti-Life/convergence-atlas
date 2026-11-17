#!/usr/bin/env python3
"""PCA and scenario summaries for the Institutional Agents model.

This is PCA of synthetic model assumptions, not empirical observations.
"""

from __future__ import annotations

import csv
import json
import math
import statistics
from collections import defaultdict
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
BASE_YEAR = 2026
OUTPUT = ROOT / "analysis" / "output"
CSV_PATH = OUTPUT / "scenario-results.csv"
JSON_PATH = OUTPUT / "pca-results.json"
REPORT_PATH = OUTPUT / "PCA_REPORT.md"
WEB_PATH = ROOT / "web" / "analysis-results.mjs"

INPUT_COLUMNS = [
    "conflictInterval",
    "qualifyingShare",
    "institutionEventProbability",
    "fragmentationPerEvent",
    "internalConflict",
    "institutionalAdoptionRate",
    "leadingInstitutionStrength",
    "systemicCycleStress",
    "economicCoupling",
    "spreadRate",
    "consolidationAcceleration",
]

DISPLAY_NAMES = {
    "conflictInterval": "Conflict interval",
    "qualifyingShare": "Qualifying conflict share",
    "institutionEventProbability": "Institution event probability",
    "fragmentationPerEvent": "External fragments",
    "internalConflict": "Internal conflict",
    "institutionalAdoptionRate": "Institutional adoption",
    "leadingInstitutionStrength": "Institution strength",
    "systemicCycleStress": "Systemic stress",
    "economicCoupling": "Economic coupling",
    "spreadRate": "AI architecture spread",
    "consolidationAcceleration": "AI consolidation acceleration",
}


def load_rows() -> list[dict[str, str]]:
    with CSV_PATH.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def rankdata(values: np.ndarray) -> np.ndarray:
    order = np.argsort(values, kind="mergesort")
    ranks = np.empty(len(values), dtype=float)
    index = 0
    while index < len(values):
        end = index
        while end + 1 < len(values) and values[order[end + 1]] == values[order[index]]:
            end += 1
        average_rank = (index + end) / 2 + 1
        ranks[order[index : end + 1]] = average_rank
        index = end + 1
    return ranks


def safe_correlation(left: np.ndarray, right: np.ndarray) -> float:
    if np.std(left) == 0 or np.std(right) == 0:
        return 0.0
    return float(np.corrcoef(left, right)[0, 1])


def orient_components(vectors: np.ndarray) -> np.ndarray:
    oriented = vectors.copy()
    for component in range(oriented.shape[0]):
        largest = int(np.argmax(np.abs(oriented[component])))
        if oriented[component, largest] < 0:
            oriented[component] *= -1
    return oriented


def calculate_pca(rows: list[dict[str, str]]) -> tuple[dict, np.ndarray]:
    matrix = np.array([[float(row[column]) for column in INPUT_COLUMNS] for row in rows])
    means = matrix.mean(axis=0)
    standard_deviations = matrix.std(axis=0, ddof=1)
    standardized = (matrix - means) / standard_deviations

    _, singular_values, right_vectors = np.linalg.svd(standardized, full_matrices=False)
    right_vectors = orient_components(right_vectors)
    scores = standardized @ right_vectors.T
    eigenvalues = singular_values**2 / (len(rows) - 1)
    explained = eigenvalues / eigenvalues.sum()

    apex_time = np.log1p(np.array([float(row["apexYearCapped"]) for row in rows]))
    apex_reached = np.array([float(row["apexReached"]) for row in rows])
    full_time = np.log1p(np.array([float(row["fullConsolidationYearCapped"]) for row in rows]))

    components = []
    cumulative = 0.0
    for index, ratio in enumerate(explained):
        cumulative += float(ratio)
        loadings = [
            {
                "variable": INPUT_COLUMNS[column],
                "label": DISPLAY_NAMES[INPUT_COLUMNS[column]],
                "loading": float(right_vectors[index, column]),
            }
            for column in range(len(INPUT_COLUMNS))
        ]
        loadings.sort(key=lambda item: abs(item["loading"]), reverse=True)
        components.append(
            {
                "component": index + 1,
                "explainedVariance": float(ratio),
                "cumulativeVariance": cumulative,
                "loadings": loadings,
                "apexTimeCorrelation": safe_correlation(scores[:, index], apex_time),
                "apexReachCorrelation": safe_correlation(scores[:, index], apex_reached),
                "fullTimeCorrelation": safe_correlation(scores[:, index], full_time),
            }
        )

    return {
        "observations": len(rows),
        "variables": INPUT_COLUMNS,
        "means": dict(zip(INPUT_COLUMNS, map(float, means))),
        "standardDeviations": dict(zip(INPUT_COLUMNS, map(float, standard_deviations))),
        "components": components,
    }, standardized


def calculate_sensitivity(rows: list[dict[str, str]]) -> list[dict]:
    capped_apex = np.array([float(row["apexYearCapped"]) for row in rows])
    reached = np.array([float(row["apexReached"]) for row in rows])
    ranked_outcome = rankdata(capped_apex)
    results = []

    for column in INPUT_COLUMNS:
        values = np.array([float(row[column]) for row in rows])
        results.append(
            {
                "variable": column,
                "label": DISPLAY_NAMES[column],
                "spearmanApexTime": safe_correlation(rankdata(values), ranked_outcome),
                "pearsonApexReach": safe_correlation(values, reached),
            }
        )

    return sorted(results, key=lambda item: abs(item["spearmanApexTime"]), reverse=True)


def calculate_archetype_summary(rows: list[dict[str, str]]) -> list[dict]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped[row["archetype"]].append(row)

    summaries = []
    for archetype, group in grouped.items():
        reached_times = [float(row["apexYear"]) for row in group if row["apexYear"]]
        full_times = [float(row["fullConsolidationYear"]) for row in group if row["fullConsolidationYear"]]
        base = next(row for row in group if int(row["variant"]) == 0)
        summaries.append(
            {
                "archetype": archetype,
                "label": base["archetypeLabel"],
                "variants": len(group),
                "apexReachRate": len(reached_times) / len(group),
                "medianApexYear": statistics.median(reached_times) if reached_times else None,
                "medianApexCalendarYear": BASE_YEAR + round(statistics.median(reached_times)) if reached_times else None,
                "baseApexYear": float(base["apexYear"]) if base["apexYear"] else None,
                "baseApexCalendarYear": BASE_YEAR + round(float(base["apexYear"])) if base["apexYear"] else None,
                "fullConsolidationRate": len(full_times) / len(group),
                "medianFullConsolidationYear": statistics.median(full_times) if full_times else None,
                "medianFullConsolidationCalendarYear": BASE_YEAR + round(statistics.median(full_times)) if full_times else None,
                "medianInfluenceYear500": statistics.median(float(row["apexInfluenceYear500"]) for row in group),
                "medianCentersYear1000": statistics.median(float(row["independentCentersYear1000"]) for row in group),
            }
        )

    return sorted(
        summaries,
        key=lambda item: (
            item["medianApexYear"] is None,
            item["medianApexYear"] if item["medianApexYear"] is not None else math.inf,
        ),
    )


def percentage(value: float) -> str:
    return f"{value * 100:.1f}%"


def make_report(results: dict) -> str:
    components = results["pca"]["components"]
    retained = next(
        (component["component"] for component in components if component["cumulativeVariance"] >= 0.8),
        len(components),
    )

    lines = [
        "# PCA and Scenario Analysis",
        "",
        "**Generated:** October 6, 2026  ",
        f"**Synthetic observations:** {results['metadata']['rows']}  ",
        f"**Scenario archetypes:** {results['metadata']['archetypes']}  ",
        "**Status:** Model-behavior analysis, not empirical inference",
        "",
        "## Scope warning",
        "",
        "This PCA decomposes correlated assumptions generated around authored scenario archetypes. It does not discover components in observed world data. Component signs are arbitrary, components depend on the scenario design, and correlations with outcomes are descriptive rather than causal.",
        "",
        "## Explained variance",
        "",
        "| Component | Variance | Cumulative | Correlation with log capped Apex time |",
        "|---:|---:|---:|---:|",
    ]
    for component in components[: min(8, len(components))]:
        lines.append(
            f"| PC{component['component']} | {percentage(component['explainedVariance'])} "
            f"| {percentage(component['cumulativeVariance'])} "
            f"| {component['apexTimeCorrelation']:+.3f} |"
        )

    lines.extend([
        "",
        f"The first **{retained} components** explain at least 80% of input variance.",
        "",
        "## Leading component loadings",
        "",
    ])
    for component in components[: min(5, retained)]:
        top = component["loadings"][:5]
        lines.append(f"### PC{component['component']} — {percentage(component['explainedVariance'])}")
        lines.append("")
        lines.append("; ".join(f"{item['label']} `{item['loading']:+.3f}`" for item in top))
        lines.append("")

    lines.extend([
        "## Scenario outcomes",
        "",
        "| Archetype | Apex reach | Median Apex calendar year among reached | Base Apex calendar year | Full consolidation reach |",
        "|---|---:|---:|---:|---:|",
    ])
    for item in results["archetypes"]:
        median = "—" if item["medianApexCalendarYear"] is None else str(item["medianApexCalendarYear"])
        base = "—" if item["baseApexCalendarYear"] is None else str(item["baseApexCalendarYear"])
        lines.append(
            f"| {item['label']} | {percentage(item['apexReachRate'])} | {median} | {base} "
            f"| {percentage(item['fullConsolidationRate'])} |"
        )

    lines.extend([
        "",
        "## Rank sensitivity to Apex timing",
        "",
        "Positive Spearman values mean higher input values are associated with later or censored Apex dominance in this authored scenario set; negative values mean earlier dominance.",
        "",
        "| Variable | Spearman correlation | Apex-reach correlation |",
        "|---|---:|---:|",
    ])
    for item in results["sensitivity"]:
        lines.append(
            f"| {item['label']} | {item['spearmanApexTime']:+.3f} | {item['pearsonApexReach']:+.3f} |"
        )

    lines.extend([
        "",
        "## Interpretation guardrails",
        "",
        "- PCA identifies variance directions, not causes.",
        "- The archetypes intentionally correlate assumptions, so component structure partly reflects author choices.",
        f"- Right-censored scenarios are assigned the calendar-year {BASE_YEAR + 5000} horizon only for descriptive correlations.",
        "- Binary reach probabilities are frequencies across synthetic perturbations, not real-world probabilities.",
        "- A future empirical PCA must use observed, versioned country/company data and missing-data procedures.",
        "- Survival analysis or competing-risk models should replace capped-time correlations for publication.",
        "",
        "## Reproduce",
        "",
        "```bash",
        "node analysis/generate_scenarios.mjs",
        "python3 analysis/pca_analysis.py",
        "python3 tests/test_analysis.py",
        "```",
        "",
    ])
    return "\n".join(lines)


def main() -> None:
    rows = load_rows()
    pca, _ = calculate_pca(rows)
    results = {
        "metadata": {
            "generated": "2026-10-09",
            "baseYear": BASE_YEAR,
            "horizonCalendarYear": BASE_YEAR + 5000,
            "rows": len(rows),
            "archetypes": len({row["archetype"] for row in rows}),
            "variantsPerArchetype": 64,
            "horizonYears": 5000,
            "analysisType": "synthetic model-behavior PCA",
            "numpyVersion": np.__version__,
        },
        "pca": pca,
        "sensitivity": calculate_sensitivity(rows),
        "archetypes": calculate_archetype_summary(rows),
    }

    OUTPUT.mkdir(parents=True, exist_ok=True)
    JSON_PATH.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    REPORT_PATH.write_text(make_report(results), encoding="utf-8")
    WEB_PATH.write_text(
        "// Generated by analysis/pca_analysis.py; do not edit manually.\n"
        f"export const ANALYSIS_RESULTS = Object.freeze({json.dumps(results, separators=(',', ':'))});\n",
        encoding="utf-8",
    )
    print(f"Analyzed {len(rows)} rows with NumPy {np.__version__}")
    print(f"Wrote {JSON_PATH}")
    print(f"Wrote {REPORT_PATH}")
    print(f"Wrote {WEB_PATH}")


if __name__ == "__main__":
    main()
