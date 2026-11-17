# World Bank WDI API Snapshot — Data Use Decision

**Snapshot date:** October 6, 2026  
**API:** World Bank Indicators API v2  
**Status:** Approved for local non-commercial research; redistribution pending dataset-specific review

World Bank API documentation permits keyless programmatic access but incorporates dataset-specific terms and restricts API-facilitated use according to those terms. Raw responses and row-level derived data remain local while licensing is reviewed.

## Indicators

- `NY.GDP.MKTP.CD` — GDP, current USD
- `SP.POP.TOTL` — total population
- `NE.TRD.GNFS.ZS` — trade as percent of GDP
- `SE.SEC.ENRR` — secondary enrollment, gross percent
- `GB.XPD.RSDV.GD.ZS` — research and development expenditure as percent of GDP
- `NY.GDP.PCAP.KD` — GDP per capita, constant 2015 USD

## Controls

- Raw JSON responses are cached and checksumed.
- API version, indicator code, snapshot date, and source update metadata are recorded.
- Aggregates are filtered using World Bank region metadata.
- Historical revisions are not treated as prediction-time vintages.
- Candidate mappings remain unreviewed and separate from COW identifiers.

## Source terms

- API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
- Dataset terms: https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets
