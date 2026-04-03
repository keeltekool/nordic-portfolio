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
