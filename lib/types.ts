export interface Stack {
  builtWith: string;
  services: string;
  howItWorks: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  github: string;
  stack?: Stack;
}

export interface ProjectsData {
  projects: Project[];
}
