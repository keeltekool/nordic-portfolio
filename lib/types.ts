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
  adminUrl?: string;
  github: string;
  image?: string;
  stack?: Stack;
  updatedAt?: string;
  archived?: boolean;
}

export interface ProjectsData {
  projects: Project[];
}
