import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51TFAg5LaMMiVnZ7jk7dTIuRfzekIDbAiHnni01TLzZEgXFzdzSJvz2ZNkvL6R8BLz5IucvV9vK5RJ8AybW1TmZow00IYjwE0sU');

const PRESETS = [2, 5, 10];

// O Stripe Elements não lê CSS custom properties — os valores têm de ser lidos
// do DOM em runtime para seguir o tema activo (escuro/claro) em vez de fixos.
function stripeAppearance() {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    theme: 'night',
    variables: {
      colorBackground:      v('--surface'),
      colorSurface:         v('--surface-2'),
      colorText:            v('--text'),
      colorTextSecondary:   v('--text-2'),
      colorTextPlaceholder: v('--text-3'),
      colorPrimary:         v('--accent'),
      colorDanger:          v('--danger'),
      borderRadius:         '12px',
      fontSizeBase:         '14px',
    },
    rules: {
      '.Input': {
        border:    `1px solid ${v('--border')}`,
        boxShadow: 'none',
      },
      '.Input:focus': {
        border:    `1px solid ${v('--accent-line')}`,
        boxShadow: 'none',
      },
    },
  };
}

function PaymentForm({ amount, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error,  setError]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setPaying(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div className="px-4 py-3 rounded-xl bg-danger-soft border border-danger-line text-danger text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || paying}
        className="w-full py-3 rounded-xl bg-ink text-bg font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {paying ? 'A processar…' : `Pagar €${amount}`}
      </button>
    </form>
  );
}

export default function DonateModal({ open, onClose }) {
  const [preset,       setPreset]       = useState(5);
  const [custom,       setCustom]       = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  const finalAmount = custom ? parseFloat(custom) : preset;

  function handleClose() {
    setClientSecret('');
    setCustom('');
    setPreset(5);
    setError('');
    setSuccess(false);
    onClose();
  }

  async function handleContinue() {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/donate/create-intent', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: Math.round(finalAmount * 100) }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Erro ao iniciar pagamento'); return; }
      setClientSecret(d.clientSecret);
    } catch {
      setError('Erro de rede. Tenta de novo.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-surface border border-line rounded-2xl p-6 w-full max-w-sm animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-ink">Apoiar o projeto</h2>
            <p className="text-xs text-faint mt-0.5">bynuno.com</p>
          </div>
          <button
            onClick={handleClose}
            className="text-faint hover:text-muted w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-all text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">💜</div>
            <p className="text-ink font-semibold">Obrigado!</p>
            <p className="text-muted text-sm mt-2">O teu apoio significa muito.</p>
            <button
              onClick={handleClose}
              className="mt-6 px-5 py-2.5 rounded-xl bg-surface-2 text-ink text-sm hover:bg-surface transition-all"
            >
              Fechar
            </button>
          </div>

        /* Step 1: amount selection */
        ) : !clientSecret ? (
          <>
            <p className="text-muted text-sm mb-5 leading-relaxed">
              Escolhe um valor para apoiar o desenvolvimento das apps.
            </p>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESETS.map(v => (
                <button
                  key={v}
                  onClick={() => { setPreset(v); setCustom(''); }}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    !custom && preset === v
                      ? 'bg-accent-soft border-accent-line text-accent-ink'
                      : 'bg-surface-2 border-line text-muted hover:bg-surface'
                  }`}
                >
                  €{v}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint text-sm">€</span>
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="Outro valor"
                className="w-full bg-surface-2 border border-line rounded-xl pl-8 pr-4 py-3 text-ink text-sm placeholder-faint focus:outline-none focus:border-accent-line transition-colors"
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-danger-soft border border-danger-line text-danger text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={loading || !finalAmount || finalAmount < 1 || finalAmount > 100}
              className="w-full py-3 rounded-xl bg-ink text-bg font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'A preparar…' : `Continuar com €${finalAmount}`}
            </button>
          </>

        /* Step 2: payment */
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => setClientSecret('')}
                className="text-faint hover:text-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <span className="text-muted text-sm">Pagamento de €{finalAmount}</span>
            </div>

            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: stripeAppearance() }}
            >
              <PaymentForm amount={finalAmount} onSuccess={() => setSuccess(true)} />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
}
