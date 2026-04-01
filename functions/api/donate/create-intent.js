// functions/api/donate/create-intent.js
export async function onRequestPost({ request, env }) {
  let amount;
  try {
    ({ amount } = await request.json());
  } catch {
    return Response.json({ error: 'Pedido inválido' }, { status: 400 });
  }

  if (!Number.isInteger(amount) || amount < 100 || amount > 10000) {
    return Response.json({ error: 'Valor inválido (mín. €1, máx. €100)' }, { status: 400 });
  }

  const body = new URLSearchParams({
    amount:                              String(amount),
    currency:                            'eur',
    'automatic_payment_methods[enabled]': 'true',
  });

  const r = await fetch('https://api.stripe.com/v1/payment_intents', {
    method:  'POST',
    headers: {
      'Authorization':  `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type':   'application/x-www-form-urlencoded',
    },
    body,
  });

  const intent = await r.json();
  if (!r.ok) {
    return Response.json({ error: intent.error?.message || 'Erro Stripe' }, { status: 502 });
  }

  return Response.json({ clientSecret: intent.client_secret });
}
