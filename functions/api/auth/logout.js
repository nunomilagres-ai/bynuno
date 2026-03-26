import { clearSessionCookie } from '../../_auth.js';

function getSessionId(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const [key, value] = part.trim().split('=');
    if (key === 'session_id') return value;
  }
  return null;
}

export async function onRequestPost({ request, env }) {
  const appUrl    = env.APP_URL || new URL(request.url).origin;
  const sessionId = getSessionId(request);
  if (sessionId) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }
  return new Response(null, {
    status:  302,
    headers: { Location: '/login', 'Set-Cookie': clearSessionCookie(appUrl) },
  });
}
