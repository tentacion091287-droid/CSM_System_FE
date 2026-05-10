import Spinner from './Spinner'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger = false, loading = false, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300
              ${danger
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5'
                : 'btn-gradient'
              }`}
          >
            {loading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
