import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/loja", label: "Loja" },
  { to: "/livro", label: "O Livro" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-wine shadow-soft">
            <span className="text-display text-xl font-semibold text-primary-foreground">
              C
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-display text-lg font-semibold tracking-tight text-foreground">
              As Cidadelas <span className="text-gold">360º</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Fé · Arte · Missão
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Sacola"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-gold hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              0
            </span>
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
