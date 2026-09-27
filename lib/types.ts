export interface Stack {
  builtWith: string;
  services: string;
  howItWorks: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string; // absent for a local-only app: no Open App link
  adminUrl?: string;
  landingUrl?: string;
  github?: string;
  image?: string;
  stack?: Stack;
  updatedAt?: string;
  archived?: boolean;
}

export interface ProjectsData {
  projects: Project[];
}
