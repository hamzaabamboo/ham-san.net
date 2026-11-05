# Current task

## State and authority

- Handoff and push requested; stop after delivery. No further implementation, browser launch, model editing, CMS write, manual deploy, merge or external comment authorized.
- Implementation pushed to main: 2860ec75271476d7bc8dcb32cf6ae7c454daa363. Origin: git@gh-personal:hamzaabamboo/ham-san.net.git. Local/remote implementation heads matched after push. This record and the full handoff form the documentation follow-up; verify the final head with git rev-parse HEAD origin/main rather than embedding a self-referential hash.
- Canonical full handoff: docs/HANDOFF_2026-11-06_ROOM_TOUR.md. Read this index first, then only the handoff section and source needed for the next requested action. Historical handoffs and their process IDs, authority, test counts and architecture claims are not current evidence.
- Next action: none without a new request. Owned browser and server stopped. Preserve unrelated local files listed below.
- Handoff skill 1-167 EOF read; new handoff read through EOF after writing, then current evidence, Git state, port and browser state checked. No previous-session history read.

## Product contract to preserve

- Homepage is a scroll tour of the actual room, with persistent ambient motion, real data, native scrolling, usable navigation, mobile/tablet layouts, reduced motion and readable HTML fallback. First view contains no Kameko photo.
- ADR 0008 supersedes ADR 0001. Existing design docs still describing a photo hero do not override this decision. Do not silently rewrite specifications to match implementation.
- Title Frontend Engineer & Builder; Tokyo; availability supports freelance and full-time frontend work and links to Contact. English, Japanese and Thai remain supported.
- Identity is an ensemble of actual activities. Darkroom/400 ISO, ribbon-only and penlight-only identities were rejected. No invented editorial content, metrics or dummy data.
- Strapi owns projects, experience, profile, photo metadata and media; Outline owns notes and hobbies. Photo binaries stay on X. No paid provider requests or CMS writes were performed in this continuation.

## Current implementation

- apps/astro/src/pages/[locale]/index.astro wraps SSR HomeBody chapters in RoomHome tour mode. RoomHome.astro conducts scroll progress; room-runtime.ts supplies real GLB poses, lighting, ambient motion and free-roam/play behavior.
- Eight chapter compositions: intro, career, projects, attendance, practice, notes, photos and outro. Phone uses scene above a separate reading area, chapter holds while reading, full projection on entry.
- Phone scene height below 700px is clamp(14rem, 34svh, 20rem): 371 to 287px at 390x844. Tablet retains its own height.
- Entry keeps camera, animation phase and merged geometry. Color/depth curtain sway matches. Duplicate rack light removed, penlight spill reduced, ceiling lights located from diffuser world bounds.
- Four matching day/night desktop/mobile preview loops and posters bridge initial render to WebGL. Motion choice persists; otherwise OS preference applies. Off freezes shader/texture/fan phase and refreshes matching shadow once.
- Native model source assets/room/room-v2.blend, export assets/room/export_room_v2.py. Blender edits require exposed native Blender Lab MCP; no Python MCP client or Blender CLI substitute.

## Current verification

- Final push gate: .scratch/rec/tests-push-handoff.log, 363 pass / 0 fail across 35 files; .scratch/rec/build-push-handoff.log, Node production build exit 0 and zero Astro errors. Chunk-size/Browserslist warnings remain. Earlier 388-test claims are historical, not current counts.
- Viewport checks inspected EN390, Japanese phone, Thai320 and tablet768. Entry/exit, motion toggle, native wheel, drawer and Escape worked. Presets alone did not enable coarse pointer.
- Actual touch proof: .scratch/rec/mobile-touch-cold-entry-proof.mp4 and JSON, plus mobile-touch-cold-entry-proof-sequence.png. 13.53 seconds, 708 frames, zero captured Runtime.exceptionThrown; final 390x844, coarse=true, touch=5, motion=on, entered=true, revealed=true. Preview/live/entry sequence and continuing curtain motion inspected.
- All eight screenshots in .scratch/rec/mobile-touch-tour-proof.mp4.chapters/01.png through 08.png inspected individually. Native wheel, correct captions, width390, coarse=true and overflow=false for all eight. Video/JSON retained beside them.
- Physical-device behavior, current production Lighthouse, final owner visual acceptance and complete model acceptance remain unverified. Legacy model record: 671688 triangles and 41 screening/name/count failures; not rerun or certified by this continuation.
- Push-triggered workflows last observed in progress: CI 42055920989 and Deploy 42055920967. No manual workflow dispatch. Read their current state only if requested; do not call them passed from startup.

## Runtime and capture traps

- Use DO_NOT_TRACK=1, ASTRO_TELEMETRY_DISABLED=1 for Astro, RAYON_NUM_THREADS=1 and UV_THREADPOOL_SIZE=1. Tests --max-concurrency 1. Installed agent-browser is under mise exec node@24.22.1; repository default24.16.0 lacked it.
- Existing ASTRO_ADAPTER=node path works. Netlify local Edge startup failed with unexpected --allow-scripts; do not blindly relaunch the same failing adapter.
- No retained preview is running. Normal Node server, if newly needed: CWD apps/astro, HOST=0.0.0.0 PORT=4323 DO_NOT_TRACK=1 mise exec node@24.22.1 -- node dist/server/entry.mjs. Check port first and stop owned process when finished.
- One isolated browser name ham-room-continuity. Every command: AGENT_BROWSER_HEADED=true and AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic,--mute-audio". No user Chrome. Activate existing task tab when hidden; never open recovery tabs.
- capture-session.mjs attaches to the current marked tab and supports --touch --enter or --touch --chapters. Read tools/room-harness/README.md capture section. Discover a fresh CDP endpoint; never reuse old socket URLs.
- During CDP touch capture, do not issue agent-browser commands: CLI restores stored desktop viewport/touch settings. Screencast frame sizes vary; helper preserves aspect ratio and crops phone region. Scrolled screenshots use viewport capture without a document-origin clip.
- CLI record creates a fresh context and can drop motion/media/storage. It is not equivalent to recording the owned tab. Always inspect actual motion state and temporal sequence.
- Source photos immutable; no system/audio/GUI automation. Never navigate mailto/tel/non-http links during browser checks. No telemetry, cloud rendering or paid generation without current authority.

## Preserved local work and cleanup

- Modified generated reports left untouched and uncommitted: tools/room-harness/build/audit-latest.json and physics-latest.json.
- Local research not published: .taste-skill/direction.json, conductor/brand-notes/, conductor/home-brand-inventory.md. Untracked older materials retained: conductor/unslop-round2-deduped.json, conductor/unslop-round2-raw-findings.json, docs/HANDOFF_2026-10-22.md, docs/HANDOFF_2026-10-28_HOBBIES_RECOVERY.md, docs/HANDOFF_2026-10-28_UI_AUDIT.md, docs/HANDOFF_2026-11-05_HOME.md, docs/HANDOFF_2026-11-05_ROOM_TOUR.md.
- Whole tree intentionally not clean; task delivery must not delete or publish these to manufacture cleanliness. Scope/ownership documented in full handoff.
- Task browser session info active=false, pid/runtime null; port4323 has no listener. Unrelated inkless-setlist preserved.
- Removed 10.8MiB invalid continuation captures, plus earlier 141.6MiB superseded task outputs. Retain final proof, editable Blender source and .scratch/rec/scene-repair/room-v2-before.blend. Earlier mo clean dry-run requested sudo and was aborted.
