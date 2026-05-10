const COLORS = {
  violet:  { from: 'from-violet-600',  to: 'to-fuchsia-600',  shadow: 'shadow-violet-500/30'  },
  emerald: { from: 'from-emerald-600', to: 'to-teal-500',     shadow: 'shadow-emerald-500/30' },
  blue:    { from: 'from-blue-600',    to: 'to-cyan-500',     shadow: 'shadow-blue-500/30'    },
  amber:   { from: 'from-amber-500',   to: 'to-yellow-500',   shadow: 'shadow-amber-500/30'   },
  red:     { from: 'from-red-600',     to: 'to-rose-500',     shadow: 'shadow-red-500/30'     },
  cyan:    { from: 'from-cyan-500',    to: 'to-sky-500',      shadow: 'shadow-cyan-500/30'    },
}

export default function StatCard({ icon, label, value, sub, color = 'violet', delay = 0 }) {
  const c = COLORS[color] ?? COLORS.violet
  return (
    <div
      className="glass rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center text-xl shadow-lg ${c.shadow}`}>
          {icon}
        </div>
      </div>
      <p className="gradient-text text-3xl font-bold leading-none">{value ?? '—'}</p>
      <p className="text-white/50 text-sm font-medium mt-2">{label}</p>
      {sub && <p className="text-white/20 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}
