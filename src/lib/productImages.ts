import { getCatalogImage } from "@/lib/catalog";

export function getProductImage(slug: string): string {
  return getCatalogImage(slug);
}
