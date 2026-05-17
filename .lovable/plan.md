## Visão geral

Construir o fluxo completo de compra: cliente clica no produto → escolhe tamanho/cor/quantidade → faz cadastro/login → informa CEP e endereço → vê frete calculado → finaliza pagamento via cartão, PIX ou boleto (Stripe).

Como é um escopo grande, vou entregar em 3 fases sequenciais. Cada fase é entregue funcionando antes de avançar para a próxima.

---

## Fase 1 — Backend, cadastro e página de produto

1. **Ativar Lovable Cloud** (banco + auth integrados).
2. **Schema do banco**:
   - `profiles` (id, nome, telefone, email) — criada automaticamente no signup via trigger.
   - `addresses` (user_id, cep, logradouro, número, complemento, bairro, cidade, uf, é_principal).
   - `products` (id, slug, nome, descrição, preço, categoria, imagem, tamanhos[], cores/continentes[]).
   - `orders` (id, user_id, status, subtotal, frete, total, endereço_snapshot, criado_em).
   - `order_items` (order_id, product_id, nome_snapshot, tamanho, cor, quantidade, preço_unit).
3. **Seed** dos 12 produtos do catálogo atual (camisas, boné, chaveiro, moletom, caneca, livros).
4. **Autenticação**: páginas `/login` e `/cadastro` com email/senha + Google. RLS em todas as tabelas. Header mostra nome do usuário quando logado.
5. **Página de produto** `/produto/$slug`: galeria, descrição, seletor de tamanho (P/M/G/GG), seletor de cor/continente (quando aplicável), seletor de quantidade, botão "Adicionar ao carrinho". Carrinho persiste em localStorage para visitantes; ao logar, migra para o banco.

## Fase 2 — Carrinho, CEP, frete e checkout

1. **Carrinho** `/carrinho`: lista itens, ajuste de quantidade, remover, subtotal.
2. **CEP**: input com máscara, busca via API pública ViaCEP (gratuita, sem chave) para preencher logradouro/bairro/cidade/UF.
3. **Cálculo de frete** por UF agrupado por região (valores informados):
   - Nordeste (AL, BA, CE, MA, PB, PE, PI, RN, SE): R$ 20
   - Norte (AC, AP, AM, PA, RO, RR, TO): R$ 30
   - Sul (PR, RS, SC) + Sudeste (ES, MG, RJ, SP): R$ 35
   - Centro-Oeste (DF, GO, MT, MS): vou perguntar se aplica R$ 35 ou outro valor antes de implementar.
4. **Checkout** `/checkout`: revisão do pedido, seleção/criação de endereço, confirmação do frete, total final.

## Fase 3 — Pagamento Stripe + pedido finalizado

1. **Ativar Stripe payments** (built-in Lovable, sem conta própria).
2. Habilitar **cartão + PIX + boleto** no Checkout Session.
3. Criar pedido em status `pending`; redirecionar para Stripe Checkout; webhook atualiza para `paid`/`failed`.
4. Páginas `/pedido/sucesso` e `/pedido/$id` (acompanhamento).
5. Área "Minha conta" `/conta`: histórico de pedidos e endereços salvos.
6. **Email transacional** de confirmação do pedido (Lovable Email).

---

## Detalhes técnicos

- **Stack**: TanStack Start + Lovable Cloud (Supabase) + Stripe payments.
- **Server functions** (`createServerFn`) para todas as operações sensíveis: criar pedido, calcular frete, criar sessão Stripe.
- **RLS**: cada usuário só vê seus próprios `addresses` e `orders`; `products` é leitura pública.
- **Validação Zod** em todos os inputs (CEP, endereço, quantidades).
- **Estoque**: não vou modelar controle de estoque nesta fase (pode ser adicionado depois se necessário).

---

## Confirmações antes de começar

1. Valor do **Centro-Oeste** (você listou Nordeste, Norte, Sul+Sudeste mas não Centro-Oeste). Posso usar R$ 35 igual ao Sul/Sudeste?
2. Confirma que posso ativar **Lovable Cloud** e **Stripe payments** (ambos exigem aprovação sua via botão).
3. O cadastro pode usar **email/senha + Google** (padrão Lovable)?

Aprovando, começo pela Fase 1.