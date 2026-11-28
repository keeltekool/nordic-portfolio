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
  urlLabel?: string; // replaces "Open App" when the entry is not an app
  links?: { label: string; url: string }[]; // further links, shown under the main one
  adminUrl?: string;
  landingUrl?: string;
  github?: string;
  image?: string;
  stack?: Stack;
  updatedAt?: string;
  archived?: boolean;
  pinLast?: boolean;
}

export interface ProjectsData {
  projects: Project[];
}
