/**
 * Wedding invitations are built but not announced yet, so nothing points at
 * them: not the site's navbar, and not the dashboard's Wedding tab for
 * anybody but the administrator (owner, 2026-11-17: "they can't use wedding
 * yet"). `/wedding-invitation` and `/dashboard/wedding` themselves stay
 * reachable on purpose: the visual check drives that flow, and anyone
 * already holding a link keeps it.
 *
 * Flip this to `true` on launch day and every entry comes back.
 */
export const WEDDING_RELEASED = false;
