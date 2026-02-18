import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Footer } from "@/components/Footer";
import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/types";

export default function Home() {
  const sortedProjects = [...projectsData.projects].sort((a: Project, b: Project) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <>
      <Header />
      <Intro />
      <ProjectGrid projects={sortedProjects} />
      <Footer />
    </>
  );
}
