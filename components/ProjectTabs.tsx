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
