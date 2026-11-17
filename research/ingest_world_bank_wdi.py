#!/usr/bin/env python3
"""Ingest a frozen local World Bank WDI API snapshot for selected indicators."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import urllib.request
import time
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = "2026-10-06"
RAW = ROOT / "data/raw/world_bank_wdi" / SNAPSHOT
PROCESSED = ROOT / "data/processed"
MANIFESTS = ROOT / "data/manifests"
CROSSWALKS = ROOT / "data/crosswalks"
BASE = "https://api.worldbank.org/v2"
INDICATORS = {
    "NY.GDP.MKTP.CD": "gdp_current_usd",
    "SP.POP.TOTL": "population_total",
    "NE.TRD.GNFS.ZS": "trade_percent_gdp",
    "SE.SEC.ENRR": "secondary_enrollment_gross_percent",
    "GB.XPD.RSDV.GD.ZS": "research_development_percent_gdp",
    "NY.GDP.PCAP.KD": "gdp_per_capita_constant_2015_usd",
}
ALIASES = {
    "Bahamas": "Bahamas, The",
    "Bolivia": "Bolivia",
    "Congo, Democratic Republic of the": "Congo, Dem. Rep.",
    "Congo, Republic of the": "Congo, Rep.",
    "Côte d'Ivoire": "Cote d'Ivoire",
    "Egypt": "Egypt, Arab Rep.",
    "Gambia": "Gambia, The",
    "Iran": "Iran, Islamic Rep.",
    "Kyrgyzstan": "Kyrgyz Republic",
    "Laos": "Lao PDR",
    "Micronesia": "Micronesia, Fed. Sts.",
    "Moldova": "Moldova",
    "North Korea": "Korea, Dem. People's Rep.",
    "Russia": "Russian Federation",
    "Slovakia": "Slovak Republic",
    "South Korea": "Korea, Rep.",
    "State of Palestine (Observer State)": "West Bank and Gaza",
    "Syria": "Syrian Arab Republic",
    "Tanzania": "Tanzania",
    "Türkiye": "Turkiye",
    "United States": "United States",
    "Venezuela": "Venezuela, RB",
    "Vietnam": "Viet Nam",
    "Yemen": "Yemen, Rep.",
}


def fetch_json(url: str, path: Path) -> object:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        return json.loads(path.read_text())
    request = urllib.request.Request(url, headers={"User-Agent": "InstitutionalAgentsResearch/1.0"})
    last_error = None
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                payload = response.read()
            parsed = json.loads(payload)
            temporary = path.with_suffix(path.suffix + ".tmp")
            temporary.write_bytes(payload)
            temporary.replace(path)
            return parsed
        except Exception as error:
            last_error = error
            if attempt < 3:
                time.sleep(attempt * 2)
    raise RuntimeError(f"Failed to fetch {url} after 3 attempts") from last_error


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.casefold().replace("’", "'"))


def write_csv(path: Path, records: list[dict], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    countries_payload = fetch_json(
        f"{BASE}/country?format=json&per_page=400",
        RAW / "countries.json",
    )
    country_records = countries_payload[1]
    countries = {
        record["iso2Code"]: record
        for record in country_records
        if record.get("region", {}).get("id") and record.get("region", {}).get("id") != "NA"
    }
    by_name = {normalized(record["name"]): record for record in countries.values()}

    panel: dict[tuple[str, int], dict] = {}
    raw_files = [RAW / "countries.json"]
    indicator_metadata = {}
    for code, column in INDICATORS.items():
        path = RAW / f"{code}.json"
        payload = fetch_json(
            f"{BASE}/country/all/indicator/{code}?format=json&per_page=20000&date=1960:2025",
            path,
        )
        raw_files.append(path)
        metadata, observations = payload
        indicator_metadata[code] = {
            "column": column,
            "sourceNote": metadata.get("sourceNote"),
            "lastUpdated": metadata.get("lastupdated"),
        }
        for observation in observations or []:
            country_id = observation.get("country", {}).get("id")
            if country_id not in countries:
                continue
            year = int(observation["date"])
            country = countries[country_id]
            key = (country_id, year)
            row = panel.setdefault(key, {
                "world_bank_code": country["id"],
                "iso3_code": country["id"],
                "world_bank_name": country["name"],
                "region": country["region"]["value"],
                "income_level": country["incomeLevel"]["value"],
                "year": year,
            })
            row[column] = observation["value"]

    columns = ["world_bank_code", "iso3_code", "world_bank_name", "region", "income_level", "year", *INDICATORS.values()]
    records = []
    for key in sorted(panel, key=lambda item: (item[1], item[0])):
        row = panel[key]
        records.append({column: row.get(column, "") if row.get(column, "") is not None else "" for column in columns})
    PROCESSED.mkdir(parents=True, exist_ok=True)
    write_csv(PROCESSED / f"wdi_state_year_{SNAPSHOT}.csv", records, columns)

    with (CROSSWALKS / "institution-identifiers.csv").open(newline="", encoding="utf-8") as handle:
        seeds = list(csv.DictReader(handle))
    candidates = []
    for seed in seeds:
        target = ALIASES.get(seed["canonical_name"], seed["canonical_name"])
        match = by_name.get(normalized(target))
        candidates.append({
            "institution_id": seed["institution_id"],
            "canonical_name": seed["canonical_name"],
            "candidate_world_bank_code": match["id"] if match else "",
            "candidate_world_bank_name": match["name"] if match else "",
            "match_method": "alias" if match and seed["canonical_name"] in ALIASES else "normalized_exact" if match else "unmatched",
            "candidate_status": "provisional_candidate" if match else "unresolved",
            "review_status": "unreviewed",
        })
    write_csv(CROSSWALKS / f"wdi-{SNAPSHOT}-candidates.csv", candidates, list(candidates[0]))

    missingness = {}
    for code, column in INDICATORS.items():
        non_missing = sum(record[column] != "" for record in records)
        missingness[code] = {
            "column": column,
            "nonMissing": non_missing,
            "totalRows": len(records),
            "coverageRate": non_missing / len(records),
        }
    manifest = {
        "sourceId": "world_bank_wdi",
        "snapshot": SNAPSHOT,
        "apiVersion": "v2",
        "baseUrl": BASE,
        "retrievedAt": "2026-10-06T13:52:00-04:00",
        "licenseDecision": "local non-commercial research; raw API responses excluded from redistribution pending dataset-specific terms review",
        "rawFiles": {str(path.relative_to(ROOT)): checksum(path) for path in raw_files},
        "countryRecords": len(countries),
        "panelRows": len(records),
        "coverage": [1960, 2025],
        "indicators": indicator_metadata,
        "missingness": missingness,
        "crosswalkCandidates": {
            "provisional": sum(row["candidate_status"] == "provisional_candidate" for row in candidates),
            "unresolved": sum(row["candidate_status"] == "unresolved" for row in candidates),
            "verified": 0,
        },
        "limitations": [
            "World Bank country/economy coverage does not equal COW state-system membership.",
            "Current API responses may contain revised historical values unavailable at earlier prediction origins.",
            "Indicator coverage is uneven and missingness is not random.",
            "Crosswalk candidates are unreviewed and must not be merged automatically."
        ]
    }
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    path = MANIFESTS / f"world_bank_wdi_{SNAPSHOT}.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "countries": len(countries),
        "panelRows": len(records),
        "indicators": len(INDICATORS),
        "provisionalCandidates": manifest["crosswalkCandidates"]["provisional"],
        "unresolvedCandidates": manifest["crosswalkCandidates"]["unresolved"],
        "manifest": str(path),
    }, indent=2))


if __name__ == "__main__":
    main()
