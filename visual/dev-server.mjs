import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

/**
 * The port the harness runs the app on.
 *
 * Deliberately not 3000. A harness that silently attaches to whatever happens to
 * be serving the usual port can compare against the wrong application, and the
 * result looks like a real difference.
 */
export const HARNESS_PORT = 3210;
export const HARNESS_BASE_URL = `http://127.0.0.1:${HARNESS_PORT}`;

const START_TIMEOUT_MS = 180000;

async function isServing(baseUrl) {
  try {
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(2000),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

/**
 * Make sure something is serving the app at `baseUrl`, and return how to stop it.
 *
 * An already-running server is reused, so a developer iterating on a screen does
 * not pay the dev server's start-up on every run. Otherwise one is started here,
 * which is what makes this a single command rather than a command plus a terminal
 * someone had to remember to open.
 */
export async function ensureAppServed(baseUrl) {
  if (await isServing(baseUrl)) {
    return { startedHere: false, async stop() {} };
  }

  const port = new URL(baseUrl).port || '3000';
  const server = spawn('npm', ['run', 'dev', '--', '--port', port], {
    // The maintenance flag short-circuits this very route, and a harness that
    // captured the maintenance screen would report a difference nobody could
    // explain.
    env: { ...process.env, IS_MAINTENANCE: 'false' },
    stdio: 'ignore',
    detached: true,
  });

  const stop = async () => {
    if (server.exitCode === null && server.pid) {
      try {
        process.kill(-server.pid, 'SIGTERM');
      } catch {
        // Already gone.
      }
    }
  };

  let exitCode = null;
  server.once('exit', (code) => {
    exitCode = code;
  });

  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isServing(baseUrl)) {
      return { startedHere: true, stop };
    }
    if (exitCode !== null) {
      // Waiting out the full timeout for a server that has already died wastes
      // three minutes and reports the wrong cause.
      throw new Error(
        `dev server exited with code ${exitCode} before answering on ${baseUrl}`
      );
    }
    await delay(500);
  }

  await stop();
  throw new Error(
    `dev server did not answer on ${baseUrl} within ${START_TIMEOUT_MS}ms`
  );
}
