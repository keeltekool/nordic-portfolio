"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectTabsProps {
  counts: { projects: number; archive: number };
  matches?: number; // set while a search is active: shown as "3 of 71" on the current tab
}

export function ProjectTabs({ counts, matches }: ProjectTabsProps) {
  const pathname = usePathname();
  const isArchive = pathname === "/archive";
  const count = (n: number, current: boolean) => (
    <span className="ml-1.5 text-xs font-normal normal-case tracking-normal tabular-nums text-[var(--muted)]">
      {current && matches !== undefined ? `${matches} of ${n}` : n}
    </span>
  );

  return (
    <div className="flex gap-6">
      <Link
        href="/"
        className={`text-sm font-medium uppercase tracking-wider pb-2 border-b-2 transition-colors ${
          !isArchive
            ? "text-[var(--foreground)] border-[var(--foreground)]"
            : "text-[var(--muted)] border-transparent hover:text-[var(--foreground)]"
        }`}
      >
        Projects{count(counts.projects, !isArchive)}
      </Link>
      <Link
        href="/archive"
        className={`text-sm font-medium uppercase tracking-wider pb-2 border-b-2 transition-colors ${
          isArchive
            ? "text-[var(--foreground)] border-[var(--foreground)]"
            : "text-[var(--muted)] border-transparent hover:text-[var(--foreground)]"
        }`}
      >
        Archive{count(counts.archive, isArchive)}
      </Link>
    </div>
  );
}
