#!/usr/bin/env python3
"""Build and evaluate the provisional COW-WDI-WGI-MID L2 panel."""

from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
PROCESSED = ROOT / "data/processed"
CROSSWALKS = ROOT / "data/crosswalks"
OUTPUT = ROOT / "analysis/output"
SNAPSHOT = "2026-10-06"
PCA_VARIABLES = [
    ("log_gdp", "GDP (log)", "gdp_current_usd", True),
    ("log_population", "Population (log)", "population_total", True),
    ("trade", "Trade % GDP", "trade_percent_gdp", False),
    ("education", "Secondary enrollment", "secondary_enrollment_gross_percent", False),
    ("rd", "R&D % GDP", "research_development_percent_gdp", False),
    ("log_gdp_pc", "Real GDP per capita (log)", "gdp_per_capita_constant_2015_usd", True),
    ("voice", "Voice/accountability", "voice_accountability_estimate", False),
    ("stability", "Political stability", "political_stability_estimate", False),
    ("effectiveness", "Government effectiveness", "government_effectiveness_estimate", False),
    ("regulation", "Regulatory quality", "regulatory_quality_estimate", False),
    ("rule_law", "Rule of law", "rule_of_law_estimate", False),
    ("corruption_control", "Control of corruption", "control_of_corruption_estimate", False),
]


def read(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def keyed(rows: list[dict], fields: tuple[str, ...]) -> dict[tuple, dict]:
    return {tuple(row[field] for field in fields): row for row in rows}


def write(path: Path, rows: list[dict], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)


def pca(matrix: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    standardized = (matrix - matrix.mean(axis=0)) / matrix.std(axis=0, ddof=1)
    _, singular, vectors = np.linalg.svd(standardized, full_matrices=False)
    for index in range(len(vectors)):
        largest = np.argmax(np.abs(vectors[index]))
        if vectors[index, largest] < 0:
            vectors[index] *= -1
    values = singular**2 / (len(matrix) - 1)
    return values / values.sum(), vectors


def main() -> None:
    cow_candidates = keyed(read(CROSSWALKS / "cow-v2024-candidates.csv"), ("institution_id",))
    wdi_candidates = keyed(read(CROSSWALKS / f"wdi-{SNAPSHOT}-candidates.csv"), ("institution_id",))
    mappings = []
    for key, cow in cow_candidates.items():
        wdi = wdi_candidates.get(key)
        if not wdi or not cow["candidate_cow_code"] or not wdi["candidate_world_bank_code"]:
            continue
        mappings.append({
            "institution_id": key[0],
            "canonical_name": cow["canonical_name"],
            "cow_code": cow["candidate_cow_code"],
            "world_bank_code": wdi["candidate_world_bank_code"],
            "mapping_status": "provisional_unreviewed",
        })
    write(CROSSWALKS / "cow-wdi-provisional.csv", mappings, list(mappings[0]))
    cow_to_mapping = {row["cow_code"]: row for row in mappings}

    membership = read(PROCESSED / "cow_state_year_v2024.csv")
    mids = keyed(read(PROCESSED / "cow_mid_state_year_v5.csv"), ("cow_code", "year"))
    wdi = keyed(read(PROCESSED / f"wdi_state_year_{SNAPSHOT}.csv"), ("world_bank_code", "year"))
    wgi = keyed(read(PROCESSED / "wgi_state_year_2026.csv"), ("world_bank_code", "year"))
    wdi_columns = [item[2] for item in PCA_VARIABLES[:6]]
    wgi_columns = [item[2] for item in PCA_VARIABLES[6:]]
    columns = [
        "institution_id", "canonical_name", "cow_code", "world_bank_code", "year", "mapping_status",
        "membership_exit", "mid_dispute_onsets", "mid_active_disputes", "mid_war_disputes",
        *wdi_columns, *wgi_columns,
    ]
    panel = []
    seen = {}
    for row in membership:
        year = int(row["year"])
        if not 1996 <= year <= 2014:
            continue
        mapping = cow_to_mapping.get(row["cow_code"])
        if not mapping:
            continue
        key = (mapping["institution_id"], year)
        if key in seen:
            seen[key]["membership_exit"] = max(seen[key]["membership_exit"], int(row["exit_year"]))
            continue
        mid = mids.get((row["cow_code"], str(year)), {})
        economic = wdi.get((mapping["world_bank_code"], str(year)), {})
        governance = wgi.get((mapping["world_bank_code"], str(year)), {})
        record = {
            **mapping,
            "year": year,
            "membership_exit": int(row["exit_year"]),
            "mid_dispute_onsets": int(mid.get("dispute_onsets", 0)),
            "mid_active_disputes": int(mid.get("active_disputes", 0)),
            "mid_war_disputes": int(mid.get("war_disputes", 0)),
        }
        for column in wdi_columns:
            record[column] = economic.get(column, "")
        for column in wgi_columns:
            record[column] = governance.get(column, "")
        panel.append(record)
        seen[key] = record
    panel.sort(key=lambda row: (row["year"], row["institution_id"]))
    write(PROCESSED / "l2_provisional_state_year.csv", panel, columns)

    complete_rows = []
    matrix = []
    for row in panel:
        if any(row[source] == "" for _, _, source, _ in PCA_VARIABLES):
            continue
        vector = []
        valid = True
        for _, _, source, use_log in PCA_VARIABLES:
            value = float(row[source])
            if use_log:
                if value <= 0:
                    valid = False
                    break
                value = np.log(value)
            vector.append(value)
        if valid:
            complete_rows.append(row)
            matrix.append(vector)
    matrix_array = np.array(matrix)
    explained, vectors = pca(matrix_array)
    components = []
    for component, ratio in enumerate(explained):
        loadings = [
            {"variable": PCA_VARIABLES[index][0], "label": PCA_VARIABLES[index][1], "loading": float(vectors[component, index])}
            for index in range(len(PCA_VARIABLES))
        ]
        loadings.sort(key=lambda item: abs(item["loading"]), reverse=True)
        components.append({"component": component + 1, "explainedVariance": float(ratio), "loadings": loadings})

    exit_events = sum(row["membership_exit"] for row in panel)
    onset_rows = sum(row["mid_dispute_onsets"] > 0 for row in panel)
    minimum_events = 10 * len(PCA_VARIABLES)
    missingness = {
        source: {
            "missing": sum(row[source] == "" for row in panel),
            "coverageRate": sum(row[source] != "" for row in panel) / len(panel),
        }
        for _, _, source, _ in PCA_VARIABLES
    }
    results = {
        "metadata": {
            "analysisType": "provisional L2 common-panel feasibility",
            "mappingStatus": "provisional_unreviewed",
            "yearRange": [1996, 2014],
            "institutions": len({row["institution_id"] for row in panel}),
            "panelRows": len(panel),
            "completeCases": len(complete_rows),
            "pcaVariables": len(PCA_VARIABLES),
        },
        "eventSupport": {
            "membershipExits": exit_events,
            "rowsWithMidOnset": onset_rows,
            "minimumEventsForTwelvePredictorRule": minimum_events,
            "membershipExitPredictiveGate": "PASS" if exit_events >= minimum_events else "FAIL",
            "reason": "Uses a conservative ten-events-per-parameter screening rule; not a universal theorem."
        },
        "missingness": missingness,
        "components": components,
        "mappingCandidates": len(mappings),
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "l2-common-panel.json").write_text(json.dumps(results, indent=2) + "\n")
    lines = [
        "# L2 Common Panel Feasibility",
        "",
        "**Status:** Provisional and unreviewed  ",
        "**Sources:** COW membership/MID + World Bank WDI/WGI  ",
        "**Years:** 1996–2014",
        "",
        "> This panel uses unreviewed candidate mappings. It is suitable for coverage and feasibility diagnostics, not confirmatory prediction or causal claims.",
        "",
        "## Coverage",
        "",
        f"- Institutions: {results['metadata']['institutions']}",
        f"- State-year rows: {len(panel):,}",
        f"- Complete 12-variable cases: {len(complete_rows):,}",
        f"- Membership exits: {exit_events}",
        f"- Rows with MID onset: {onset_rows}",
        "",
        "## Predictive event gate",
        "",
        f"- Screening requirement: {minimum_events} events for {len(PCA_VARIABLES)} candidate predictors",
        f"- Observed membership exits: {exit_events}",
        f"- Result: **{results['eventSupport']['membershipExitPredictiveGate']}**",
        "",
        "A multivariable membership-exit model is not supported by this common period. Reduce predictors, expand historical coverage, change the outcome, or use strong regularization with explicit uncertainty; do not fit the planned full model to this event count.",
        "",
        "## Empirical PCA",
        "",
        "| Component | Explained variance | Leading loadings |",
        "|---:|---:|---|",
    ]
    for component in components[:4]:
        top = "; ".join(f"{item['label']} {item['loading']:+.3f}" for item in component["loadings"][:4])
        lines.append(f"| PC{component['component']} | {component['explainedVariance'] * 100:.1f}% | {top} |")
    lines.extend([
        "",
        "## Decision",
        "",
        "- L2 source anchoring advances.",
        "- Confirmatory transition prediction remains blocked by unreviewed mappings and insufficient membership-exit events.",
        "- MID onset may support a separate conflict model, but it is not a substitute for institutional transition outcomes.",
        "",
    ])
    (OUTPUT / "L2_COMMON_PANEL.md").write_text("\n".join(lines))
    print(json.dumps({
        "mappings": len(mappings),
        "institutions": results["metadata"]["institutions"],
        "panelRows": len(panel),
        "completeCases": len(complete_rows),
        "membershipExits": exit_events,
        "midOnsetRows": onset_rows,
        "predictiveGate": results["eventSupport"]["membershipExitPredictiveGate"],
    }, indent=2))


if __name__ == "__main__":
    main()
