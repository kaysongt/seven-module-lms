/**
 * The site's own absolute base URL.
 *
 * Read through here rather than touching process.env.APP_URL directly. An unset
 * variable and one set to an empty string are both common in hosting dashboards,
 * and `??` only catches the first — an empty APP_URL used to reach `new URL("")`
 * and take the whole build down.
 *
 * Order matters: an explicit APP_URL wins, then the URL the platform assigns the
 * running deployment, and localhost only as a last resort. Without the platform
 * step, a blank APP_URL in production would quietly mint activation links
 * pointing at localhost — which build and deploy perfectly happily, and only
 * fail once someone clicks one.
 */
export function getAppUrl(): string {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  // Set automatically on Vercel deployments; carries no protocol.
  const platform = process.env.VERCEL_URL?.trim();
  if (platform) return `https://${platform.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
