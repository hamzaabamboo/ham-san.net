# Room

- **URL:** `/{locale}/room`
- **Source:** `apps/astro/src/pages/[locale]/room.astro`, UI in `src/components/home/RoomHome.astro`, scene in `room-runtime.ts`, copy in `room-copy.ts`, model in `public/models/room.glb`
- **Layout:** `BaseLayout` (full-bleed, no site shell)

## Purpose

This is an explorable 3D model of Ham's real room. Objects in the room open the site's content: the monitor opens projects, the desk papers open notes, and the shelf and props open hobbies. It is an alternative way into the site, reachable from the "Room" navigation item. It is not the home page.

## Anatomy

```
[mark] Ham                       00:58 Tokyo   [lights][curtains]  EN JA TH
┌ entry panel ────────────────┐
│ A room of my own.           │        3D room (static preview until loaded)
│ Work on the monitor …       │
│ [Enter room]                │
│ Browse the website ↗        │
└─────────────────────────────┘
controls help · Projects Notes Hobbies Namecard Events
```

After entering, the room shows object labels, a reticle, lights and curtains controls, and the lie-down, closet and leave buttons. Choosing an object moves the camera to a close-up and opens an examine `<dialog>` holding the matching page in an iframe (`?roomEmbed=1` hides the site shell).

## Data and caching

- The room itself has no CMS data. The GLB model and panoramas are static assets.
- The embedded pages carry their own data and caching.

## Interactions

- **Desktop:** WASD movement, arrow-key or mouse look (pointer lock on click), click an object to examine it, Escape to close.
- **Touch:** drag to look, tap the floor to move, tap an object to examine it.
- **Controls:** lights on/off (manual day preview), left and right lights, automatic restore; curtains; closet; lie down; darts mini-game in the darts panel.
- **Lighting** follows Asia/Tokyo time (day and night).

## Rules

- The entry panel shows one "Enter room" control. The status line is empty once the room is ready and only carries loading or error text.
- The brand uses the shared `BrandMark`.
- `room-design-prototype` is not a public route (removed 2026-09-27).
- 3D materials use photo-derived natural colour. HTML controls use Atelier tokens and image-filter tokens (`--atelier-image-preview`, `--atelier-image-dimmed`).
- Model work follows `conductor/room-spec.md` and `conductor/room-model-design-spec.md`.
