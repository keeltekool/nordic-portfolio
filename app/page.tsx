import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Footer } from "@/components/Footer";
import projectsData from "@/data/projects.json";

export default function Home() {
  return (
    <>
      <Header />
      <Intro />
      <ProjectGrid projects={projectsData.projects} />
      <Footer />
    </>
  );
}
