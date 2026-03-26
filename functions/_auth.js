// functions/_auth.js — Auth helper central (byNuno Hub)
// O cookie session_id usa Domain=.bynuno.com para ser partilhado com todos os subdomínios

function getSessionId(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const [key, value] = part.trim().split('=');
    if (key === 'session_id') return value;
  }
  return null;
}

export function generateId() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function getAuthUser(request, env) {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;
  const now = new Date().toISOString();
  const row = await env.DB.prepare(
    `SELECT s.user_id, u.email, u.name, u.avatar_url, u.bio
     FROM sessions s JOIN users u ON s.user_id = u.id
     WHERE s.id = ? AND s.expires_at > ?`
  ).bind(sessionId, now).first();
  if (!row) return null;
  return { id: row.user_id, email: row.email, name: row.name, avatar_url: row.avatar_url, bio: row.bio };
}

export function sessionCookie(sessionId, appUrl, maxAge = 60 * 60 * 24 * 30) {
  const isProduction = appUrl && appUrl.includes('bynuno.com');
  const domain = isProduction ? '; Domain=.bynuno.com' : '';
  return `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Path=/${domain}`;
}

export function clearSessionCookie(appUrl) {
  const isProduction = appUrl && appUrl.includes('bynuno.com');
  const domain = isProduction ? '; Domain=.bynuno.com' : '';
  return `session_id=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/${domain}`;
}

export function unauthorized(msg = 'Não autenticado') {
  return Response.json({ error: msg }, { status: 401 });
}

export function json(data, status = 200) {
  return Response.json(data, { status });
}
