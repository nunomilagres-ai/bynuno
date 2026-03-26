// Callback OAuth — cria sessão e redireciona para a app (ou next URL)
import { generateId, sessionCookie } from '../../_auth.js';

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const [key, value] = part.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

export async function onRequestGet({ request, env }) {
  const url    = new URL(request.url);
  const code   = url.searchParams.get('code');
  const state  = url.searchParams.get('state');
  const error  = url.searchParams.get('error');
  const appUrl = env.APP_URL || url.origin;

  if (error) return Response.redirect(`${appUrl}/login?error=acesso_negado`, 302);

  // Validar CSRF state
  if (!state || state !== getCookie(request, 'oauth_state'))
    return Response.redirect(`${appUrl}/login?error=estado_invalido`, 302);
  if (!code)
    return Response.redirect(`${appUrl}/login?error=sem_codigo`, 302);

  // Destino após login (sub-app ou hub)
  const nextEncoded = getCookie(request, 'oauth_next');
  const nextUrl     = nextEncoded ? decodeURIComponent(nextEncoded) : appUrl;

  // Trocar code por token
  let tokenData;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        code,
        client_id:     env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  `${appUrl}/api/auth/callback`,
        grant_type:    'authorization_code',
      }),
    });
    tokenData = await r.json();
  } catch { return Response.redirect(`${appUrl}/login?error=token_falhou`, 302); }

  if (tokenData.error) return Response.redirect(`${appUrl}/login?error=token_invalido`, 302);

  // Obter info do utilizador Google
  let userInfo;
  try {
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    userInfo = await r.json();
  } catch { return Response.redirect(`${appUrl}/login?error=userinfo_falhou`, 302); }

  if (!userInfo.sub || !userInfo.email)
    return Response.redirect(`${appUrl}/login?error=userinfo_invalido`, 302);

  // Verificar e-mail permitido
  if (env.ALLOWED_EMAIL && userInfo.email !== env.ALLOWED_EMAIL)
    return Response.redirect(`${appUrl}/login?error=acesso_negado`, 302);

  const now = new Date().toISOString();

  // Criar ou actualizar utilizador
  let user = await env.DB.prepare('SELECT * FROM users WHERE google_id = ?')
    .bind(userInfo.sub).first();

  if (!user) {
    const userId = generateId();
    await env.DB.prepare(
      'INSERT INTO users (id, email, name, google_id, avatar_url, created_date, updated_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, userInfo.email, userInfo.name, userInfo.sub, userInfo.picture || null, now, now).run();
    user = { id: userId };
  } else {
    await env.DB.prepare('UPDATE users SET name=?, avatar_url=?, updated_date=? WHERE id=?')
      .bind(userInfo.name, userInfo.picture || null, now, user.id).run();
  }

  // Criar sessão 30 dias
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at, created_date) VALUES (?, ?, ?, ?)')
    .bind(sessionId, user.id, expiresAt, now).run();

  const headers = new Headers({ Location: nextUrl });
  headers.append('Set-Cookie', sessionCookie(sessionId, appUrl));
  // Limpar cookies temporários de OAuth
  headers.append('Set-Cookie', 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
  headers.append('Set-Cookie', 'oauth_next=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');

  return new Response(null, { status: 302, headers });
}
