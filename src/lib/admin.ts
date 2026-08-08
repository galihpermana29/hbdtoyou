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
  return email === ADMIN_EMAIL;
}
