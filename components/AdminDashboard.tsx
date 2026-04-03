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
    router.push("/");
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
                  &rarr; Archive
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
                    &larr; Restore
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
