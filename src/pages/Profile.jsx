import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Profile() {
  const { user, loading, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name,    setName]    = useState('');
  const [bio,     setBio]     = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  // Inicializar form quando user carrega
  const [initialized, setInitialized] = useState(false);
  if (!loading && user && !initialized) {
    setName(user.name  || '');
    setBio(user.bio    || '');
    setInitialized(true);
  }

  if (loading) return null;
  if (!user) { navigate('/login', { replace: true }); return null; }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const r = await fetch('/api/auth/profile', {
        method:      'PUT',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ name, bio }),
      });
      if (!r.ok) {
        const d = await r.json();
        setError(d.error || 'Erro ao guardar');
        return;
      }
      const updated = await r.json();
      updateUser({ ...user, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Erro de rede. Tenta de novo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-xl mx-auto w-full px-5 py-16 animate-fade-in">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-10 transition-colors no-underline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Voltar ao hub
        </Link>

        {/* Avatar + email */}
        <div className="flex items-center gap-4 mb-10">
          {user.avatar_url
            ? <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10" />
            : <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-300">
                {(user.name || user.email || '?')[0].toUpperCase()}
              </div>
          }
          <div>
            <p className="text-white font-semibold text-lg">{user.name}</p>
            <p className="text-white/40 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <h2 className="text-white font-semibold text-base mb-1">Editar perfil</h2>

          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="O teu nome"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
              placeholder="Uma frase sobre ti (opcional)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">Email</label>
            <div className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white/30 text-sm">
              {user.email}
            </div>
            <p className="mt-1.5 text-xs text-white/20">O email é gerido pela tua conta Google.</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
            {saved && <span className="text-emerald-400 text-sm">Guardado!</span>}
          </div>
        </form>

        {/* Logout */}
        <div className="mt-14 pt-8 border-t border-white/5">
          <button
            onClick={logout}
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Terminar sessão
          </button>
        </div>

      </div>
    </div>
  );
}
