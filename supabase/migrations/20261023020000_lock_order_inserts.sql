-- =====================================================================
-- STEP 2 of 2 — run AFTER the new code is published and a test order works.
-- =====================================================================
-- 5) Orders are now created only by the server (price recalculated there).
--    Browsers can no longer insert orders with their own price.
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
REVOKE INSERT ON public.orders FROM anon, authenticated;
