# The photo index comes from a committed cache, refreshed by a script

Photo posts are found with twitterapi.io's advanced search (the same provider Ham's other projects use) and written to a committed JSON cache by `apps/astro/scripts/fetch-kameko.mjs`. The page itself never calls an API. The provider bills per returned post, so a refresh is one incremental request that stops at the newest cached post and skips known IDs. A full re-sweep (`KAMEKO_DEEP=1`) is a paid operation that needs Ham's approval and a credit estimate.

## Considered options

- **Official X API:** rejected for price at this volume.
- **Runtime fetching on each render:** rejected; it repeats paid calls and ties page availability to a third party.
- **Walking the full timeline:** rejected; about 1,500 requests to reach 2024.

X's search index silently misses posts in "Latest" mode, so the deep sweep queries "Top" as well.
