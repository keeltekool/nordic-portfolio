"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectTabs } from "./ProjectTabs";

interface ProjectGridProps {
  projects: Project[];
  counts: { projects: number; archive: number };
}

export function ProjectGrid({ projects, counts }: ProjectGridProps) {
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    try {
      setCompact(localStorage.getItem("view") === "list");
    } catch {}
  }, []);
  const toggleView = () => {
    setCompact(!compact);
    try {
      localStorage.setItem("view", compact ? "cards" : "list");
    } catch {}
  };
  const q = query.trim().toLowerCase();
  const shown = q
    ? projects.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q))
    : projects;

  return (
    <>
      <div className="sticky top-0 z-10 bg-[var(--background)] py-3 mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <ProjectTabs counts={counts} matches={q ? shown.length : undefined} />
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--foreground)] transition-colors [&::-webkit-search-cancel-button]:grayscale"
            />
          </div>
          <button
            onClick={toggleView}
            aria-label={compact ? "Show as cards" : "Show as list"}
            title={compact ? "Show as cards" : "Show as list"}
            className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] focus-visible:border-[var(--foreground)] outline-none transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {compact ? (
                <>
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {shown.length > 0 && compact ? (
        <ul
          aria-label="Projects"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]"
        >
          {shown.map((p) => (
            <li key={p.id} className="flex items-baseline gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {p.title}
                  </a>
                ) : (
                  <span className="font-medium">{p.title}</span>
                )}
                <p className="text-sm text-[var(--muted)] truncate">{p.description}</p>
              </div>
              {p.updatedAt && (
                <span className="shrink-0 text-xs text-[var(--muted)]">{p.updatedAt}</span>
              )}
            </li>
          ))}
        </ul>
      ) : shown.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {shown.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          {q ? `No projects match "${query.trim()}".` : "No projects here yet."}
        </p>
      )}
    </>
  );
}
