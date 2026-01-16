export function Footer() {
  return (
    <footer className="py-8 mt-8 border-t border-[var(--border)]">
      <p className="text-sm text-[var(--muted)]">
        Built with{" "}
        <a
          href="https://claude.ai/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--foreground)] transition-colors"
        >
          Claude Code
        </a>
      </p>
    </footer>
  );
}
