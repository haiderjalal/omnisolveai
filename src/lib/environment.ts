/**
 * True only on the real production deployment. Previews (including the private link used to
 * pitch the site) and local builds must stay out of search indexes.
 */
export function isIndexable(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}
