
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
CREATE POLICY "Anyone can place an order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) > 1
    AND length(phone) >= 6
    AND length(district) > 1
    AND length(address) > 3
    AND quantity > 0
    AND total_amount > 0
  );
