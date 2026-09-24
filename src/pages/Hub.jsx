// â”€â”€â”€ bynuno Hub â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import DonateModal from '../components/DonateModal';

const BYNUNO_NOTES = [
  {
    version: '1.7',
    date: '2026-09-24',
    title: 'Collections & Condo',
    items: [
      'Nova app collections.bynuno.com para gestao de colecoes pessoais',
      'Nova app condo.bynuno.com para gestao documental e financeira do condominio',
    ],
  },
  {
    version: '1.6',
    date: '2026-06-16',
    title: 'Notes â€” calendario, recorrencia e dashboard',
    items: [
      'Calendario mensal com pontos por dia (notas e lembretes)',
      'Tarefas recorrentes: diaria, semanal, mensal e anual',
      'Dashboard de tarefas com seccoes Vencidas / Hoje / Futuras',
      'Criar tarefas diretamente dentro de cada nota (com recorrencia)',
      '60 emojis organizados por categoria',
      'Hora opcional nos lembretes; datas no passado permitidas',
      'Sidebar de temas colapsavel com dropdown de tema quando escondida',
    ],
  },
  {
    version: '1.5',
    date: '2026-06-15',
    title: 'Notes â€” notas pessoais com IA',
    items: [
      'Nova app notes.bynuno.com para notas pessoais organizadas por temas',
      'Temas personalizados com emoji e cor',
      'Editor Markdown com preview e auto-save',
      'Lembretes/tarefas com notificacoes nativas do browser',
      'IA: fotografa uma nota manuscrita e Claude Vision transcreve e classifica automaticamente',
    ],
  },
  {
    version: '1.4',
    date: '2026-03-28',
    title: 'CV Builder',
    items: [
      'Nova app cvbuilder.bynuno.com para organizar formacao academica e profissional',
      'Upload de diplomas e certificados (PDF, JPEG, PNG) direto para o Google Drive',
      'Extracao inteligente de dados com Claude AI',
      'Timeline visual cronologica com filtros por tipo de formacao',
      'Exportacao em PDF e partilha publica da timeline',
    ],
  },
  {
    version: '1.3',
    date: '2026-03-26',
    title: 'Mently â€” login e horoscopo',
    items: [
      'Corrigido loop de login no Mently',
      'Autenticacao do Mently delegada ao byNuno Hub',
      'Horoscopos gerados com Claude ficam agora guardados em D1 (cross-device)',
      'Cache por camadas: localStorage -> D1 -> Claude',
    ],
  },
  {
    version: '1.2',
    date: '2026-03-25',
    title: 'Lancamento do LEGO MOC',
    items: [
      'Nova app lego.bynuno.com para projetos LEGO de monumentos portugueses',
      'Upload de fotos de referencia e progresso de construcao',
      'Paleta de cores LEGO oficial',
      'Analise IA com sugestoes baseadas nas fotos reais',
    ],
  },
  {
    version: '1.1',
    date: '2026-03-24',
    title: 'Autenticacao centralizada + MediaVault',
    items: [
      'Login Google OAuth unificado para todas as aplicacoes',
      'Cookie de sessao partilhado em *.bynuno.com',
      'Perfil centralizado com nome e bio editaveis',
      'Lancamento do MediaVault',
    ],
  },
  {
    version: '1.0',
    date: '2025-01-01',
    title: 'Hub de aplicacoes',
    items: [
      'Pagina central para aceder a Mently, Cashly e PIM',
      'Cartoes de aplicacao com estado e descricao',
    ],
  },
];

function InfoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface border border-line rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-ink">Novidades</h2>
            <p className="text-xs text-faint mt-0.5">bynuno.com</p>
          </div>
          <button onClick={onClose}
            className="text-faint hover:text-muted w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-all text-lg leading-none">
            x
          </button>
        </div>
        <div className="space-y-7">
          {BYNUNO_NOTES.map(n => (
            <div key={n.version} className="relative pl-4 border-l border-line">
              <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-accent border border-accent-line" />
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-accent">v{n.version}</span>
                <span className="text-[11px] text-faint">{n.date}</span>
              </div>
              <p className="text-sm font-medium text-ink mb-2">{n.title}</p>
              <ul className="space-y-1">
                {n.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted flex gap-2">
                    <span className="text-accent flex-shrink-0 mt-0.5">.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const APPS = [
  {
    id: 'mently',
    name: 'Mently',
    tagline: 'Saude & bem-estar',
    description: 'Analises laboratoriais, nutricao, sono, exercicio e peso. O teu painel de saude pessoal.',
    url: 'https://mently.bynuno.com',
    emoji: 'ðŸ©º',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    glow: 'shadow-emerald-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'cashly',
    name: 'Cashly',
    tagline: 'Gestao financeira',
    description: 'Contas bancarias, facturas, orcamentos, fluxo de caixa e resultados. Controlo financeiro completo.',
    url: 'https://cashly.bynuno.com',
    emoji: 'ðŸ’°',
    gradient: 'from-amber-500/20 to-orange-600/20',
    glow: 'shadow-amber-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'pim',
    name: 'PIM',
    tagline: 'Gestao de produtos',
    description: 'Catalogo de produtos, vendas, analise de margens e integracao com o Vinted.',
    url: 'https://pim.bynuno.com',
    emoji: 'ðŸ“¦',
    gradient: 'from-violet-500/20 to-purple-600/20',
    glow: 'shadow-violet-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-violet-500/20 text-violet-400',
  },
  {
    id: 'mediavault',
    name: 'MediaVault',
    tagline: 'Colecao de filmes & series',
    description: 'Regista a tua colecao de DVDs e series gravadas. Acompanha episodios vistos, legendas e suporte fisico.',
    url: 'https://mediavault.bynuno.com',
    emoji: 'ðŸŽ¬',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    glow: 'shadow-blue-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'lego',
    name: 'LEGO MOC',
    tagline: 'Maquetes de monumentos',
    description: 'Regista projetos LEGO MOC de monumentos portugueses. Fotos de referencia, evolucao da construcao, paleta de cores e sugestoes com IA.',
    url: 'https://lego.bynuno.com',
    emoji: 'ðŸ§±',
    gradient: 'from-amber-500/20 to-yellow-600/20',
    glow: 'shadow-amber-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'cvbuilder',
    name: 'CV Builder',
    tagline: 'Formacao & timeline',
    description: 'Carrega diplomas e certificados. A IA extrai os dados automaticamente e organiza a tua formacao numa timeline visual.',
    url: 'https://cvbuilder.bynuno.com',
    emoji: 'ðŸ“‹',
    gradient: 'from-indigo-500/20 to-violet-600/20',
    glow: 'shadow-indigo-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    id: 'notes',
    name: 'Notes',
    tagline: 'Notas pessoais',
    description: 'Notas por temas, editor Markdown, lembretes com notificacoes e digitalizacao de notas manuscritas com IA.',
    url: 'https://notes.bynuno.com',
    emoji: 'ðŸ—’ï¸',
    gradient: 'from-amber-500/20 to-orange-600/20',
    glow: 'shadow-amber-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'agenda',
    name: 'Agenda',
    tagline: 'Calendario pessoal',
    description: 'Vista mensal ao estilo Outlook, localizacoes coloridas por cidade e eventos correntes.',
    url: 'https://agenda.bynuno.com',
    emoji: 'ðŸ—“ï¸',
    gradient: 'from-blue-500/20 to-cyan-600/20',
    glow: 'shadow-blue-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'collections',
    name: 'Collections',
    tagline: 'Colecoes pessoais',
    description: 'Organiza as tuas colecoes â€” livros, discos, jogos, ou qualquer outra coisa. Itens, notas e imagens num so lugar.',
    url: 'https://collections.bynuno.com',
    emoji: 'ðŸ—‚ï¸',
    gradient: 'from-rose-500/20 to-pink-600/20',
    glow: 'shadow-rose-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-rose-500/20 text-rose-400',
  },
  {
    id: 'condo',
    name: 'Condo',
    tagline: 'Gestao do condominio',
    description: 'Documentos, quotas, despesas e comunicacoes do condominio. Tudo organizado e acessivel.',
    url: 'https://condo.bynuno.com',
    emoji: 'ðŸ¢',
    gradient: 'from-slate-500/20 to-zinc-600/20',
    glow: 'shadow-slate-500/10',
    badge: 'Disponivel',
    badgeColor: 'bg-slate-500/20 text-slate-400',
  },
  {
    id: 'future',
    name: 'Em breve',
    tagline: 'Proxima app',
    description: 'Novas ferramentas pessoais a caminho. Feitas com cuidado, para uso diario.',
    url: null,
    emoji: 'âœ¦',
    gradient: 'from-slate-700/20 to-slate-600/20',
    glow: '',
    badge: 'Em breve',
    badgeColor: 'bg-slate-600/40 text-slate-400',
  },
]

function AppCard({ app, index }) {
  const style = { animationDelay: `${index * 100}ms`, animationFillMode: 'both' }
  const content = (
    <div
      className={`
        group relative rounded-2xl border border-line bg-surface
        p-6 h-full flex flex-col transition-all duration-300
        ${app.url ? 'cursor-pointer hover:border-accent-line hover:-translate-y-0.5 hover:shadow-xl ' + app.glow : 'opacity-60 cursor-default'}
        animate-slide-up
      `}
      style={style}
    >
      <span className={`absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full ${app.badgeColor}`}>
        {app.badge}
      </span>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 select-none bg-gradient-to-br ${app.gradient}`}>
        {app.emoji}
      </div>
      <div className="mb-1 flex items-baseline gap-2">
        <h2 className="text-lg font-semibold text-ink">{app.name}</h2>
      </div>
      <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3">{app.tagline}</p>
      <p className="text-sm text-muted leading-relaxed flex-1">{app.description}</p>
      {app.url && (
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-muted group-hover:text-ink transition-colors">
          <span>Abrir</span>
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  )
  if (app.url) return <a href={app.url} className="block no-underline">{content}</a>
  return <div>{content}</div>
}

function InfoButtonHub() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} title="Novidades"
        className="w-7 h-7 rounded-full border border-line text-faint hover:text-muted hover:border-accent-line text-xs font-bold transition-all flex items-center justify-center">
        i
      </button>
      <InfoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function UserAvatar() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Link to="/profile" className="flex items-center gap-2.5 group no-underline">
      {user.avatar_url
        ? <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-line group-hover:ring-accent-line transition-all" />
        : <div className="w-8 h-8 rounded-full bg-accent-soft border border-accent-line flex items-center justify-center text-sm font-bold text-accent-ink group-hover:border-accent transition-all">
            {(user.name || user.email || '?')[0].toUpperCase()}
          </div>
      }
      <span className="text-sm text-muted group-hover:text-ink transition-colors">{user.name}</span>
    </Link>
  );
}

export default function Hub() {
  const [donateOpen, setDonateOpen] = useState(false);
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-glow rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-glow-2 rounded-full blur-[120px]" />
      </div>
      <div className="relative flex-1 max-w-4xl mx-auto w-full px-5 py-10 flex flex-col">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-faint">bynuno.com</span>
            <div className="flex items-center gap-3">
              <InfoButtonHub />
              <UserAvatar />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-ink leading-tight tracking-tight mb-2">
            Ferramentas <span className="text-muted">feitas por mim, para mim.</span>
          </h1>
          <p className="text-muted text-base leading-relaxed">
            Um conjunto de aplicacoes pessoais para gerir saude, financas e habitos do dia-a-dia.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start items-stretch">
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
        <footer className="mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <button
            onClick={() => setDonateOpen(true)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-faint text-xs hover:text-muted hover:border-accent-line transition-all"
          >
            <span>ðŸ’œ</span> Apoiar o projeto
          </button>
          <p className="text-faint text-xs">feito com â™¥ por nuno</p>
        </footer>
      </div>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  )
}