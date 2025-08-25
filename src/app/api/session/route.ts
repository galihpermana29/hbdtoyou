import { getSession } from '@/store/get-set-session';

// GET SESSION CLIENT
export async function GET() {
  const session = await getSession();
  return Response.json(session);
}
