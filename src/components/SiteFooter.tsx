export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-wine text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-radiance opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 py-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/75">
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/maksyflay/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            Maksyflay Souza
          </a>
        </p>
      </div>
    </footer>
  );
}
