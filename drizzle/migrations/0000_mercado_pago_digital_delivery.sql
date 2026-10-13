ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_preference_id text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_id_unique ON public.orders(payment_id) WHERE payment_id IS NOT NULL;
REVOKE INSERT ON public.orders, public.order_items FROM anon, authenticated;
GRANT SELECT ON public.orders, public.order_items TO authenticated;
GRANT ALL ON public.orders, public.order_items TO service_role;
CREATE POLICY ebooks_paid_owner_read ON storage.objects FOR SELECT TO authenticated USING (
 bucket_id = 'ebooks' AND EXISTS (
 SELECT 1 FROM public.orders o JOIN public.order_items i ON i.order_id = o.id JOIN public.products p ON p.id = i.product_id
 WHERE o.user_id = auth.uid() AND o.status = 'paid' AND o.payment_provider = 'mercado_pago' AND o.payment_id IS NOT NULL
 AND storage.objects.name IN (p.slug || '.pdf', p.slug || '.epub')
 ));