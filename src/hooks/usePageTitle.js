import { useEffect } from "react";

/**
 * MED-06 / SEO-1 FIX: Dynamic page title hook.
 *
 * SPAs share one HTML <title> across all routes by default.
 * This hook updates document.title on every route change, giving
 * each page a unique title for:
 *   - SEO: Google indexes per-page titles
 *   - Accessibility: Screen readers announce page changes
 *   - UX: Browser tabs show the current page context
 *
 * @param {string} title - The page-specific title
 * @param {string} [suffix="PathShashtra"] - Optional suffix appended after " — "
 */
export default function usePageTitle(title, suffix = "PathShashtra") {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — ${suffix}` : suffix;
    return () => { document.title = prev; };
  }, [title, suffix]);
}
