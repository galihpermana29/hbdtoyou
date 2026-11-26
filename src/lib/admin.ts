/**
 * Who the product's administrator is.
 *
 * One hard-coded address, which is what it has always been. It is written here
 * rather than in each screen that asks because it was written out in nine of
 * them, and every screen deciding for itself who an administrator is means a
 * listing that shows everybody's work beside a navigation that does not offer
 * the tab, the first time one of the nine is edited and the other eight are
 * not.
 *
 * Replacing it with a role the backend states is `hbd-bcy`.
 */
const ADMIN_EMAIL = 'memoify.live@gmail.com';

/** Whether the signed-in person administers the product rather than using it. */
export function isAdminEmail(email: string | null | undefined): boolean {
  // The backend compares without regard to case (admin guide, 2026-11-26),
  // so this does too: the two must never disagree about the same address.
  return (email ?? '').trim().toLowerCase() === ADMIN_EMAIL;
}
