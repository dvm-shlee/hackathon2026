export function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">
              OSSIG
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Hackathon Bordeaux 2026
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Discord
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          June 11-13, 2026 · Bordeaux, France
        </p>
      </div>
    </footer>
  );
}
