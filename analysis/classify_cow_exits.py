#!/usr/bin/env python3
"""Create an observable, non-causal taxonomy of COW membership exits."""

from __future__ import annotations

import csv
import json
from collections import Counter
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data/interim/cow_state_spells_v2024.csv"
OUTPUT = ROOT / "data/processed/cow_exit_taxonomy_v1.csv"
REPORT = ROOT / "analysis/output/COW_EXIT_TAXONOMY.md"
SUMMARY = ROOT / "analysis/output/cow-exit-taxonomy.json"


def read() -> list[dict[str, str]]:
    with INPUT.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write(rows: list[dict]) -> None:
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    spells = read()
    exits = [row for row in spells if row["right_censored"] == "0"]
    classified = []
    for row in exits:
        end = date.fromisoformat(row["valid_to"])
        later_same = sorted(
            (item for item in spells if item["cow_code"] == row["cow_code"] and item["valid_from"] > row["valid_to"]),
            key=lambda item: item["valid_from"],
        )
        nearby = []
        for item in spells:
            if item["cow_code"] == row["cow_code"]:
                continue
            start = date.fromisoformat(item["valid_from"])
            days = (start - end).days
            if 0 <= days <= 370:
                nearby.append((days, item))
        nearby.sort(key=lambda item: (item[0], int(item[1]["cow_code"])))

        if later_same:
            category = "same_code_interruption_reentry"
        elif any(days <= 1 for days, _ in nearby):
            category = "immediate_successor_entry_candidate"
        elif nearby:
            category = "nearby_system_entry_candidate"
        else:
            category = "terminal_exit_unclassified"

        classified.append({
            "exit_id": f"{row['spell_id']}-exit",
            "cow_code": row["cow_code"],
            "cow_name": row["cow_name"],
            "exit_date": row["valid_to"],
            "observable_category": category,
            "same_code_reentry_date": later_same[0]["valid_from"] if later_same else "",
            "same_code_reentry_name": later_same[0]["cow_name"] if later_same else "",
            "nearby_entry_count": len(nearby),
            "nearby_entry_candidates": "|".join(
                f"{item['cow_code']}:{item['cow_name']}:{item['valid_from']}:+{days}d"
                for days, item in nearby
            ),
            "causal_transition_type": "",
            "causal_review_status": "unreviewed",
            "source_version": "COW state membership v2024",
            "notes": "Timing-based observable category only; no causal transition asserted.",
        })

    classified.sort(key=lambda row: row["exit_date"])
    write(classified)
    counts = Counter(row["observable_category"] for row in classified)
    result = {
        "version": "1.0",
        "source": "COW State System Membership v2024",
        "exits": len(classified),
        "categoryCounts": dict(sorted(counts.items())),
        "causalLabelsReviewed": 0,
        "rule": "Same-code re-entry takes precedence; otherwise new COW entries within 1 day, within 370 days, or no nearby entry.",
        "limitations": [
            "Temporal proximity does not establish succession, merger, conquest, or fragmentation.",
            "COW system entry may reflect recognition criteria rather than the causal transition date.",
            "All causal labels remain blank pending historical review."
        ]
    }
    SUMMARY.write_text(json.dumps(result, indent=2) + "\n")
    lines = [
        "# COW Exit Observable Taxonomy",
        "",
        "**Status:** Preliminary, timing-based, non-causal  ",
        f"**Exits classified:** {len(classified)}  ",
        "**Causal labels reviewed:** 0",
        "",
        "> Temporal proximity is a candidate-generation rule, not proof of succession, merger, conquest, or fragmentation.",
        "",
        "## Category counts",
        "",
        "| Observable category | Count |",
        "|---|---:|",
    ]
    for category, count in sorted(counts.items()):
        lines.append(f"| `{category}` | {count} |")
    lines.extend([
        "",
        "## Review workflow",
        "",
        "1. Review source narratives for each terminal exit.",
        "2. Assign a causal type only with a citation.",
        "3. Require a second reviewer for predecessor/successor relationships.",
        "4. Preserve the timing category even if the causal interpretation changes.",
        "",
    ])
    REPORT.write_text("\n".join(lines))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
