import { appendFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const LOG_PATH = '/opt/cursor/logs/debug.log';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    appendFileSync(LOG_PATH, `${JSON.stringify(payload)}\n`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
