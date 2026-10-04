"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectTabs } from "./ProjectTabs";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = q
    ? projects.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q))
    : projects;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 mb-6">
        <ProjectTabs />
        <div className="relative w-full sm:w-64">
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
      </div>
      {shown.length > 0 ? (
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
