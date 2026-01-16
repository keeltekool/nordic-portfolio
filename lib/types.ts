export interface Project {
  id: string;
  title: string;
  description: string;
  github: string;
}

export interface ProjectsData {
  projects: Project[];
}
