import { describe, expect, test } from "bun:test";
import { canDownload, paymentMatchesOrder, PurchaseSchema } from "./payment-rules";
const order = { id: "c93cef6c-d87a-4c88-b0f8-8b8dde4992d1", total_centavos: 3500 };
const payment = { id: 123, external_reference: order.id, transaction_amount: 35, currency_id: "BRL", status: "approved" };
describe("entrega digital", () => {
  test("valida preço do e-book principal em reais", () => {
    expect(paymentMatchesOrder(payment, order)).toBe(true);
    expect(paymentMatchesOrder({ ...payment, transaction_amount: 27 }, order)).toBe(false);
  });
  test("valida preço do plano de negócios em reais", () => {
    expect(paymentMatchesOrder({ ...payment, transaction_amount: 27 }, { ...order, total_centavos: 2700 })).toBe(true);
    expect(paymentMatchesOrder(payment, { ...order, total_centavos: 2700 })).toBe(false);
  });
  test("exige moeda BRL e referência do pedido", () => {
    expect(paymentMatchesOrder({ ...payment, currency_id: "USD" }, order)).toBe(false);
    expect(paymentMatchesOrder({ ...payment, external_reference: "outro-pedido" }, order)).toBe(false);
  });
  test("libera arquivo somente com pagamento confirmado", () => {
    expect(canDownload({ status: "pending", payment_provider: "mercado_pago", payment_id: "123" })).toBe(false);
    expect(canDownload({ status: "paid", payment_provider: "mercado_pago", payment_id: "123" })).toBe(true);
    expect(canDownload({ status: "paid", payment_provider: null, payment_id: null })).toBe(false);
  });
  test("recusa quantidades inválidas", () => {
    expect(PurchaseSchema.safeParse({ items: [{ slug: "ebook-cidadelas-portugues", quantidade: 0 }] }).success).toBe(false);
    expect(PurchaseSchema.safeParse({ items: [{ slug: "ebook-cidadelas-portugues", quantidade: 51 }] }).success).toBe(false);
  });
});