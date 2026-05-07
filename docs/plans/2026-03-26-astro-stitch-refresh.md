# Astro Stitch Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the approved Stitch visual direction to the Astro site while preserving the existing route structure, Panda/styled-system primitives, and current content sources.

**Architecture:** Refresh the shared shell first so the design system is carried by layouts, navigation, footer, typography, and shared content components. Then update the Stitch-backed route groups to compose those primitives into the new industrial-editorial presentation without rewriting data fetching.

**Tech Stack:** Astro, React islands, Panda CSS, styled-system, GraphQL, Outline API

---

### Task 1: Shared Shell

**Files:**
- Modify: `apps/astro/src/layouts/BaseLayout.astro`
- Modify: `apps/astro/src/layouts/MainLayout.astro`
- Modify: `apps/astro/src/components/layout/Navigation.astro`
- Modify: `apps/astro/src/components/layout/Footer.astro`
- Modify: `apps/astro/src/components/theme/ThemeToggle.tsx`
- Modify: `apps/astro/src/index.css`
- Create: `apps/astro/src/components/brand/BrandMark.tsx`

**Steps:**
1. Load the approved brand fonts and align base typography to the Stitch direction.
2. Replace the current brand text-only shell with an architectural top bar using the new brand mark.
3. Update footer and theme toggle to match the new structural visual language.
4. Add global background, surface, selection, and scrolled-nav styling.

### Task 2: Shared Content Surfaces

**Files:**
- Modify: `apps/astro/src/components/projects/ProjectCard.tsx`
- Modify: `apps/astro/src/components/common/LinkItem.tsx`
- Modify: `apps/astro/src/components/lib/Markdown.tsx`

**Steps:**
1. Restyle cards, links, and rich text for the industrial/editorial system.
2. Keep existing data shapes and component APIs stable.
3. Improve reading layouts and metadata presentation for content-heavy routes.

### Task 3: Route Refresh

**Files:**
- Modify: `apps/astro/src/pages/[locale]/index.astro`
- Modify: `apps/astro/src/pages/[locale]/about/index.astro`
- Modify: `apps/astro/src/pages/[locale]/projects/index.astro`
- Modify: `apps/astro/src/pages/[locale]/hobbies/index.astro`
- Modify: `apps/astro/src/pages/[locale]/contact/index.astro`
- Modify: `apps/astro/src/pages/[locale]/notes/[...slug]/index.astro`

**Steps:**
1. Rebuild the homepage around the approved “workshop” concept while keeping dynamic project data.
2. Convert about into a dossier layout with stronger sectioning and scanning.
3. Rework projects into archive-style index cards.
4. Rebuild hobbies and contact around the approved Stitch comps.
5. Replace the placeholder note-detail page with a working Outline-backed detail view.

### Task 4: Verification

**Files:**
- Verify only

**Steps:**
1. Run Astro formatting.
2. Run Astro lint.
3. Run Astro build.
4. Fix any issues revealed by verification.
