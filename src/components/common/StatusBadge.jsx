import { STATUS_BADGE_CONFIG } from '../../constants'

export default function StatusBadge({ status }) {
  const cfg = STATUS_BADGE_CONFIG[status] ?? { label: status, bg: 'bg-white/10 border-white/20 text-white/50' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg}`}>
      {cfg.label}
    </span>
  )
}
