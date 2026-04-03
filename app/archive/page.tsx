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
