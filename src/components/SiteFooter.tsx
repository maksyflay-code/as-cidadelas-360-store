import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-wine text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-radiance opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 text-center md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <p className="text-display text-3xl font-semibold tracking-tight">
              As Cidadelas <span className="text-gold">360º</span>
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75 md:mx-0">
              "Tudo é possível ao que crê" — Marcos 9:23. <br />
              Uma loja dedicada à evangelização através da arte, da palavra e
              dos símbolos da nossa fé.
            </p>
            <div className="mt-6 flex justify-center gap-3 md:justify-start">
              {[Instagram, Facebook, Youtube, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-wine-deep"
                  aria-label="Rede social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Navegar
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li><Link to="/loja">Loja completa</Link></li>
              <li><Link to="/livro">O Livro</Link></li>
              <li><Link to="/sobre">Sobre a missão</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Atendimento
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li>Segunda a Sexta · 9h às 18h</li>
              <li>contato@cidadelas360.com.br</li>
              <li>Trocas e devoluções</li>
              <li>Política de privacidade</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex justify-center border-t border-gold/20 pt-8 text-center">
          <p className="text-xs text-primary-foreground/70">
            Desenvolvido por{" "}
            <a
              href="https://www.linkedin.com/in/maksyflay/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 transition-colors hover:underline"
            >
              Maksyflay Souza
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
