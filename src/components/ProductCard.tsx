import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

type Props = {
  image: string;
  name: string;
  category: string;
  price: string;
  badge?: string;
  slug?: string;
};

export function ProductCard({ image, name, category, price, badge, slug }: Props) {
  const Wrapper: any = slug ? Link : "div";
  const wrapperProps = slug ? { to: "/produto/$slug", params: { slug } } : {};

  return (
    <Wrapper {...wrapperProps} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-gold hover:shadow-relic">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={image} alt={name} loading="lazy" width={1024} height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-gradient-wine px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{category}</p>
        <h3 className="text-display text-2xl font-medium leading-tight text-foreground">{name}</h3>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-display text-xl font-semibold text-primary">{price}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            Comprar <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
