/**
 * Main Dibedex product photo.
 *
 * The original photo lives only on Lovable's file storage (/__l5e/...), which
 * does not exist when the site runs on Vercel or any other host. To make the
 * photo work everywhere, save it as src/assets/dibedex-real.webp (or .jpg/.png)
 * — it is picked up automatically. Until then the Arogga listing photo is used.
 */
const LOCAL = import.meta.glob("../assets/dibedex-real.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const AROGGA_DIBEDEX =
  "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC80ODY1OFwvNDg2NTgtRGliZWRleC01MDAtMC1jb3B5LXNyNWY3Ny5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoxMDAwLCJoZWlnaHQiOjEwMDAsImZpdCI6Im91dHNpZGUifSwib3ZlcmxheVdpdGgiOnsiYnVja2V0IjoiYXJvZ2dhIiwia2V5IjoibWlzY1wvd20ucG5nIiwiYWxwaGEiOjkwfX19";

/** URL to use in <img src>. */
export const DIBEDEX_IMG: string = Object.values(LOCAL)[0] ?? AROGGA_DIBEDEX;

/** Absolute URL for og:image, schema and feeds. */
export const DIBEDEX_IMG_ABS = DIBEDEX_IMG.startsWith("/")
  ? `https://dibedex.com${DIBEDEX_IMG}`
  : DIBEDEX_IMG;
