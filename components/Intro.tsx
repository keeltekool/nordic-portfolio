export function Intro() {
  return (
    <section className="py-8">
      <p className="text-[var(--muted)] leading-relaxed max-w-lg">
        Product Manager exploring development with AI.
        This site tracks my journey building projects with{" "}
        <a
          href="https://claude.ai/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--foreground)] underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Claude Code
        </a>
        .
      </p>
    </section>
  );
}
