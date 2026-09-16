import { appendFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

const LOG_PATH = '/opt/cursor/logs/debug.log';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = {
      ...body,
      timestamp: body.timestamp ?? Date.now(),
    };
    await mkdir('/opt/cursor/logs', { recursive: true });
    await appendFile(LOG_PATH, `${JSON.stringify(entry)}\n`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
