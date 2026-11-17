# Data Governance

**Contract version:** 1.0.0  
**Last source review:** 2026-10-07

## Classification

The planned research uses public or licensed institutional, economic, political, and historical data. It must not include credentials, personal records, restricted CTDI data, or individual-level sensitive data without a separate approved design.

## Storage zones

| Zone | Purpose | Commit policy |
|---|---|---|
| `data/raw/` | Immutable source-native downloads | Do not commit unless redistribution is explicitly permitted |
| `data/interim/` | Parsed but not analytically final data | Do not commit large or restricted extracts |
| `data/processed/` | Versioned analysis-ready tables | Commit only if license and size permit |
| `data/crosswalks/` | Identifier mappings and adjudication | Commit reviewed non-restricted mappings |
| `research/` | Frozen contracts, manifests, and source catalog | Commit |

## Required provenance per dataset

- Source ID and owner
- Exact version or snapshot date
- Retrieval timestamp
- Original URL and checksum
- License and redistribution decision
- Native schema and units
- Transformations and code version
- Missingness and imputation flags
- Historical revision or vintage limitations

## Source catalog

| ID | Source | Version | Coverage | Verification | License status |
|---|---|---|---|---|---|
| `cow_states` | [Correlates of War State System Membership](https://correlatesofwar.org/data-sets/state-system-membership/) | v2024 | 1816-2024 | verified page and version 2026-10-06 | review before redistribution |
| `cow_intra_state_wars` | [COW Intra-State War Data](https://correlatesofwar.org/data-sets/cow-war/) | v5.1 | 1816-2014 | ingested and checksum-verified 2026-10-07 | local analysis only; redistribution unresolved |
| `cow_mids` | [Militarized Interstate Disputes](https://correlatesofwar.org/data-sets/MIDs/) | select at ingestion | historical interstate disputes | planned retrieval | review before redistribution |
| `cow_nmc` | [National Material Capabilities](https://correlatesofwar.org/data-sets/national-material-capabilities/) | select at ingestion | historical state-year | page referenced | review before redistribution |
| `cow_alliances` | [Formal Alliances](https://correlatesofwar.org/data-sets/formal-alliances/) | select at ingestion | historical alliance periods | page referenced | review before redistribution |
| `cow_trade` | [Bilateral Trade](https://correlatesofwar.org/data-sets/bilateral-trade/) | select at ingestion | historical dyad-year with gaps | page referenced | review before redistribution |
| `ucdp` | [UCDP conflict datasets](https://ucdp.uu.se/downloads/) | select current release at ingestion | primarily 1946 onward depending on dataset | definitions and download references checked | attribution and redistribution review required |
| `world_bank_wdi` | [World Development Indicators](https://databank.worldbank.org/source/world-development-indicators) | API/download snapshot date required | 1960 onward with indicator-specific gaps | referenced | World Bank data terms review |
| `vdem_v16` | [V-Dem Country-Year Dataset](https://www.v-dem.net/data/the-v-dem-dataset/) | v16, March 2026 | historical country-year; indicator dependent | verified version and page 2026-10-06 | CC BY-SA 4.0 per source page |
| `wgi_2026` | [Worldwide Governance Indicators](https://www.worldbank.org/en/publication/worldwide-governance-indicators) | 2026 update | 1996-2025, more than 200 economies | verified page and coverage 2026-10-06 | World Bank data terms review |
| `imf_gdd` | [Global Debt Database](https://www.imf.org/external/datamapper/datasets/GDD) | select snapshot at ingestion | country-year public/private debt | URL returned HTTP 403 to automated retrieval 2026-10-06 | review required |
| `imf_cofer` | [Currency Composition of Official Foreign Exchange Reserves](https://data.imf.org/COFER) | select quarterly snapshot at ingestion | recent quarterly aggregate currency shares | referenced; ingestion pending | review required |
| `wid` | [World Inequality Database](https://wid.world/data/) | snapshot date required | country-year, uneven by measure | verified methodology and data page 2026-10-06 | review dataset terms and attribution |
| `wipo_gii` | [Global Innovation Index](https://www.wipo.int/global_innovation_index/en/) | 2026 | approximately 140 economies | verified current page and scope 2026-10-06 | review publication/data terms |
| `sipri_milex` | [SIPRI Military Expenditure Database](https://www.sipri.org/databases/milex) | 2026 release, revised 2026-04-27 | 1949-2025 | verified page, coverage, and revision 2026-10-06 | commercial use requires authorization; redistribution review required |
| `bis_stats` | [BIS statistics](https://www.bis.org/statistics/) | snapshot date required | credit, banking, and cross-border finance; reporter dependent | planned retrieval | review required |
| `ifrs_profiles` | [IFRS jurisdiction profiles](https://www.ifrs.org/use-around-the-world/use-of-ifrs-standards-by-jurisdiction/) | 170 profiles as observed 2026-10-06 | current jurisdictional requirements plus profile history | verified profile count and requirement language 2026-10-06 | copyright and licensing review required |
| `iso_survey` | [ISO Survey of certifications](https://www.iso.org/the-iso-survey.html) | select annual editions at ingestion | annual certifications by standard and country | planned retrieval | review required |
| `google_ipv6` | [Google IPv6 adoption statistics](https://www.google.com/intl/en/ipv6/statistics.html) | snapshot and historical export method required | daily global and country adoption | referenced; extraction method pending | review use and reproduction terms |
| `stanford_ai_index` | [Stanford AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report) | 2026 | global AI research, economy, policy, and adoption indicators | verified report page and top-line adoption claims 2026-10-06 | review report/data terms |
| `dalio_cwo` | [The Changing World Order manuscript](https://asiabusinesscouncil.org/wp-content/uploads/2020/10/The-Changing-World-Order_Ray-Dalio.pdf) | 2020 manuscript | historical interpretive framework | indexed primary manuscript located 2026-10-06 | citation only; do not redistribute |
| `emdat` | [EM-DAT International Disaster Database](https://www.emdat.be/) | select snapshot at ingestion | historical disaster events | planned retrieval | registration/license review required |

## Leakage and censoring controls

- **Right-censoring:** Preserve event indicators and censoring times. Never convert a non-event at the observation horizon into an observed transition.

1. Maintain observation-vintage dates where available.
2. Build predictors only from information available at the prediction origin.
3. Freeze final test intervals before model selection.
4. Keep event coding independent from predictor construction.
5. Treat missingness as potentially informative; never silently convert it to zero.
6. Prevent successor identity and future alliance information from entering predecessor-year features.

## Quality controls

- Unique composite keys
- Referential integrity across identifiers
- Temporal continuity and valid entry/exit windows
- Unit and range validation
- Duplicate and revision detection
- Source-to-processed row reconciliation
- Dual review of transition and predecessor/successor coding

## Change control

Frozen contract files receive new versioned filenames rather than silent edits. Any hypothesis, outcome, or metric change after inspecting results must be labeled exploratory and recorded in the changelog.
