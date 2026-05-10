import { STAT_CARD_COLORS } from '../../constants'

export default function StatCard({ icon, label, value, sub, color = 'violet', delay = 0 }) {
  const c = STAT_CARD_COLORS[color] ?? STAT_CARD_COLORS.violet
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
