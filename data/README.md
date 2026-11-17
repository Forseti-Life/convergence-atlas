# Data Workspace

**Phase:** 1 — State-system data foundation  
**Status:** Scaffolded; no external datasets ingested  
**Data classification:** Public/licensed institutional research data

## Directory contract

```text
data/
├── catalog.yml       # Planned datasets, status, versions, and license gates
├── raw/              # Immutable source-native downloads; normally not committed
├── interim/          # Parsed but not analysis-ready data
├── processed/        # Versioned analysis-ready state/dyad/event tables
└── crosswalks/       # Reviewed identifier and predecessor/successor mappings
```

Directories are created only when they contain a contract, manifest, or data artifact.

## Current state

- Phase 0 research contract: complete and Gate A passing.
- COW State System Membership v2024: ingested locally with checksum lock.
- COW MID v5.0: ingested locally through 2014, including explicit zero-event years.
- COW Formal Alliances v4.1: ingested locally through 2012.
- State identifier seed: 195 current names; 193 COW candidates and 2 unresolved observer states; zero verified.
- World Bank WDI API snapshot: six indicators, 14,322 country-year rows, 188 provisional mapping candidates, zero verified.
- UCDP, V-Dem, WGI, debt, inequality, and broader innovation data: pending.
- Redistribution: unresolved for all COW row-level data; raw and derived rows remain local.

## Ingestion rules

1. Never overwrite a raw source snapshot.
2. Record source ID, version, URL, retrieval timestamp, SHA-256, and license decision.
3. Preserve source-native identifiers and units.
4. Build predictors only from information available at the prediction origin.
5. Distinguish zero, not applicable, not observed, and unavailable.
6. Never infer predecessor or successor relationships from name similarity alone.
7. Require review before promoting crosswalk rows from `unresolved` to `verified`.
8. Keep corporate data out of the state-only Phase 1 panel.
9. Do not commit restricted or non-redistributable raw data.
10. Regenerate derived tables through scripts rather than manual editing.

## Planned primary tables

### `processed/state_year.parquet`

One row per verified Institution-year within valid system-membership dates.

Required keys:

```text
institution_id, year
```

### `processed/state_dyad_year.parquet`

One row per declared directed or undirected state dyad and year.

Required keys:

```text
institution_id_a, institution_id_b, year, direction
```

### `processed/state_transitions.parquet`

One row per independently coded transition event.

Required keys:

```text
transition_id, event_date, transition_type
```

## Missing-value policy

Use explicit status fields. Empty strings in the initial identifier seed mean **unresolved**, not absent. Analysis-ready tables must use typed nulls plus provenance and imputation indicators.

## Validation

```bash
node research/generate_crosswalk_seed.mjs
python3 tests/test_data_scaffold.py
python3 research/ingest_cow_states.py
python3 tests/test_cow_ingestion.py
python3 research/ingest_cow_mids.py
python3 tests/test_mid_ingestion.py
python3 research/ingest_cow_alliances.py
python3 tests/test_alliance_ingestion.py
```

The validator confirms 195 unique state rows, unresolved external mappings, declared schemas, and no accidental corporate entries.
