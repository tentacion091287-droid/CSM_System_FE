import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getMyPayments } from '../../api/paymentsApi'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

import { PAYMENT_METHOD_ICON as METHOD_ICON, PAYMENT_METHOD_LABEL as METHOD_LABEL } from '../../constants'

function PaymentRow({ payment }) {
  const { id, booking, amount, status, payment_method, created_at } = payment
  return (
    <div className="group glass rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
      <div className="flex items-stretch">
        {/* Accent bar */}
        <div className={`w-1.5 shrink-0 bg-gradient-to-b
          ${status === 'pending'   ? 'from-yellow-500 to-amber-400' : ''}
          ${status === 'completed' ? 'from-emerald-500 to-teal-400' : ''}
          ${status === 'failed'    ? 'from-red-500 to-rose-400'     : ''}
          ${status === 'refunded'  ? 'from-blue-500 to-cyan-400'    : ''}
        `} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{METHOD_ICON[payment_method] ?? '💰'}</span>
              <div>
                <p className="text-white font-semibold text-sm">
                  {METHOD_LABEL[payment_method] ?? payment_method}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {booking?.vehicle?.make} {booking?.vehicle?.model}
                  {created_at && <> · {format(new Date(created_at), 'dd MMM yyyy')}</>}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="gradient-text text-xl font-bold">₹{Number(amount).toFixed(2)}</p>
              <div className="mt-1 flex justify-end">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          {booking && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-white/20 text-xs font-mono">Booking #{String(booking.id).padStart(5, '0')}</span>
              <Link
                to={`/bookings/${booking.id}`}
                className="text-xs text-violet-400 hover:text-fuchsia-400 transition-colors font-medium"
              >
                View Booking →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyPayments() {
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getMyPayments({ page: pg, size: 10 })
      const data = res.data
      setPayments(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load payments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  /* Totals for summary strip */
  const totalPaid    = payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">My Account</p>
          <h1 className="text-3xl font-bold gradient-text">My Payments</h1>
        </div>

        {/* Summary strip */}
        {!loading && payments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            {[
              { label: 'Total',    value: total,        fmt: (v) => `${v}`, suffix: ' payments' },
              { label: 'Paid',     value: totalPaid,    fmt: (v) => `₹${v.toFixed(0)}`, suffix: ' verified' },
              { label: 'Pending',  value: totalPending, fmt: (v) => `₹${v.toFixed(0)}`, suffix: ' awaiting' },
            ].map(({ label, value, fmt, suffix }) => (
              <div key={label} className="glass rounded-2xl border border-white/10 p-4 text-center">
                <p className="gradient-text text-2xl font-bold">{fmt(value)}</p>
                <p className="text-white/20 text-xs mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-white/30 text-lg mb-2">No payments yet.</p>
            <Link to="/bookings" className="text-violet-400 hover:text-fuchsia-400 text-sm transition-colors">
              View my bookings →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {payments.map((p, i) => (
                <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <PaymentRow payment={p} />
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
