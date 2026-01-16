import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Egert Väinaste | Portfolio",
  description: "Product Manager exploring development with AI. Projects built with Claude Code.",
  openGraph: {
    title: "Egert Väinaste | Portfolio",
    description: "Product Manager exploring development with AI. Projects built with Claude Code.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <main className="min-h-screen px-6 max-w-2xl mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
