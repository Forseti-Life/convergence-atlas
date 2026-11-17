#!/usr/bin/env python3
"""Build the COW-primary sovereign consolidation-wave proxy."""

import csv
import datetime as dt
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPELLS = ROOT / "data/interim/cow_state_spells_v2024.csv"
WARS = ROOT / "data/processed/cow_intra_state_wars_v5_1.csv"
OUTPUT = ROOT / "research/sovereign-consolidation-proxy.v1.json"


def rows(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def date(value):
    return dt.date.fromisoformat(value)


def wave_record(cluster, spells):
    start, finish = cluster[0][0], cluster[-1][0]
    active = sum(date(s["valid_from"]) <= start <= date(s["valid_to"]) for s in spells)
    exits = {int(s["cow_code"]): s for _, s in cluster}
    return {
        "start": start.isoformat(),
        "end": finish.isoformat(),
        "exitCount": len(cluster),
        "uniqueInstitutionExits": len(exits),
        "activeInstitutionsAtStart": active,
        "grossLossProbability": len(exits) / active,
        "institutions": [s["cow_name"] for _, s in cluster],
    }


def build_waves(spells):
    exits = sorted(
        [(date(s["valid_to"]), s) for s in spells if s["right_censored"] == "0"],
        key=lambda item: item[0],
    )
    clusters = []
    for item in exits:
        if not clusters or (item[0] - clusters[-1][-1][0]).days > 5 * 365.25:
            clusters.append([])
        clusters[-1].append(item)
    return [wave_record(cluster, spells) for cluster in clusters]


def civil_war_risk(spells, wars):
    endings = defaultdict(list)
    for war in wars:
        try:
            endings[int(float(war["host_cow_code"]))].append(
                (int(war["end_year"]), war["outcome_code"])
            )
        except ValueError:
            continue
    groups = {"exposed": [0, 0], "unexposed": [0, 0], "challengerVictory": [0, 0]}
    for spell in spells:
        code = int(spell["cow_code"])
        start = max(1818, date(spell["valid_from"]).year)
        end = min(2009, date(spell["valid_to"]).year)
        for year in range(start, end + 1):
            recent = [(war_end, outcome) for war_end, outcome in endings[code] if 0 <= year - war_end <= 5]
            exit_next_five = (
                spell["right_censored"] == "0"
                and 0 <= date(spell["valid_to"]).year - year <= 5
            )
            key = "exposed" if recent else "unexposed"
            groups[key][0] += int(exit_next_five)
            groups[key][1] += 1
            if any(outcome == "2" for _, outcome in recent):
                groups["challengerVictory"][0] += int(exit_next_five)
                groups["challengerVictory"][1] += 1
    return {
        key: {"exitEvents": value[0], "stateYears": value[1], "fiveYearExitRisk": value[0] / value[1]}
        for key, value in groups.items()
    }


def main():
    spells, wars = rows(SPELLS), rows(WARS)
    waves = build_waves(spells)
    major = [wave for wave in waves if wave["uniqueInstitutionExits"] >= 5]
    mean = sum(wave["grossLossProbability"] for wave in major) / len(major)
    result = {
        "schemaVersion": "1.0",
        "proxyVersion": "1.0.0",
        "generated": "2026-10-07",
        "primarySource": "COW State System Membership v2024",
        "supportingSource": "COW Intra-State War v5.1",
        "waveRule": "Cluster consecutive exits separated by no more than five years; major waves have at least five unique exits.",
        "majorWaves": major,
        "meanMajorWaveGrossLossProbability": mean,
        "roundedDefault": 0.15,
        "futurePermanenceRule": 1,
        "futurePermanenceCondition": "decisive unconditional defeat",
        "civilWarLinkage": civil_war_risk(spells, wars),
        "secondaryCorporateProxy": {
            "name": "aircraft/aerospace manufacturing",
            "range": [1 / 3, 5 / 7],
            "midpoint": (1 / 3 + 5 / 7) / 2,
        },
        "claimLevel": "L1 sourced-exploratory",
        "forecast": False,
        "limitations": [
            "COW coverage begins in 1816.",
            "The five-year wave rule and five-exit threshold are author-defined.",
            "COW v5.1 has side-winner outcomes but no dedicated unconditional-surrender field.",
            "Gross exits combine temporary interruption, occupation, unification, and dissolution.",
            "Future permanence is a model assumption, not a historical observation.",
        ],
    }
    OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"majorWaves": len(major), "mean": mean, "default": 0.15, "civilWarLinkage": result["civilWarLinkage"]}, indent=2))


if __name__ == "__main__":
    main()
