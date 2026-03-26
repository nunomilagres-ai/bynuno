// Inicia o fluxo OAuth com Google
import { generateId } from '../../_auth.js';

export async function onRequestGet({ request, env }) {
  const url    = new URL(request.url);
  const appUrl = env.APP_URL || url.origin;
  const next   = url.searchParams.get('next') || '';

  if (!env.GOOGLE_CLIENT_ID)
    return Response.json({ error: 'GOOGLE_CLIENT_ID não configurado' }, { status: 500 });

  const state  = generateId();
  const params = new URLSearchParams({
    client_id:     env.GOOGLE_CLIENT_ID,
    redirect_uri:  `${appUrl}/api/auth/callback`,
    response_type: 'code',
    scope:         'openid email profile',
    state,
    access_type:   'online',
    prompt:        'select_account',
  });

  const headers = new Headers({
    Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  });
  headers.append('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`);
  if (next) {
    headers.append('Set-Cookie', `oauth_next=${encodeURIComponent(next)}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`);
  }

  return new Response(null, { status: 302, headers });
}
