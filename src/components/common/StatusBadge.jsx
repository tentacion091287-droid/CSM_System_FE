const CONFIG = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-500/15  border-yellow-500/30  text-yellow-400'  },
  approved:    { label: 'Approved',    bg: 'bg-blue-500/15    border-blue-500/30    text-blue-400'    },
  active:      { label: 'Active',      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  completed:   { label: 'Completed',   bg: 'bg-white/10       border-white/20       text-white/50'    },
  cancelled:   { label: 'Cancelled',   bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  rejected:    { label: 'Rejected',    bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  available:   { label: 'Available',   bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  rented:      { label: 'Rented',      bg: 'bg-violet-500/15  border-violet-500/30  text-violet-400'  },
  maintenance: { label: 'Maintenance', bg: 'bg-orange-500/15  border-orange-500/30  text-orange-400'  },
  paid:        { label: 'Paid',        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  unpaid:      { label: 'Unpaid',      bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  waived:      { label: 'Waived',      bg: 'bg-white/10       border-white/20       text-white/50'    },
  scheduled:   { label: 'Scheduled',   bg: 'bg-cyan-500/15    border-cyan-500/30    text-cyan-400'    },
  in_progress: { label: 'In Progress', bg: 'bg-amber-500/15   border-amber-500/30   text-amber-400'   },
  verified:    { label: 'Verified',    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  failed:      { label: 'Failed',      bg: 'bg-red-500/15     border-red-500/30     text-red-400'     },
  inactive:    { label: 'Inactive',    bg: 'bg-white/10       border-white/20       text-white/40'    },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? { label: status, bg: 'bg-white/10 border-white/20 text-white/50' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg}`}>
      {cfg.label}
    </span>
  )
}
