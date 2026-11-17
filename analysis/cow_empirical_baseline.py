#!/usr/bin/env python3
"""Empirical baseline analyses using COW State System Membership v2024 only."""

from __future__ import annotations

import csv
import json
import math
from datetime import date
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SPELLS_PATH = ROOT / "data" / "interim" / "cow_state_spells_v2024.csv"
OUTPUT = ROOT / "analysis" / "output"
JSON_PATH = OUTPUT / "cow-empirical-baseline.json"
REPORT_PATH = OUTPUT / "COW_EMPIRICAL_BASELINE.md"
WEB_PATH = ROOT / "web" / "validation-results.mjs"
YEAR_DAYS = 365.2425


def read_spells() -> list[dict]:
    with SPELLS_PATH.open(newline="", encoding="utf-8") as handle:
        source = list(csv.DictReader(handle))
    spells = []
    for row in source:
        start = date.fromisoformat(row["valid_from"])
        end = date.fromisoformat(row["valid_to"])
        spells.append({
            **row,
            "start": start,
            "end": end,
            "duration": max((end - start).days / YEAR_DAYS, 1 / YEAR_DAYS),
            "event": row["right_censored"] == "0",
        })
    return spells


def kaplan_meier(spells: list[dict], horizons: list[int]) -> list[dict]:
    observations = sorted((spell["duration"], spell["event"]) for spell in spells)
    at_risk = len(observations)
    survival = 1.0
    index = 0
    curve = [(0.0, 1.0)]
    while index < len(observations):
        time = observations[index][0]
        events = 0
        censored = 0
        while index < len(observations) and observations[index][0] == time:
            if observations[index][1]:
                events += 1
            else:
                censored += 1
            index += 1
        if events:
            survival *= 1 - (events / at_risk)
        curve.append((time, survival))
        at_risk -= events + censored

    result = []
    for horizon in horizons:
        value = 1.0
        for time, survival_value in curve:
            if time > horizon:
                break
            value = survival_value
        result.append({"years": horizon, "survival": value, "exitRisk": 1 - value})
    return result


def crude_exit_hazard(spells: list[dict]) -> float:
    events = sum(spell["event"] for spell in spells)
    exposure = sum(spell["duration"] for spell in spells)
    return events / exposure


def bootstrap_hazard(spells: list[dict], iterations: int = 2000) -> dict:
    random = np.random.default_rng(20261006)
    event = np.array([float(spell["event"]) for spell in spells])
    duration = np.array([spell["duration"] for spell in spells])
    estimates = np.empty(iterations)
    for index in range(iterations):
        sample = random.integers(0, len(spells), len(spells))
        estimates[index] = event[sample].sum() / duration[sample].sum()
    return {
        "iterations": iterations,
        "seed": 20261006,
        "median": float(np.median(estimates)),
        "lower95": float(np.quantile(estimates, 0.025)),
        "upper95": float(np.quantile(estimates, 0.975)),
    }


def active_at(spell: dict, origin: date) -> bool:
    return spell["start"] <= origin <= spell["end"]


def training_hazard(spells: list[dict], origin: date) -> tuple[float, int, float]:
    events = 0
    exposure = 0.0
    for spell in spells:
        if spell["start"] >= origin:
            continue
        observed_end = min(spell["end"], origin)
        exposure += max((observed_end - spell["start"]).days / YEAR_DAYS, 0)
        if spell["event"] and spell["end"] < origin:
            events += 1
    return (events / exposure if exposure else 0.0), events, exposure


def rolling_backtest(spells: list[dict], horizon_years: int = 10) -> list[dict]:
    results = []
    for origin_year in (1900, 1925, 1950, 1975, 2000, 2010):
        origin = date(origin_year, 1, 1)
        cutoff = date(min(origin_year + horizon_years, 2024), 12, 31)
        hazard, training_events, exposure = training_hazard(spells, origin)
        risk_set = [spell for spell in spells if active_at(spell, origin)]
        predicted = 1 - math.exp(-hazard * horizon_years)
        actual = np.array([
            float(spell["event"] and origin < spell["end"] <= cutoff)
            for spell in risk_set
        ])
        baseline = np.zeros(len(actual))
        predictions = np.full(len(actual), predicted)
        brier = float(np.mean((predictions - actual) ** 2)) if len(actual) else math.nan
        null_brier = float(np.mean((baseline - actual) ** 2)) if len(actual) else math.nan
        results.append({
            "originYear": origin_year,
            "horizonYears": horizon_years,
            "riskSet": len(risk_set),
            "trainingEvents": training_events,
            "trainingExposureYears": exposure,
            "annualExitHazard": hazard,
            "predictedExitRisk": predicted,
            "observedExits": int(actual.sum()),
            "observedExitRate": float(actual.mean()) if len(actual) else math.nan,
            "brier": brier,
            "noExitNullBrier": null_brier,
            "brierImprovement": null_brier - brier,
        })
    return results


def fmt_pct(value: float) -> str:
    return f"{value * 100:.2f}%"


def make_report(results: dict) -> str:
    lines = [
        "# COW Empirical Baseline",
        "",
        "**Source:** Correlates of War State System Membership v2024  ",
        "**Generated:** October 6, 2026  ",
        "**Scope:** Membership-spell survival and simple temporal baseline; no Big Cycle predictors yet",
        "",
        "## Scope warning",
        "",
        "A COW system-membership exit is not automatically a collapse, merger, conquest, or fragmentation. Transition causes remain uncoded. This report establishes a baseline hazard and validates event-history plumbing; it does not validate the full institutional model.",
        "",
        "## Membership spells",
        "",
        f"- Spells: {results['spells']}",
        f"- Observed exits: {results['observedExits']}",
        f"- Right-censored spells: {results['rightCensored']}",
        f"- Total exposure: {results['exposureYears']:.1f} state-years",
        f"- Crude annual membership-exit hazard: {fmt_pct(results['annualExitHazard'])}",
        f"- Bootstrap 95% interval: {fmt_pct(results['bootstrap']['lower95'])}–{fmt_pct(results['bootstrap']['upper95'])}",
        "",
        "## Kaplan–Meier membership survival",
        "",
        "| Years since entry | Estimated survival | Estimated exit risk |",
        "|---:|---:|---:|",
    ]
    for row in results["kaplanMeier"]:
        lines.append(f"| {row['years']} | {fmt_pct(row['survival'])} | {fmt_pct(row['exitRisk'])} |")
    lines.extend([
        "",
        "## Rolling 10-year constant-hazard backtest",
        "",
        "| Origin | Risk set | Training exits | Predicted risk | Observed exits | Brier | No-exit Brier | Improvement |",
        "|---:|---:|---:|---:|---:|---:|---:|---:|",
    ])
    for row in results["rollingBacktest"]:
        lines.append(
            f"| {row['originYear']} | {row['riskSet']} | {row['trainingEvents']} "
            f"| {fmt_pct(row['predictedExitRisk'])} | {row['observedExits']} "
            f"| {row['brier']:.4f} | {row['noExitNullBrier']:.4f} | {row['brierImprovement']:+.4f} |"
        )
    lines.extend([
        "",
        "## Interpretation",
        "",
        "- The constant-hazard model is a benchmark, not a substantive theory.",
        "- Negative Brier improvement means predicting no exits performed better in that window.",
        "- Later models must beat this baseline out of sample and remain calibrated.",
        "- Entry/exit cause coding is required before competing-risk analysis.",
        "- Historical recognition and COW membership criteria create selection effects.",
        "",
        "## Phase coverage",
        "",
        "- Phase 1: partial empirical ingestion complete for COW membership only.",
        "- Phase 2: blocked pending economic/governance predictors.",
        "- Phase 3: baseline survival plumbing implemented; competing risks blocked pending event causes.",
        "- Phase 4: constant-hazard rolling backtest implemented; richer model comparison pending predictors.",
        "- Phase 6: bootstrap uncertainty implemented for the crude exit hazard.",
        "",
    ])
    return "\n".join(lines)


def main() -> None:
    spells = read_spells()
    hazard = crude_exit_hazard(spells)
    results = {
        "metadata": {
            "source": "COW State System Membership",
            "version": "v2024",
            "analysisType": "empirical membership-spell baseline",
            "generated": "2026-10-06",
        },
        "spells": len(spells),
        "observedExits": sum(spell["event"] for spell in spells),
        "rightCensored": sum(not spell["event"] for spell in spells),
        "exposureYears": sum(spell["duration"] for spell in spells),
        "annualExitHazard": hazard,
        "bootstrap": bootstrap_hazard(spells),
        "kaplanMeier": kaplan_meier(spells, [1, 5, 10, 25, 50, 100]),
        "rollingBacktest": rolling_backtest(spells),
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    JSON_PATH.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    REPORT_PATH.write_text(make_report(results), encoding="utf-8")
    WEB_PATH.write_text(
        "// Generated by analysis/cow_empirical_baseline.py; do not edit manually.\n"
        f"export const EMPIRICAL_RESULTS = Object.freeze({json.dumps(results, separators=(',', ':'))});\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "spells": results["spells"],
        "exits": results["observedExits"],
        "annualExitHazard": results["annualExitHazard"],
        "bootstrap95": [results["bootstrap"]["lower95"], results["bootstrap"]["upper95"]],
        "outputs": [str(JSON_PATH), str(REPORT_PATH), str(WEB_PATH)],
    }, indent=2))


if __name__ == "__main__":
    main()
