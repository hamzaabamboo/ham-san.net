# Events

- **URL:** `/{locale}/events`, with an optional `?year=YYYY` filter
- **Source:** `apps/astro/src/pages/[locale]/events/index.astro`, styles in `src/styles/events-report.css`
- **Layout:** `MainLayout`

## Purpose

This is Ham's attendance analytics from Eventernote: how many events, which artists and venues, when, and streaks. It's the data-heavy page of the site.

## Anatomy

```
[Attendance analytics]  Events            ┌ HamP_punipuni card ┐
lede                                      │ period / attended  │
                                          │ upcoming / top     │
                                          │ Eventernote source │
┌ rail: cache note, section links, Years ┐  Attendance snapshot
│                                        │  Notable peaks
│                                        │  Trends & distribution (charts)
│                                        │  Pace & cadence
│                                        │  Activity heatmap
│                                        │  Upcoming & recent events
└────────────────────────────────────────┘  Artists & venues rankings
```

The sections use the `common.events-report-*` keys: overview, highlights, charts (yearly bar, monthly bar, cumulative artist lines, venue and artist rank lists), rhythm (weekday and month-of-year), activity (calendar heatmap), events (next and recent), and rankings.

## Data and caching

- `getEventernoteReport()` wrapped in `withLastGoodState('events:report')`. A stale-but-good report is marked `cached` and the rail shows "Cached data / Refreshes daily".
- The year filter rebuilds the report locally with `buildEventernoteReport`.
- `CDN-Cache-Control` is 3600 s, or 60 s when the fetch fails.

## States

- **Fetch failed:** `common.events-empty-title` and `common.events-report-fetch-error`.
- **Year with no events:** shows the year label, `common.events-report-empty-year`, and a link back to all years.

## Interactions

- The heatmap scrolls to its newest edge on load.
- Month labels recalculate on scroll.
- Event items open Eventernote in a new tab.

## Rules

- The "Attendance analytics" eyebrow stays; it adds context the title doesn't.
- Chart colours use the line styles defined in the page (accent, accent-soft, muted, outline, fg). No new hues.
- Japanese artist and venue names rely on the system CJK fallback stack. Never letter-space or uppercase them.
