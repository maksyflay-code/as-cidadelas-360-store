import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contato")({
  component: ContatoPage,
  head: () => ({
    meta: [
      { title: "Contato — As Cidadelas 360º" },
      {
        name: "description",
        content:
          "Fale com a equipe As Cidadelas 360º. Atendimento, parcerias e missão.",
      },
    ],
  }),
});

function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Fale conosco
          </p>
          <h1 className="mt-4 text-display text-5xl font-medium leading-[1.05] text-foreground md:text-7xl">
            Em <span className="italic text-primary">contato.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Quer saber mais sobre o livro, fazer um pedido especial ou propor
            uma parceria missionária? Escreva para nós.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <ContactItem icon={Mail} label="E-mail" value="contato@cidadelas360.com.br" />
            <ContactItem icon={Phone} label="WhatsApp" value="(00) 00000-0000" />
            <ContactItem icon={MapPin} label="Localização" value="Brasil · Atendimento on-line" />

            <div className="mt-8 rounded-xl border border-gold/40 bg-gradient-wine p-8 text-primary-foreground">
              <p className="text-display text-2xl italic">
                "Tudo é possível ao que crê."
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">
                Marcos 9:23
              </p>
            </div>
          </div>

          <form className="space-y-5 rounded-xl border border-border bg-card p-8 shadow-soft">
            <Field label="Nome" type="text" placeholder="Seu nome" />
            <Field label="E-mail" type="email" placeholder="voce@email.com" />
            <Field label="Assunto" type="text" placeholder="Como podemos ajudar?" />
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                Mensagem
              </label>
              <textarea
                rows={5}
                placeholder="Escreva sua mensagem..."
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-wine px-6 py-4 text-sm font-medium uppercase tracking-wider text-primary-foreground shadow-soft transition-all hover:shadow-relic"
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-gold">
        <Icon className="h-4 w-4 text-wine-deep" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
          {label}
        </p>
        <p className="mt-1 text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {label}
      </label>
      <input
        {...rest}
        className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
