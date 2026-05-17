import africa from "@/assets/produto-camisa-africa.jpg";
import americas from "@/assets/produto-camisa-americas.jpg";
import asia from "@/assets/produto-camisa-asia.jpg";
import europa from "@/assets/produto-camisa-europa.jpg";
import oceania from "@/assets/produto-camisa-oceania.jpg";
import bone from "@/assets/produto-bone.jpg";
import chaveiro from "@/assets/produto-chaveiro.jpg";
import moletom from "@/assets/produto-moletom.jpg";
import caneca from "@/assets/produto-caneca.jpg";
import livro from "@/assets/livro-capa.png";

const MAP: Record<string, string> = {
  "camisa-africa": africa,
  "camisa-americas": americas,
  "camisa-asia": asia,
  "camisa-europa": europa,
  "camisa-oceania": oceania,
  "bone-cruz-dourada": bone,
  "bone-cidadelas": bone,
  "chaveiro-reliquia": chaveiro,
  "moletom-cidadelas": moletom,
  "caneca-cidadelas": caneca,
  "livro-impresso": livro,
  "livro-digital": livro,
};

export function getProductImage(slug: string): string {
  return MAP[slug] ?? livro;
}
