import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getInvoice } from '../../api/invoicesApi'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/30">{label}</span>
      <span className={highlight ? 'gradient-text font-bold text-lg' : 'text-white'}>{value}</span>
    </div>
  )
}

export default function InvoiceDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [invoice,  setInvoice]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    getInvoice(id)
      .then(r => setInvoice(r.data))
      .catch(() => setError('Invoice not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center"><Spinner size="lg" /></div>
  )

  if (error || !invoice) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🧾</div>
        <p className="text-red-400 mb-4">{error || 'Invoice not found.'}</p>
        <button onClick={() => navigate('/invoices')} className="btn-gradient px-6 py-2.5 text-sm">
          Back to Invoices
        </button>
      </div>
    </div>
  )

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'
  const { booking, amount, status, issued_date, due_date, description } = invoice

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to invoices
          </button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/30 text-sm mb-1">#{String(id).padStart(5, '0')}</p>
              <h1 className="text-3xl font-bold gradient-text">Invoice Detail</h1>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Invoice card */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className={`h-1 w-full ${
            status === 'paid' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
          }`} />

          <div className="p-6">
            {/* Hero amount */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/20 flex items-center justify-center text-3xl">
                🧾
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Tax Invoice</p>
                <p className="text-white/30 text-sm">#{String(id).padStart(5, '0')}</p>
              </div>
              <div className="text-right">
                <p className="gradient-text text-3xl font-bold">${Number(amount).toFixed(2)}</p>
                <p className="text-white/20 text-xs mt-0.5">Total Amount</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass rounded-xl border border-white/5 p-3">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Issued</p>
                <p className="text-white text-sm font-medium">{fmt(issued_date)}</p>
              </div>
              {due_date && (
                <div className="glass rounded-xl border border-white/5 p-3">
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Due Date</p>
                  <p className={`text-sm font-medium ${status === 'unpaid' ? 'text-amber-400' : 'text-white'}`}>
                    {fmt(due_date)}
                  </p>
                </div>
              )}
            </div>

            {/* Booking info */}
            {booking && (
              <div className="mb-6 rounded-xl bg-white/3 border border-white/5 p-4 space-y-2.5">
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">Booking Reference</p>
                <InfoRow label="Booking ID" value={`#${String(booking.id).padStart(5, '0')}`} />
                {booking.vehicle && (
                  <InfoRow label="Vehicle" value={`${booking.vehicle.make} ${booking.vehicle.model}`} />
                )}
                {booking.pickup_date && <InfoRow label="Pickup"  value={fmt(booking.pickup_date)} />}
                {booking.return_date && <InfoRow label="Return"  value={fmt(booking.return_date)} />}
                <div className="pt-2 border-t border-white/5">
                  <InfoRow label="Rental Cost" value={`$${Number(booking.total_cost ?? amount).toFixed(2)}`} highlight />
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="mb-6 rounded-xl bg-white/3 border border-white/5 p-4">
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">Notes</p>
                <p className="text-white/60 text-sm leading-relaxed">{description}</p>
              </div>
            )}

            {/* Unpaid notice */}
            {status === 'unpaid' && (
              <div className="mb-5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-xs text-amber-400 flex items-center gap-2">
                <span>⚠</span>
                This invoice is unpaid. Complete your payment to settle the balance.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {booking && (
                <Link
                  to={`/bookings/${booking.id}`}
                  className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium text-center transition-all duration-200"
                >
                  View Booking
                </Link>
              )}
              {status === 'unpaid' && booking && (
                <Link
                  to={`/payments/${booking.id}/pay`}
                  className="btn-gradient flex-1 py-3 text-sm text-center rounded-xl"
                >
                  🔒 Pay Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
