import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/public/mercado-pago/webhook")({
  server: { handlers: {
    POST: async ({ request }) => {
      const secret = process.env['MERCADO_PAGO_WEBHOOK_SECRET'];
      if (!secret) return new Response("Webhook configuration pending", { status: 503 });
      const { verifyWebhookSignature, mercadoPago, reconcilePayment } = await import("@/lib/mercado-pago.server");
      if (!verifyWebhookSignature(request, secret)) return new Response("Invalid signature", { status: 401 });
      try {
        const body = z.object({ type: z.string().max(60), data: z.object({ id: z.union([z.string().min(1).max(80), z.number()]) }) }).parse(await request.json());
        if (body.type !== "payment") return new Response("ok");
        const id = new URL(request.url).searchParams.get("data.id");
        if (!id || id !== String(body.data.id) || !/^\d+$/.test(id)) return new Response("Invalid payment", { status: 400 });
        await reconcilePayment(await mercadoPago(`/v1/payments/${encodeURIComponent(id)}`));
        return new Response("ok");
      } catch (error) {
        return new Response(error instanceof z.ZodError ? "Invalid payload" : "Payment verification failed", { status: error instanceof z.ZodError ? 400 : 502 });
      }
    },
  } },
});