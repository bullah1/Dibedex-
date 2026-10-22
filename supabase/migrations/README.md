# Database steps

Both sites (live dibedex.com on Lovable and the new Vercel deploy) share ONE database.

1. `20261023010000_secure_admin_orders_catalog.sql` — safe any time; only adds tables/columns.
2. `20261023020000_lock_order_inserts.sql` — run ONLY after dibedex.com itself runs the new code.
   Running it earlier breaks checkout on the old live site.
3. After the switch, also run:
   `UPDATE public.admin_config SET admin_password = encode(gen_random_bytes(24), 'hex') WHERE id = 1;`
   (removes the plain-text copy of the admin password; the new code only uses password_hash).
