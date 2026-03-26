// PUT /api/auth/profile — atualiza nome e bio do utilizador autenticado
import { getAuthUser, unauthorized } from '../../_auth.js';

export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'JSON inválido' }, { status: 400 }); }

  const name = typeof body.name === 'string' ? body.name.trim() : null;
  const bio  = typeof body.bio  === 'string' ? body.bio.trim()  : null;

  if (!name) return Response.json({ error: 'Nome obrigatório' }, { status: 400 });

  const now = new Date().toISOString();
  await env.DB.prepare('UPDATE users SET name=?, bio=?, updated_date=? WHERE id=?')
    .bind(name, bio || null, now, user.id).run();

  return Response.json({ id: user.id, email: user.email, name, bio, avatar_url: user.avatar_url });
}
