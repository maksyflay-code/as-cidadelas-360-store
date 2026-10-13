# Project Rules

- Keep the public catalog defined in `src/lib/catalog.ts` so home, store, and image lookup stay synchronized.
- Validate catalog prices and downloadable file availability server-side before creating Mercado Pago preferences; never charge for a missing file.
- Create orders only through authenticated server functions with privileged insertion after validation; client order insertion must remain revoked to prevent forged paid orders.
- Store ebooks privately at ebooks/<product-slug>.pdf or .epub and authorize downloads by owner, purchased product and verified Mercado Pago payment before signing links.
- Verify Mercado Pago webhook signatures and retrieve provider payment data to match order reference, BRL currency and exact total before granting access.