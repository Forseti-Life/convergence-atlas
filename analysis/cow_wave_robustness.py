#!/usr/bin/env python3
"""Test sensitivity of COW sovereign-wave calibration to authored definitions."""

import csv
import datetime as dt
import json
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPELLS = ROOT / "data/interim/cow_state_spells_v2024.csv"
OUTPUT = ROOT / "analysis/output"
GAPS = [1, 3, 5, 7, 10]
THRESHOLDS = [2, 3, 5, 10]


def read_rows(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def date(value):
    return dt.date.fromisoformat(value)


def has_reentry(spell, spells):
    return any(
        other["cow_code"] == spell["cow_code"]
        and date(other["valid_from"]) > date(spell["valid_to"])
        for other in spells
    )


def exit_events(spells, mode):
    events = []
    for spell in spells:
        if spell["right_censored"] != "0":
            continue
        if mode == "durable" and has_reentry(spell, spells):
            continue
        events.append((date(spell["valid_to"]), spell))
    return sorted(events, key=lambda item: item[0])


def cluster(events, gap_years):
    groups = []
    for event in events:
        if not groups or (event[0] - groups[-1][-1][0]).days > gap_years * 365.25:
            groups.append([])
        groups[-1].append(event)
    return groups


def wave(group, spells):
    start = group[0][0]
    active = sum(date(spell["valid_from"]) <= start <= date(spell["valid_to"]) for spell in spells)
    unique = {int(spell["cow_code"]): spell for _, spell in group}
    return {
        "start": start.isoformat(),
        "end": group[-1][0].isoformat(),
        "uniqueExits": len(unique),
        "activeAtStart": active,
        "lossProbability": len(unique) / active,
        "institutions": [spell["cow_name"] for spell in unique.values()],
    }


def specification(spells, mode, gap, threshold):
    waves = [wave(group, spells) for group in cluster(exit_events(spells, mode), gap)]
    major = [item for item in waves if item["uniqueExits"] >= threshold]
    probabilities = [item["lossProbability"] for item in major]
    total_active = sum(item["activeAtStart"] for item in major)
    return {
        "mode": mode,
        "gapYears": gap,
        "minimumUniqueExits": threshold,
        "waveCount": len(waves),
        "majorWaveCount": len(major),
        "meanLossProbability": statistics.mean(probabilities) if probabilities else None,
        "medianLossProbability": statistics.median(probabilities) if probabilities else None,
        "minimumLossProbability": min(probabilities) if probabilities else None,
        "maximumLossProbability": max(probabilities) if probabilities else None,
        "pooledLossProbability": sum(item["uniqueExits"] for item in major) / total_active if total_active else None,
    }


def baseline_waves(spells):
    return [
        wave(group, spells)
        for group in cluster(exit_events(spells, "gross"), 5)
        if len({spell["cow_code"] for _, spell in group}) >= 5
    ]


def leave_one_out(waves):
    rows = []
    for omitted in waves:
        retained = [wave for wave in waves if wave is not omitted]
        rows.append({
            "omittedStart": omitted["start"],
            "omittedEnd": omitted["end"],
            "omittedLossProbability": omitted["lossProbability"],
            "retainedWaveCount": len(retained),
            "leaveOneOutMean": statistics.mean(item["lossProbability"] for item in retained),
        })
    return rows


def write_csv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def percent(value):
    return "—" if value is None else f"{value:.1%}"


def report(result):
    lines = [
        "# COW Wave-Definition Robustness",
        "",
        "**Status:** L1 sourced-exploratory; authored-definition sensitivity, not causal calibration",
        "",
        "## Declared baseline",
        "",
        f"- Major waves: {len(result['baselineWaves'])}",
        f"- Mean gross loss probability: {result['baselineMean']:.1%}",
        f"- Rounded production default: {result['roundedDefault']:.0%}",
        "",
        "## Leave one major wave out",
        "",
        "| Omitted wave | Omitted loss | Retained mean |",
        "|---|---:|---:|",
    ]
    for row in result["leaveOneOut"]:
        lines.append(f"| {row['omittedStart']}–{row['omittedEnd']} | {row['omittedLossProbability']:.1%} | {row['leaveOneOutMean']:.1%} |")
    lines.extend([
        "",
        "## Specification envelope",
        "",
        f"- Gross specifications with estimates: {result['summary']['grossEstimatedSpecifications']}",
        f"- Gross mean range: {percent(result['summary']['grossMeanMinimum'])}–{percent(result['summary']['grossMeanMaximum'])}",
        f"- Durable specifications with estimates: {result['summary']['durableEstimatedSpecifications']}",
        f"- Durable mean range: {percent(result['summary']['durableMeanMinimum'])}–{percent(result['summary']['durableMeanMaximum'])}",
        "",
        "## Interpretation",
        "",
        "The range measures sensitivity to clustering and threshold conventions. It is not a confidence interval. If plausible definitions imply materially different rates, future simulations should use a distribution rather than one fixed default.",
        "",
    ])
    return "\n".join(lines)


def main():
    spells = read_rows(SPELLS)
    specifications = [
        specification(spells, mode, gap, threshold)
        for mode in ["gross", "durable"]
        for gap in GAPS
        for threshold in THRESHOLDS
    ]
    baseline = baseline_waves(spells)
    gross_means = [row["meanLossProbability"] for row in specifications if row["mode"] == "gross" and row["meanLossProbability"] is not None]
    durable_means = [row["meanLossProbability"] for row in specifications if row["mode"] == "durable" and row["meanLossProbability"] is not None]
    result = {
        "metadata": {"generated": "2026-10-07", "specificationCount": len(specifications), "forecast": False},
        "grid": {"gapYears": GAPS, "minimumUniqueExits": THRESHOLDS, "modes": ["gross", "durable"]},
        "baselineWaves": baseline,
        "baselineMean": statistics.mean(item["lossProbability"] for item in baseline),
        "roundedDefault": 0.15,
        "leaveOneOut": leave_one_out(baseline),
        "specifications": specifications,
        "summary": {
            "grossEstimatedSpecifications": len(gross_means),
            "grossMeanMinimum": min(gross_means),
            "grossMeanMaximum": max(gross_means),
            "durableEstimatedSpecifications": len(durable_means),
            "durableMeanMinimum": min(durable_means),
            "durableMeanMaximum": max(durable_means),
        },
        "limitations": [
            "Clustering gaps and wave thresholds are author-defined.",
            "Durable means no later COW spell with the same code, not proven permanent subjugation.",
            "The specification range is not a sampling confidence interval.",
        ],
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "cow-wave-robustness.json").write_text(json.dumps(result, indent=2) + "\n")
    write_csv(OUTPUT / "cow-wave-robustness.csv", specifications)
    (OUTPUT / "COW_WAVE_ROBUSTNESS.md").write_text(report(result))
    (ROOT / "web/cow-wave-robustness.mjs").write_text(f"// Generated by analysis/cow_wave_robustness.py; do not edit manually.\nexport const COW_WAVE_ROBUSTNESS = Object.freeze({json.dumps(result, separators=(',', ':'))});\n")
    print(json.dumps({"specifications": len(specifications), "baselineMean": result["baselineMean"], "leaveOneOut": result["leaveOneOut"], "summary": result["summary"]}, indent=2))


if __name__ == "__main__":
    main()
