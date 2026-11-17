#!/usr/bin/env python3
"""Generate honest implementation status across the ten empirical validation phases."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOC_PATH = ROOT / "docs" / "VALIDATION_STATUS.md"
WEB_PATH = ROOT / "web" / "program-status.mjs"


def exists(relative: str) -> bool:
    path = ROOT / relative
    return path.exists() and path.stat().st_size > 0


def build_status() -> dict:
    phase0_manifest = json.loads((ROOT / "research/phase0-manifest.json").read_text())
    cow_manifest = json.loads((ROOT / "data/manifests/cow_states_v2024.json").read_text())
    mid_manifest = json.loads((ROOT / "data/manifests/cow_mids_v5.json").read_text())
    alliance_manifest = json.loads((ROOT / "data/manifests/cow_alliances_v4_1.json").read_text())
    intra_state_manifest = json.loads((ROOT / "data/manifests/cow_intra_state_wars_v5_1.json").read_text())
    sovereign_proxy = json.loads((ROOT / "research/sovereign-consolidation-proxy.v1.json").read_text())
    wdi_manifest = json.loads((ROOT / "data/manifests/world_bank_wdi_2026-10-06.json").read_text())
    wdi_pca = json.loads((ROOT / "analysis/output/wdi-measurement-pca.json").read_text())
    wgi_manifest = json.loads((ROOT / "data/manifests/world_bank_wgi_2026.json").read_text())
    l2_panel = json.loads((ROOT / "analysis/output/l2-common-panel.json").read_text())
    exit_taxonomy = json.loads((ROOT / "analysis/output/cow-exit-taxonomy.json").read_text())
    conflict_benchmark = json.loads((ROOT / "analysis/output/l2-conflict-benchmark.json").read_text())
    model_insights = json.loads((ROOT / "analysis/output/model-insights.json").read_text())
    empirical = json.loads((ROOT / "analysis/output/cow-empirical-baseline.json").read_text())
    scenario_matrix = json.loads((ROOT / "analysis/output/scenario-matrix.json").read_text())
    wave_robustness = json.loads((ROOT / "analysis/output/cow-wave-robustness.json").read_text())
    model_comparison = json.loads((ROOT / "analysis/output/cow-model-comparison.json").read_text())
    target_five = json.loads((ROOT / "analysis/output/target-five-analysis.json").read_text())
    monte_carlo = json.loads((ROOT / "analysis/output/monte-carlo-summary.json").read_text())

    phase1_complete = (
        cow_manifest["crosswalkCandidates"]["verified"] > 0
        and exists("data/processed/state_year.parquet")
        and exists("data/processed/state_transitions.parquet")
    )

    phases = [
        {
            "phase": 0,
            "name": "Claim contract and terminology",
            "status": "COMPLETE",
            "gate": "GATE 0: PASS",
            "evidence": ["7 falsifiable hypotheses, 9 outcomes, and 3 causal diagrams", "Institution/Apex Institution terminology and non-goals frozen"],
            "blockers": [],
        },
        {
            "phase": 1,
            "name": "Variable and default justification",
            "status": "COMPLETE",
            "gate": "GATE 1: PASS",
            "evidence": ["14 active defaults and 9 hidden constants have evidence tiers, rationales, derivations, and sources", "Model/default drift test passing"],
            "blockers": [],
        },
        {
            "phase": 2,
            "name": "Source anchoring",
            "status": "IN PROGRESS",
            "gate": "GATE 2: OPEN",
            "evidence": [
                f"COW membership: {cow_manifest['stateYearRows']:,} state-year rows",
                f"MID: {mid_manifest['nativeDisputes']:,} disputes through 2014",
                f"Alliances: {alliance_manifest['stateYearRows']:,} state-year rows through 2012",
                f"WDI: {wdi_manifest['panelRows']:,} rows across {len(wdi_manifest['indicators'])} indicators",
                f"WGI 2026: {wgi_manifest['panelRows']:,} rows across six governance dimensions",
                f"Intra-State War: {intra_state_manifest['warRows']} wars and {intra_state_manifest['stateYearRows']:,} state-year exposures through 2014",
            ],
            "blockers": ["UCDP, V-Dem, debt, inequality, and additional innovation/adoption sources pending", "Row-level redistribution terms remain source-specific"],
        },
        {
            "phase": 3,
            "name": "Identifier and measurement alignment",
            "status": "PARTIAL",
            "gate": "GATE 3: OPEN",
            "evidence": [
                f"COW candidates: {cow_manifest['crosswalkCandidates']['provisional']} provisional and {cow_manifest['crosswalkCandidates']['unresolved']} unresolved",
                f"WDI complete-case PCA: {wdi_pca['metadata']['completeCases']:,} rows across {wdi_pca['metadata']['countriesEconomies']} countries/economies",
                f"Provisional COW–WDI–WGI panel: {l2_panel['metadata']['panelRows']:,} rows, {l2_panel['metadata']['completeCases']:,} complete cases, {l2_panel['metadata']['institutions']} Institutions",
            ],
            "blockers": ["No external identifier mapping independently verified", "Historical predecessors/successors unresolved", "Complete-case PCA is selection-biased"],
        },
        {
            "phase": 4,
            "name": "Historical plausibility checks",
            "status": "PARTIAL",
            "gate": "GATE 4: OPEN",
            "evidence": [
                f"Kaplan–Meier baseline for {empirical['spells']} COW membership spells",
                "Six rolling constant-hazard tests; all lose to no-exit null",
                f"All {exit_taxonomy['exits']} COW exits have observable timing categories; causal labels remain unreviewed",
                "Alliance/MID associations are weak",
                f"Seven-model descriptive diagnostic over {model_comparison['summary'][0]['exposure']:,} chronological Institution-years; it tests COW exits, not the novel AI mechanism",
                "The richer full-wave exit analogue loses to constant hazard; historical prediction is not treated as validation of the future model",
                f"Conflict-path full model AUC {conflict_benchmark['models']['full']['auc']:.3f} on one held-out split",
            ],
            "blockers": [f"Only {l2_panel['eventSupport']['membershipExits']} membership exit exists in the 1996–2014 common panel versus {l2_panel['eventSupport']['minimumEventsForTwelvePredictorRule']} screening events required", "49 full-history COW exit causes still require historical review", "Conflict benchmark predicts MID onset, not institutional transition", "Bipolar persistence, natural terminal-transition duration, and additional adoption proxies remain untested"],
        },
        {
            "phase": 5,
            "name": "Scenario, uncertainty, and sensitivity",
            "status": "PARTIAL",
            "gate": "GATE 5: L1 PASS / L2 OPEN",
            "evidence": ["12 archetypes and 768 seeded variants", f"{scenario_matrix['metadata']['scenarioCount']} fixed model-challenge scenarios", f"Target-five stress presets with 225 starting Institutions: high-intensity median {target_five['boundaries']['fastest']['targetCalendarYear']} and slow-preset median {target_five['boundaries']['longestBounded']['targetCalendarYear'] or 'after 7026'}", f"{monte_carlo['metadata']['totalRuns']:,} seeded Latin-hypercube runs across {monte_carlo['metadata']['profileCount']} profiles", f"COW-centered ensemble reaches five in {monte_carlo['profiles'][0]['targetFive']['reachProbability']:.1%} of runs; {monte_carlo['profiles'][0]['targetFive']['noReachProbability']:.1%} right-censored", f"{wave_robustness['metadata']['specificationCount']} gross/durable wave specifications; gross mean range {wave_robustness['summary']['grossMeanMinimum']:.1%}–{wave_robustness['summary']['grossMeanMaximum']:.1%}", "Four leave-one-major-wave-out calibrations range from 12.0% to 20.1%", "Synthetic PCA, rank sensitivity, and non-convergence cases", "One-at-a-time, Morris-style, 81-cell phase-map, 25-cell economics, and conditional observability diagnostics", f"Four major COW exit waves average {sovereign_proxy['meanMajorWaveGrossLossProbability']:.1%} gross loss; rounded sovereign default is {sovereign_proxy['roundedDefault']:.0%}", f"Secondary aircraft midpoint produces {model_insights['waveCalibration']['aircraftSecondary']['midpoint']['dominanceYear']:.0f}-year conditional dominance", f"{empirical['bootstrap']['iterations']:,}-sample bootstrap for crude exit hazard"],
            "blockers": ["Sobol interaction indices and empirical distributions remain pending", "COW wave taxonomy remains gross and historically unreviewed; L2 causal calibration is incomplete", "Clustered-gap arrivals and beta-binomial wave severity are implemented; entity/network dependence and competing-risk models remain deferred", "Monte Carlo v1.4 samples parameters independently; copula parameter correlations and entity-specific process effects remain deferred", "GDP/revenue display weighting is implemented; outcome hazards, terminal-rule robustness, and separate state/corporate mechanisms remain high-priority work"],
        },
        {
            "phase": 6,
            "name": "Network and institutional structure",
            "status": "PARTIAL",
            "gate": "GATE 6: OPEN",
            "evidence": [f"{alliance_manifest['nativeRows']:,} directed alliance-year records", f"{alliance_manifest['systemYearRows']} annual network snapshots", "Trend-aware alliance/MID diagnostic"],
            "blockers": ["Trade, finance, ownership, platform, and infrastructure layers pending", "Alliance coverage ends in 2012"],
        },
        {
            "phase": 7,
            "name": "Adoption and implementation",
            "status": "PARTIAL",
            "gate": "GATE 7: L1 PASS / L2 OPEN",
            "evidence": ["IFRS-derived 7% proxy", "Cohort implementation and formal/effective distinction", "Sensitivity range exposed"],
            "blockers": ["Two additional standards-adoption proxies required for L2"],
        },
        {
            "phase": 8,
            "name": "Comparative Institution cases",
            "status": "BLOCKED",
            "gate": "GATE 8: OPTIONAL FOR L1 / BLOCKED FOR L2",
            "evidence": ["Current 30-company illustration exists"],
            "blockers": ["No reviewed comparative cases", "No historical corporate population; survivor bias remains severe"],
        },
        {
            "phase": 9,
            "name": "Reproducibility, review, and publication",
            "status": "DRAFT",
            "gate": "L1 INTERNAL PASS / EXTERNAL REVIEW PENDING",
            "evidence": ["Draft model card", "Versioned contracts, checksums, automated tests, and evidence-linked webpage", "Forecast claims disabled"],
            "blockers": ["Domain and statistical review pending", "Reproducibility snapshot not archived", "L2/L3 language not authorized"],
        },
    ]
    return {
        "generated": "2026-10-09",
        "program": "Institutional Agents empirical validation",
        "overallStatus": "L1 ACHIEVED; L2 IN PROGRESS",
        "forecastClaimsAuthorized": False,
        "phases": phases,
        "nextActions": [
            "Investigate why the production prior has best held-out log loss while underpredicting observed exits",
            "Extend GDP/revenue display weighting into tested outcome hazards and alternative terminal-resolution rules",
            "Separate sovereign and corporate event mechanisms and replace the GDP/revenue heuristic with type-specific power models",
            "Retain manual review of 49 COW exits and an unconditional-surrender registry as later L2 opportunities",
            "Compare two additional standards-adoption proxies with IFRS",
        ],
    }


def make_markdown(status: dict) -> str:
    lines = [
        "# Empirical Validation Status",
        "",
        f"**Generated:** {status['generated']}  ",
        f"**Overall:** {status['overallStatus']}  ",
        f"**Forecast claims authorized:** {'YES' if status['forecastClaimsAuthorized'] else 'NO'}",
        "",
        "> A blocked phase is a successful gate outcome when required evidence is absent. It prevents unsupported claims.",
        "",
        "## Phase summary",
        "",
        "| Phase | Name | Status | Gate |",
        "|---:|---|---|---|",
    ]
    for phase in status["phases"]:
        lines.append(f"| {phase['phase']} | {phase['name']} | {phase['status']} | {phase['gate']} |")
    for phase in status["phases"]:
        lines.extend(["", f"## Phase {phase['phase']} — {phase['name']}", "", f"**Status:** {phase['status']}  ", f"**Gate:** {phase['gate']}", "", "### Evidence", ""])
        lines.extend(f"- {item}" for item in phase["evidence"] or ["No qualifying empirical artifact yet"])
        lines.extend(["", "### Blockers", ""])
        lines.extend(f"- {item}" for item in phase["blockers"] or ["None"])
    lines.extend(["", "## Next actions", ""])
    lines.extend(f"{index}. {item}" for index, item in enumerate(status["nextActions"], start=1))
    lines.extend(["", "## Claim policy", "", "Until the final gate passes, dates and probabilities produced by the model remain scenario outputs—not forecasts.", ""])
    return "\n".join(lines)


def main() -> None:
    status = build_status()
    DOC_PATH.write_text(make_markdown(status), encoding="utf-8")
    WEB_PATH.write_text(
        "// Generated by research/run_validation_program.py; do not edit manually.\n"
        f"export const PROGRAM_STATUS = Object.freeze({json.dumps(status, separators=(',', ':'))});\n",
        encoding="utf-8",
    )
    print(f"Wrote {DOC_PATH}")
    print(f"Wrote {WEB_PATH}")
    print(f"Overall: {status['overallStatus']}; forecast claims authorized: {status['forecastClaimsAuthorized']}")


if __name__ == "__main__":
    main()
