import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const ERROR_MESSAGES = {
  acesso_negado:   'Acesso negado. Esta aplicação é de uso privado.',
  estado_invalido: 'Erro de segurança. Tenta de novo.',
  token_falhou:    'Falha ao comunicar com o Google. Tenta de novo.',
  token_invalido:  'Token inválido. Tenta de novo.',
  userinfo_falhou: 'Não foi possível obter o teu perfil Google.',
  userinfo_invalido: 'Perfil Google inválido. Tenta de novo.',
};

export default function Login() {
  const { user, loading } = useAuth();
  const navigate          = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const error  = params.get('error');

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">bynuno.com</span>
          <h1 className="text-3xl font-bold text-white mt-3 mb-2">Bem-vindo</h1>
          <p className="text-white/40 text-sm">Entra com a tua conta Google para continuar.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {ERROR_MESSAGES[error] || 'Ocorreu um erro. Tenta de novo.'}
          </div>
        )}

        {/* Login button */}
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl
            bg-white/5 border border-white/10 text-white font-medium text-sm
            hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </a>

        <p className="mt-8 text-center text-white/20 text-xs">
          Acesso restrito ao proprietário
        </p>
      </div>
    </div>
  );
}
