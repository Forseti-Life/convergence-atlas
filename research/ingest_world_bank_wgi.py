#!/usr/bin/env python3
"""Ingest the official Worldwide Governance Indicators 2026 workbook."""

from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

from openpyxl import load_workbook


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/raw/world_bank_wgi/2026/wgidataset_with_sourcedata-2026.xlsx"
EXPECTED_SHA = "67c38d2e9253fb1a72ee302c3b7c47b2ba7b177a04673163796ca1666f506ecb"
PROCESSED = ROOT / "data/processed"
MANIFESTS = ROOT / "data/manifests"
DIMENSIONS = {
    "va": "voice_accountability",
    "pv": "political_stability",
    "ge": "government_effectiveness",
    "rq": "regulatory_quality",
    "rl": "rule_of_law",
    "cc": "control_of_corruption",
}
REQUIRED_HEADERS = [
    "Economy (name)",
    "Economy (code)",
    "Region",
    "Income classification",
    "Year",
    "Governance dimension",
    "Number of sources",
    "Governance estimate (approx. -2.5 to +2.5)",
    "Standard error (estimate)",
    "Lower threshold (90% conf. int. estimate)",
    "Upper threshold (90% conf. int. estimate)",
    "Governance score (0-100)",
]


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_csv(path: Path, records: list[dict], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    actual = checksum(SOURCE)
    if actual != EXPECTED_SHA:
        raise ValueError(f"WGI workbook checksum mismatch: {actual}")
    workbook = load_workbook(SOURCE, read_only=True, data_only=True)
    if set(workbook.sheetnames) != set(DIMENSIONS):
        raise ValueError(f"Unexpected WGI sheets: {workbook.sheetnames}")

    panel = {}
    sheet_rows = {}
    for sheet_name, prefix in DIMENSIONS.items():
        sheet = workbook[sheet_name]
        rows = sheet.iter_rows(values_only=True)
        headers = [str(value).strip() if value is not None else "" for value in next(rows)]
        indices = {header: headers.index(header) for header in REQUIRED_HEADERS}
        count = 0
        for values in rows:
            if values[indices["Economy (code)"]] is None or values[indices["Year"]] is None:
                continue
            code = str(values[indices["Economy (code)"]]).strip()
            year = int(values[indices["Year"]])
            key = (code, year)
            row = panel.setdefault(key, {
                "world_bank_code": code,
                "world_bank_name": values[indices["Economy (name)"]],
                "region": values[indices["Region"]],
                "income_level": values[indices["Income classification"]],
                "year": year,
            })
            row[f"{prefix}_estimate"] = values[indices["Governance estimate (approx. -2.5 to +2.5)"]]
            row[f"{prefix}_standard_error"] = values[indices["Standard error (estimate)"]]
            row[f"{prefix}_lower90"] = values[indices["Lower threshold (90% conf. int. estimate)"]]
            row[f"{prefix}_upper90"] = values[indices["Upper threshold (90% conf. int. estimate)"]]
            row[f"{prefix}_score"] = values[indices["Governance score (0-100)"]]
            row[f"{prefix}_source_count"] = values[indices["Number of sources"]]
            count += 1
        sheet_rows[sheet_name] = count

    dimension_columns = [
        f"{prefix}_{suffix}"
        for prefix in DIMENSIONS.values()
        for suffix in ("estimate", "standard_error", "lower90", "upper90", "score", "source_count")
    ]
    columns = ["world_bank_code", "world_bank_name", "region", "income_level", "year", *dimension_columns]
    records = [
        {column: panel[key].get(column, "") if panel[key].get(column, "") is not None else "" for column in columns}
        for key in sorted(panel, key=lambda item: (item[1], item[0]))
    ]
    PROCESSED.mkdir(parents=True, exist_ok=True)
    output_path = PROCESSED / "wgi_state_year_2026.csv"
    write_csv(output_path, records, columns)

    missingness = {}
    for prefix in DIMENSIONS.values():
        column = f"{prefix}_estimate"
        non_missing = sum(record[column] != "" for record in records)
        missingness[prefix] = {
            "column": column,
            "nonMissing": non_missing,
            "totalRows": len(records),
            "coverageRate": non_missing / len(records),
        }
    manifest = {
        "sourceId": "wgi_2026",
        "sourceVersion": "2026 workbook",
        "sourceUrl": "https://www.worldbank.org/content/dam/sites/govindicators/doc/wgidataset_with_sourcedata-2026.xlsx",
        "sourcePath": str(SOURCE.relative_to(ROOT)),
        "sourceSha256": actual,
        "retrievedAt": "2026-10-06T15:54:00-04:00",
        "licenseDecision": "local non-commercial research; redistribution subject to World Bank dataset terms",
        "parserDependency": "openpyxl==3.1.5",
        "sheets": sheet_rows,
        "panelRows": len(records),
        "coverage": [min(year for _, year in panel), max(year for _, year in panel)],
        "dimensions": DIMENSIONS,
        "missingness": missingness,
        "limitations": [
            "WGI measures perceptions aggregated from multiple sources and should not be treated as definitive government ratings.",
            "Historical estimates were recalculated and do not represent vintage values available at each prediction origin.",
            "Country/economy coverage differs from COW system membership.",
            "Dimensions are correlated and should not be interpreted as independent causal effects without a declared design."
        ]
    }
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    manifest_path = MANIFESTS / "world_bank_wgi_2026.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "panelRows": len(records),
        "coverage": manifest["coverage"],
        "sheets": sheet_rows,
        "output": str(output_path),
        "manifest": str(manifest_path),
    }, indent=2))


if __name__ == "__main__":
    main()
