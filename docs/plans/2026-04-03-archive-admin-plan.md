# Portfolio Archive & Admin — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split portfolio into Main/Archive views with public tabs and a password-protected admin page to move projects between them.

**Architecture:** Add `archived` boolean to projects.json. Public pages filter on it. Admin page uses JWT cookie auth, client-side toggles, and an API route that writes to projects.json (fs in dev, GitHub API in prod).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, jose (JWT)

---

## Phase 1: Foundation

### Task 1: Add `archived` field to Project type

**Files:**
- Modify: `lib/types.ts:7-10`

**Step 1: Update the interface**

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
  archived?: boolean;
}
```

**Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add archived field to Project type"
```

---

### Task 2: Install jose

**Step 1: Install**

```bash
npm install jose
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add jose for admin JWT auth"
```

---

## Phase 2: Public Pages

### Task 3: Create ProjectTabs component

**Files:**
- Create: `components/ProjectTabs.tsx`

**Step 1: Create the component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProjectTabs() {
  const pathname = usePathname();
  const isArchive = pathname === "/archive";

  return (
    <div className="flex gap-6 mb-6">
      <Link
        href="/"
        className={`text-sm font-medium uppercase tracking-wider pb-2 border-b-2 transition-colors ${
          !isArchive
            ? "text-[var(--foreground)] border-[var(--foreground)]"
            : "text-[var(--muted)] border-transparent hover:text-[var(--foreground)]"
        }`}
      >
        Projects
      </Link>
      <Link
        href="/archive"
        className={`text-sm font-medium uppercase tracking-wider pb-2 border-b-2 transition-colors ${
          isArchive
            ? "text-[var(--foreground)] border-[var(--foreground)]"
            : "text-[var(--muted)] border-transparent hover:text-[var(--foreground)]"
        }`}
      >
        Archive
      </Link>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/ProjectTabs.tsx
git commit -m "feat: add ProjectTabs navigation component"
```

---

### Task 4: Update main page to use tabs and filter

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `components/ProjectGrid.tsx` (remove heading)

**Step 1: Simplify ProjectGrid — remove the heading (tabs replace it)**

```tsx
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Step 2: Update main page**

```tsx
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Footer } from "@/components/Footer";
import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/types";

export default function Home() {
  const activeProjects = [...(projectsData.projects as Project[])]
    .filter((p) => !p.archived)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <>
      <Header />
      <Intro />
      <section className="py-8">
        <ProjectTabs />
        <ProjectGrid projects={activeProjects} />
      </section>
      <Footer />
    </>
  );
}
```

**Step 3: Verify locally**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- "Projects" tab is active (underlined, foreground color)
- "Archive" tab is muted
- All 36 projects still visible (none have `archived: true` yet)
- The old "PROJECTS" heading is gone, replaced by tabs

**Step 4: Commit**

```bash
git add app/page.tsx components/ProjectGrid.tsx
git commit -m "feat: replace PROJECTS heading with tab navigation on main page"
```

---

### Task 5: Create archive page

**Files:**
- Create: `app/archive/page.tsx`

**Step 1: Create the page**

```tsx
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Footer } from "@/components/Footer";
import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Archive | Egert Väinaste",
  description: "Archived portfolio projects.",
};

export default function ArchivePage() {
  const archivedProjects = [...(projectsData.projects as Project[])]
    .filter((p) => p.archived)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <>
      <Header />
      <Intro />
      <section className="py-8">
        <ProjectTabs />
        {archivedProjects.length > 0 ? (
          <ProjectGrid projects={archivedProjects} />
        ) : (
          <p className="text-sm text-[var(--muted)]">No archived projects.</p>
        )}
      </section>
      <Footer />
    </>
  );
}
```

**Step 2: Verify locally**

Open `http://localhost:3000/archive`. Confirm:
- "Archive" tab is active (underlined)
- "Projects" tab is muted
- Shows "No archived projects." (none archived yet)
- Click "Projects" tab → navigates back to main page

**Step 3: Commit**

```bash
git add app/archive/page.tsx
git commit -m "feat: add public archive page with tab navigation"
```

---

## CHECKPOINT 1 — Verify public pages

Open browser, verify:
1. Main page: tabs visible, "Projects" active, all cards showing
2. Archive page: tabs visible, "Archive" active, empty state message
3. Tab switching works both directions
4. Dark mode works on both pages
5. Mobile responsive — tabs stack correctly

---

## Phase 3: Admin Auth

### Task 6: Create auth helpers

**Files:**
- Create: `lib/auth.ts`

**Step 1: Create the module**

```typescript
import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET env var is required");
  return new TextEncoder().encode(secret);
}

export async function createToken(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
```

**Step 2: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: add JWT auth helpers for admin"
```

---

### Task 7: Create login API route

**Files:**
- Create: `app/api/admin/login/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
```

**Step 2: Commit**

```bash
git add app/api/admin/login/route.ts
git commit -m "feat: add admin login API route"
```

---

### Task 8: Create logout API route

**Files:**
- Create: `app/api/admin/logout/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
```

**Step 2: Commit**

```bash
git add app/api/admin/logout/route.ts
git commit -m "feat: add admin logout API route"
```

---

## Phase 4: Admin Dashboard

### Task 9: Create AdminLogin component

**Files:**
- Create: `components/AdminLogin.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h1 className="text-lg font-medium mb-6 text-center">
          Portfolio Admin
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] mb-3"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-xs mb-3">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/AdminLogin.tsx
git commit -m "feat: add AdminLogin component"
```

---

### Task 10: Create AdminDashboard component

**Files:**
- Create: `components/AdminDashboard.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

interface AdminDashboardProps {
  initialProjects: Project[];
}

export function AdminDashboard({ initialProjects }: AdminDashboardProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const mainProjects = projects
    .filter((p) => !p.archived)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const archivedProjects = projects
    .filter((p) => p.archived)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const changedCount = projects.filter((p) => {
    const original = initialProjects.find((ip) => ip.id === p.id);
    return original && Boolean(p.archived) !== Boolean(original.archived);
  }).length;

  function toggleProject(id: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p))
    );
    setMessage("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (res.ok) {
        setMessage("Saved! Changes will deploy in ~30s.");
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error || "Failed to save"}`);
      }
    } catch {
      setMessage("Error: Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-medium">Portfolio Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Save bar */}
      <div className="mb-8">
        <button
          onClick={handleSave}
          disabled={changedCount === 0 || saving}
          className="w-full px-4 py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          {saving
            ? "Saving..."
            : changedCount > 0
              ? `Save Changes (${changedCount} pending)`
              : "No changes"}
        </button>
        {message && (
          <p
            className={`text-sm mt-2 text-center ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Main projects */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
          Main Page ({mainProjects.length})
        </h2>
        <div className="border border-[var(--border)] rounded-lg divide-y divide-[var(--border)]">
          {mainProjects.map((p) => {
            const isChanged =
              Boolean(p.archived) !==
              Boolean(initialProjects.find((ip) => ip.id === p.id)?.archived);
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 ${isChanged ? "bg-[var(--card-hover)]" : ""}`}
              >
                <span className="text-sm">{p.title}</span>
                <button
                  onClick={() => toggleProject(p.id)}
                  className="text-xs px-3 py-1 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                >
                  → Archive
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Archived projects */}
      <div>
        <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
          Archived ({archivedProjects.length})
        </h2>
        <div className="border border-[var(--border)] rounded-lg divide-y divide-[var(--border)]">
          {archivedProjects.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">
              No archived projects.
            </div>
          ) : (
            archivedProjects.map((p) => {
              const isChanged =
                Boolean(p.archived) !==
                Boolean(
                  initialProjects.find((ip) => ip.id === p.id)?.archived
                );
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-4 py-3 ${isChanged ? "bg-[var(--card-hover)]" : ""}`}
                >
                  <span className="text-sm">{p.title}</span>
                  <button
                    onClick={() => toggleProject(p.id)}
                    className="text-xs px-3 py-1 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                  >
                    ← Restore
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/AdminDashboard.tsx
git commit -m "feat: add AdminDashboard component with toggle and save"
```

---

### Task 11: Create admin page (server component with auth gate)

**Files:**
- Create: `app/admin/page.tsx`

**Step 1: Create the page**

```tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin | Egert Väinaste",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const isAuthed = token ? await verifyToken(token) : false;

  if (!isAuthed) {
    return <AdminLogin />;
  }

  return (
    <AdminDashboard
      initialProjects={projectsData.projects as Project[]}
    />
  );
}
```

**Step 2: Verify locally**

Add temporary env vars to `.env.local`:
```
ADMIN_PASSWORD=test123
ADMIN_SECRET=dev-secret-change-in-prod
```

Open `http://localhost:3000/admin`. Confirm:
- Login form appears
- Wrong password → "Invalid password" error
- Correct password → dashboard with all 36 projects in Main section
- "→ Archive" moves a project down, "← Restore" moves it back
- Changed rows highlight
- "Save Changes (N pending)" button shows count
- "Log out" returns to login form

**Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin page with login gate and dashboard"
```

---

### Task 12: Create save API route

**Files:**
- Create: `app/api/admin/save/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { writeFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projects } = await req.json();
  if (!Array.isArray(projects)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const content = JSON.stringify({ projects }, null, 2) + "\n";

  // Development: write to filesystem
  if (process.env.NODE_ENV === "development") {
    const filePath = path.join(process.cwd(), "data/projects.json");
    writeFileSync(filePath, content, "utf-8");
    return NextResponse.json({ success: true, mode: "local" });
  }

  // Production: commit via GitHub API
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  const owner = "keeltekool";
  const repo = "nordic-portfolio";
  const filePath = "data/projects.json";

  // Get current file SHA (required for update)
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!getRes.ok) {
    return NextResponse.json(
      { error: "Failed to read file from GitHub" },
      { status: 500 }
    );
  }

  const { sha } = await getRes.json();

  // Update file (creates a commit, triggers Vercel deploy)
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "chore: update project archive status",
        content: Buffer.from(content).toString("base64"),
        sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json();
    return NextResponse.json(
      { error: err.message || "Failed to update GitHub" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, mode: "github" });
}
```

**Step 2: Verify locally**

1. Open admin, log in
2. Move a project to Archive
3. Click "Save Changes"
4. Confirm `data/projects.json` was updated on disk (check with `git diff`)
5. Main page now shows one fewer project
6. Archive page now shows the moved project

**Step 3: Commit**

```bash
git add app/api/admin/save/route.ts
git commit -m "feat: add save API route (local fs + GitHub API for prod)"
```

---

## CHECKPOINT 2 — Full local E2E test

Open browser, verify the complete flow:
1. `http://localhost:3000` — main page with tabs, all projects visible
2. Click "Archive" tab → empty archive page
3. `http://localhost:3000/admin` → login form
4. Enter password → dashboard loads with all projects in "Main Page" section
5. Click "→ Archive" on 2-3 projects (e.g. DJ Portfolio, Spotify Genre Browser, PicMachine Web)
6. Verify changed rows highlight, save button shows count
7. Click "Save Changes" → success message
8. Go to main page → those 3 projects are gone
9. Go to archive page → those 3 projects appear
10. Go back to admin → click "← Restore" on one, save → project returns to main page
11. Dark mode works on all pages (login, dashboard, archive)
12. Log out works

---

## Phase 5: Deploy

### Task 13: Set env vars and .env.local to .gitignore

**Files:**
- Verify: `.gitignore` contains `.env.local`
- Modify: `.env.local` (local only, not committed)

**Step 1: Verify .gitignore**

```bash
grep -q ".env.local" .gitignore && echo "OK" || echo ".env.local >> .gitignore"
```

**Step 2: Create a GitHub fine-grained PAT**

Go to https://github.com/settings/tokens?type=beta
- Name: `nordic-portfolio-admin`
- Repository: `keeltekool/nordic-portfolio` only
- Permissions: Contents → Read and write
- Copy the token

**Step 3: Set Vercel env vars**

```bash
echo -n "YOUR_PASSWORD" | npx vercel env add ADMIN_PASSWORD production
echo -n "YOUR_RANDOM_SECRET" | npx vercel env add ADMIN_SECRET production
echo -n "github_pat_XXXX" | npx vercel env add GITHUB_TOKEN production
```

Generate ADMIN_SECRET with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Step 4: Push and deploy**

```bash
git push
```

Wait for Vercel deploy (~30s), then verify on live site:
1. `https://egertv.vercel.app` — tabs visible
2. `https://egertv.vercel.app/archive` — empty archive
3. `https://egertv.vercel.app/admin` — login form
4. Log in → dashboard works
5. Archive a project → save → wait 30s → verify on public pages

---

## Summary of all new/modified files

```
MODIFIED:
  lib/types.ts                    — added archived field
  components/ProjectGrid.tsx      — removed heading (tabs replace it)
  app/page.tsx                    — filter + tabs

CREATED:
  components/ProjectTabs.tsx      — public tab navigation
  components/AdminLogin.tsx       — login form
  components/AdminDashboard.tsx   — project manager with toggles
  app/archive/page.tsx            — public archive page
  app/admin/page.tsx              — admin page (auth gate)
  app/api/admin/login/route.ts    — login endpoint
  app/api/admin/logout/route.ts   — logout endpoint
  app/api/admin/save/route.ts     — save projects.json
  lib/auth.ts                     — JWT helpers
```

## Env vars needed

| Var | Where | Purpose |
|-----|-------|---------|
| `ADMIN_PASSWORD` | `.env.local` + Vercel | Login password |
| `ADMIN_SECRET` | `.env.local` + Vercel | JWT signing key |
| `GITHUB_TOKEN` | Vercel only | GitHub API for prod saves |
