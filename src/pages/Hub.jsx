// ─── bynuno Hub ───────────────────────────────────────────────────────────────

const APPS = [
  {
    id: 'mently',
    name: 'Mently',
    tagline: 'Saúde & bem-estar',
    description: 'Análises laboratoriais, nutrição, sono, exercício e peso. O teu painel de saúde pessoal.',
    url: 'https://mently.bynuno.com',
    emoji: '🩺',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
    badge: 'Disponível',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'cashly',
    name: 'Cashly',
    tagline: 'Finanças pessoais',
    description: 'Controlo de despesas, receitas e orçamentos. Uma visão clara do teu dinheiro.',
    url: 'https://cashly.bynuno.com',
    emoji: '💰',
    gradient: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/10',
    badge: 'Disponível',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'pim',
    name: 'UnifiedPIM',
    tagline: 'Gestão de produtos',
    description: 'Catálogo de produtos, vendas, análise de margens e integração com o Vinted.',
    url: 'https://pim.bynuno.com',
    emoji: '📦',
    gradient: 'from-violet-500/20 to-purple-600/20',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/10',
    badge: 'Disponível',
    badgeColor: 'bg-violet-500/20 text-violet-400',
  },
  {
    id: 'future',
    name: 'Em breve',
    tagline: 'Próxima app',
    description: 'Novas ferramentas pessoais a caminho. Feitas com cuidado, para uso diário.',
    url: null,
    emoji: '✦',
    gradient: 'from-slate-700/20 to-slate-600/20',
    border: 'border-slate-600/30',
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
        group relative rounded-2xl border ${app.border} bg-gradient-to-br ${app.gradient}
        p-6 transition-all duration-300
        ${app.url ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl ' + app.glow : 'opacity-60 cursor-default'}
        animate-slide-up
      `}
      style={style}
    >
      {/* Badge */}
      <span className={`absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full ${app.badgeColor}`}>
        {app.badge}
      </span>

      {/* Icon */}
      <div className="text-4xl mb-4 select-none">{app.emoji}</div>

      {/* Text */}
      <div className="mb-1 flex items-baseline gap-2">
        <h2 className="text-lg font-semibold text-white">{app.name}</h2>
      </div>
      <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">{app.tagline}</p>
      <p className="text-sm text-white/60 leading-relaxed">{app.description}</p>

      {/* Arrow */}
      {app.url && (
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-white/50 group-hover:text-white/90 transition-colors">
          <span>Abrir</span>
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  )

  if (app.url) {
    return <a href={app.url} className="block no-underline">{content}</a>
  }
  return <div>{content}</div>
}

export default function Hub() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex-1 max-w-xl mx-auto w-full px-5 py-16 flex flex-col">

        {/* Header */}
        <header className="mb-14 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">bynuno.com</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
            Ferramentas<br />
            <span className="text-white/40">feitas por mim,</span><br />
            <span className="text-white/40">para mim.</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed mt-4">
            Um conjunto de aplicações pessoais para gerir saúde,
            finanças e hábitos do dia-a-dia.
          </p>
        </header>

        {/* App grid */}
        <div className="flex flex-col gap-4 flex-1">
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <p className="text-white/20 text-xs">
            feito com ♥ por nuno
          </p>
        </footer>

      </div>
    </div>
  )
}
