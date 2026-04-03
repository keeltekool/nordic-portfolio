import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin | Egert Väinaste",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const isAuthed = token ? await verifyToken(token) : false;

  if (!isAuthed) {
    return <AdminLogin />;
  }

  return (
    <AdminDashboard
      initialProjects={projectsData.projects as Project[]}
    />
  );
}
