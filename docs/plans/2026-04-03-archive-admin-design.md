# Portfolio Archive & Admin — Design Document

**Date:** 2026-04-03
**Status:** Approved

---

## Problem

36 portfolio projects in a single scrollable page. Finding and browsing relevant work is getting heavy. Older/smaller projects dilute the impact of current highlights.

## Solution

Split the project listing into two public views (**Projects** and **Archive**) with a password-protected admin page to move projects between them.

---

## Public Pages

### Navigation Tabs

The existing "PROJECTS" heading becomes a two-tab navigation:

```
Projects        Archive
────────
```

- Active tab has an underline, inactive tab is muted text
- No counts in the tab labels — clean and maintenance-free
- Tabs appear on both `/` and `/archive`, same position
- Clicking a tab navigates to that page (Next.js `<Link>`)

### Main Page (`/`)

- Same as current, but filtered: only shows projects where `archived !== true`
- Sort order unchanged (by `updatedAt`, newest first)
- "Projects" tab is active (underlined)

### Archive Page (`/archive`)

- Identical card grid layout, same `ProjectCard` component
- Shows only projects where `archived === true`
- "Archive" tab is active (underlined)
- Same Header, Intro, Footer as main page

---

## Admin Page (`/admin`)

### Authentication

- Single password stored as `ADMIN_PASSWORD` env var
- Login form: password field + "Sign In" button, centered, minimal
- On success: set httpOnly signed cookie (using `jose`, ~3KB)
- Cookie checked server-side on the admin page component — no middleware
- "Log out" button clears the cookie

### Dashboard (after login)

Two sections showing all projects grouped by current status:

```
Portfolio Admin                              [Log out]

┌──────────────────────────────────────────────────────┐
│              Save Changes (2 pending)                 │
└──────────────────────────────────────────────────────┘

MAIN PAGE
┌──────────────────────────────────────────────────────┐
│  E-Seal Prototype                       [→ Archive]  │
│  E-Seal Developer Portal                [→ Archive]  │
│  Allekirjoitus.fi v2                    [→ Archive]  │
│  ...                                                 │
└──────────────────────────────────────────────────────┘

ARCHIVED
┌──────────────────────────────────────────────────────┐
│  DJ Portfolio                           [← Restore]  │
│  Spotify Genre Browser                  [← Restore]  │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

**Behavior:**
- Click "→ Archive" — row animates to the Archived section. Pending change count increments.
- Click "← Restore" — row animates back to Main. Same behavior.
- "Save Changes" button — disabled when zero pending changes. When clicked, writes updated `projects.json` via API route and shows success confirmation.
- Projects sorted by `updatedAt` within each section (same as public pages).

### Persistence

- `projects.json` remains the single source of truth
- Admin API route writes directly to `data/projects.json` on disk
- Works in development (local fs access)
- On production (Vercel): API route uses GitHub Contents API to update the file in the repo, triggering auto-deploy (~15-30s)
- Requires a `GITHUB_TOKEN` env var (fine-grained PAT with repo contents write scope)

---

## Data Model

Add `archived` field to the `Project` interface:

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  github: string;
  image?: string;
  stack?: Stack;
  updatedAt?: string;
  archived?: boolean;  // NEW — true = in archive, falsy = main page
}
```

No changes to `projects.json` structure — just an optional new field per project. Projects without `archived` default to main page (backwards compatible).

---

## New Files

```
app/archive/page.tsx          — Archive page (public)
app/admin/page.tsx            — Admin login + dashboard
app/api/admin/login/route.ts  — Login endpoint (validate password, set cookie)
app/api/admin/logout/route.ts — Logout endpoint (clear cookie)
app/api/admin/save/route.ts   — Save projects.json (fs in dev, GitHub API in prod)
components/ProjectTabs.tsx     — Shared tab navigation (Projects | Archive)
components/AdminDashboard.tsx  — Admin project list with toggle buttons
lib/auth.ts                    — JWT sign/verify helpers using jose
```

## Dependencies

- `jose` (~3KB) — JWT signing/verification for admin cookie

## Env Vars

- `ADMIN_PASSWORD` — the admin login password
- `ADMIN_SECRET` — secret key for signing the JWT cookie
- `GITHUB_TOKEN` — fine-grained PAT for production saves (repo contents write)

---

## What Does NOT Change

- ProjectCard component — untouched
- ProjectGrid component — untouched (receives filtered array)
- Header, Intro, Footer — untouched
- Design language, colors, dark/light mode — untouched
- Screenshot system — untouched
- Vercel deployment flow — untouched
