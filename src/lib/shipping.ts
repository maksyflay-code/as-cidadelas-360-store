// Tabela de frete fixa por região
// Nordeste R$20, Norte R$30, Sul+Sudeste R$35, Centro-Oeste R$35

const REGIOES: Record<string, number> = {
  // Nordeste — R$ 20
  AL: 2000, BA: 2000, CE: 2000, MA: 2000, PB: 2000,
  PE: 2000, PI: 2000, RN: 2000, SE: 2000,
  // Norte — R$ 30
  AC: 3000, AP: 3000, AM: 3000, PA: 3000, RO: 3000, RR: 3000, TO: 3000,
  // Sul — R$ 35
  PR: 3500, RS: 3500, SC: 3500,
  // Sudeste — R$ 35
  ES: 3500, MG: 3500, RJ: 3500, SP: 3500,
  // Centro-Oeste — R$ 35
  DF: 3500, GO: 3500, MT: 3500, MS: 3500,
};

export function getFreteCentavos(uf: string): number {
  return REGIOES[uf.toUpperCase()] ?? 4500;
}

export function getRegiaoLabel(uf: string): string {
  const u = uf.toUpperCase();
  if (["AL","BA","CE","MA","PB","PE","PI","RN","SE"].includes(u)) return "Nordeste";
  if (["AC","AP","AM","PA","RO","RR","TO"].includes(u)) return "Norte";
  if (["PR","RS","SC"].includes(u)) return "Sul";
  if (["ES","MG","RJ","SP"].includes(u)) return "Sudeste";
  if (["DF","GO","MT","MS"].includes(u)) return "Centro-Oeste";
  return "Outras regiões";
}

export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
