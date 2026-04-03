import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { writeFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projects } = await req.json();
  if (!Array.isArray(projects)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const content = JSON.stringify({ projects }, null, 2) + "\n";

  // Development: write to filesystem
  if (process.env.NODE_ENV === "development") {
    const filePath = path.join(process.cwd(), "data/projects.json");
    writeFileSync(filePath, content, "utf-8");
    return NextResponse.json({ success: true, mode: "local" });
  }

  // Production: commit via GitHub API
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  const owner = "keeltekool";
  const repo = "nordic-portfolio";
  const ghFilePath = "data/projects.json";

  // Get current file SHA (required for update)
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${ghFilePath}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!getRes.ok) {
    return NextResponse.json(
      { error: "Failed to read file from GitHub" },
      { status: 500 }
    );
  }

  const { sha } = await getRes.json();

  // Update file (creates a commit, triggers Vercel deploy)
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${ghFilePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "chore: update project archive status",
        content: Buffer.from(content).toString("base64"),
        sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json();
    return NextResponse.json(
      { error: err.message || "Failed to update GitHub" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, mode: "github" });
}
