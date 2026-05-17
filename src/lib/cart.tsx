import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  nome: string;
  preco_centavos: number;
  imagem_url: string;
  tamanho?: string;
  variante?: string;
  quantidade: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, tamanho?: string, variante?: string) => void;
  updateQty: (slug: string, quantidade: number, tamanho?: string, variante?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cidadelas_cart_v1";

const sameKey = (a: CartItem, slug: string, tamanho?: string, variante?: string) =>
  a.slug === slug && (a.tamanho ?? "") === (tamanho ?? "") && (a.variante ?? "") === (variante ?? "");

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => sameKey(p, item.slug, item.tamanho, item.variante));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantidade: copy[idx].quantidade + item.quantidade };
        return copy;
      }
      return [...prev, item];
    });
  };

  const remove: CartCtx["remove"] = (slug, tamanho, variante) =>
    setItems((prev) => prev.filter((p) => !sameKey(p, slug, tamanho, variante)));

  const updateQty: CartCtx["updateQty"] = (slug, quantidade, tamanho, variante) =>
    setItems((prev) =>
      prev.map((p) =>
        sameKey(p, slug, tamanho, variante) ? { ...p, quantidade: Math.max(1, quantidade) } : p,
      ),
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantidade, 0);
  const subtotal = items.reduce((s, i) => s + i.preco_centavos * i.quantidade, 0);

  return <Ctx.Provider value={{ items, add, remove, updateQty, clear, count, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
