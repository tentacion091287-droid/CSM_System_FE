import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getMyFines, payFine } from '../../api/finesApi'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

import { PAYMENT_METHODS as METHODS } from '../../constants'

function PayFineModal({ fine, onClose, onPaid }) {
  const [method,     setMethod]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const handlePay = async () => {
    if (!method) { setError('Select a payment method.'); return }
    setError(''); setSubmitting(true)
    try {
      await payFine(fine.id, { payment_method: method })
      onPaid()
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-5">
          <h3 className="text-white font-bold text-lg mb-1">Pay Fine</h3>
          <p className="text-white/30 text-sm">
            Fine #{String(fine.id).padStart(5, '0')} ·{' '}
            <span className="text-red-400 font-bold">₹{Number(fine.amount).toFixed(2)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); setError('') }}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-left
                ${method === m.id
                  ? 'border-violet-500/60 bg-violet-500/10'
                  : 'border-white/10 bg-white/3 hover:border-white/20'
                }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className={`text-xs font-medium ${method === m.id ? 'text-violet-300' : 'text-white/60'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}

        <div className="flex items-start gap-2 rounded-xl bg-white/3 border border-white/5 px-3 py-2.5 mb-4 text-xs text-white/30">
          <span>ℹ️</span>
          Payment will be marked pending until verified by an administrator.
        </div>

        <button
          onClick={handlePay}
          disabled={submitting || !method}
          className="btn-gradient w-full py-3 text-sm flex items-center justify-center gap-2 rounded-xl disabled:opacity-40"
        >
          {submitting ? <Spinner size="sm" /> : <>🔒 Submit Payment</>}
        </button>
      </div>
    </div>
  )
}

function FineRow({ fine, onPayClick }) {
  const { id, booking, amount, status, reason, issued_date } = fine
  return (
    <div className="group glass rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
      <div className="flex items-stretch">
        <div className={`w-1.5 shrink-0 bg-gradient-to-b
          ${status === 'pending' ? 'from-red-500 to-rose-400'     : ''}
          ${status === 'paid'    ? 'from-emerald-500 to-teal-400' : ''}
          ${status === 'waived'  ? 'from-slate-500 to-slate-400'  : ''}
        `} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-rose-600/20 border border-red-500/20 flex items-center justify-center text-lg">
                ⚠️
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Fine #{String(id).padStart(5, '0')}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {reason ?? 'Late return / penalty'}
                  {issued_date && <> · {format(new Date(issued_date), 'dd MMM yyyy')}</>}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xl font-bold ${status === 'pending' ? 'text-red-400' : 'gradient-text'}`}>
                ₹{Number(amount).toFixed(2)}
              </p>
              <div className="mt-1 flex justify-end">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-white/20 text-xs font-mono">
              {booking ? `Booking #${String(booking.id).padStart(5, '0')}` : ''}
            </span>
            <div className="flex items-center gap-3">
              {booking && (
                <Link
                  to={`/bookings/${booking.id}`}
                  className="text-xs text-violet-400 hover:text-fuchsia-400 transition-colors font-medium"
                >
                  View Booking
                </Link>
              )}
              {status === 'pending' && (
                <button
                  onClick={() => onPayClick(fine)}
                  className="text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Pay Fine →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyFines() {
  const [fines,          setFines]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [page,           setPage]           = useState(1)
  const [pages,          setPages]          = useState(1)
  const [total,          setTotal]          = useState(0)
  const [payTarget,      setPayTarget]      = useState(null)
  const [paidSuccess,    setPaidSuccess]    = useState(false)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getMyFines({ page: pg, size: 10 })
      const data = res.data
      setFines(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load fines.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handlePaid = () => {
    setPayTarget(null)
    setPaidSuccess(true)
    load(page)
    setTimeout(() => setPaidSuccess(false), 4000)
  }

  const totalPending = fines.filter(f => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0)
  const totalPaid    = fines.filter(f => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">My Account</p>
          <h1 className="text-3xl font-bold gradient-text">My Fines</h1>
        </div>

        {/* Success toast */}
        {paidSuccess && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2 animate-fade-in">
            <span>✓</span> Fine payment submitted. Awaiting admin verification.
          </div>
        )}

        {/* Summary strip */}
        {!loading && fines.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            {[
              { label: 'Total',   value: total,        fmt: (v) => `${v}` },
              { label: 'Pending', value: totalPending, fmt: (v) => `₹${v.toFixed(0)}` },
              { label: 'Paid',    value: totalPaid,    fmt: (v) => `₹${v.toFixed(0)}` },
            ].map(({ label, value, fmt }) => (
              <div key={label} className="glass rounded-2xl border border-white/10 p-4 text-center">
                <p className={`text-2xl font-bold ${label === 'Pending' && totalPending > 0 ? 'text-red-400' : 'gradient-text'}`}>
                  {fmt(value)}
                </p>
                <p className="text-white/20 text-xs mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : fines.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-white/30 text-lg mb-2">No fines — you're all clear!</p>
            <Link to="/bookings" className="text-violet-400 hover:text-fuchsia-400 text-sm transition-colors">
              View my bookings →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {fines.map((f, i) => (
                <div key={f.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <FineRow fine={f} onPayClick={setPayTarget} />
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>

      {payTarget && (
        <PayFineModal
          fine={payTarget}
          onClose={() => setPayTarget(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  )
}
