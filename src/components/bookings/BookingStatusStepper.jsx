const STEPS = ['pending', 'approved', 'active', 'completed']

const STEP_META = {
  pending:   { label: 'Pending',   icon: '⏳' },
  approved:  { label: 'Approved',  icon: '✅' },
  active:    { label: 'Active',    icon: '🚗' },
  completed: { label: 'Completed', icon: '🏁' },
}

export default function BookingStatusStepper({ status }) {
  const isCancelled = status === 'cancelled' || status === 'rejected'
  const currentIdx  = STEPS.indexOf(status)

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
        <span className="text-xl">❌</span>
        <span className="text-red-400 font-semibold capitalize">{status}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done    = i < currentIdx
        const active  = i === currentIdx
        const future  = i > currentIdx
        const meta    = STEP_META[step]

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500
                ${done   ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-transparent shadow-lg shadow-violet-500/30' : ''}
                ${active ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-fuchsia-400 shadow-lg shadow-fuchsia-500/40 animate-glow-pulse' : ''}
                ${future ? 'bg-white/5 border-white/10' : ''}
              `}>
                <span className={future ? 'opacity-20' : ''}>{meta.icon}</span>
              </div>
              <span className={`text-xs font-medium ${active ? 'text-fuchsia-300' : done ? 'text-violet-400' : 'text-white/20'}`}>
                {meta.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all duration-700
                ${done ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : 'bg-white/10'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
