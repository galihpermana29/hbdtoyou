/**
 * Where the Create Flow lives.
 *
 * One constant because two files have to agree on it or a sign-in silently
 * lands on the home page: the wedding landing asks for this as the callback of
 * the sign-in its own control starts, and the NextAuth redirect callback only
 * follows a callback that names it - see `src/app/api/auth/[...nextauth]`.
 * Spelled apart from the route's own directory, which cannot export it: a
 * module named `route.ts` under `src/app` would become a route handler.
 */
export const CREATE_FLOW_ROUTE = '/create/wedding-invitation';
