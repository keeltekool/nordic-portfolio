export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  github: string;
}

export interface ProjectsData {
  projects: Project[];
}
