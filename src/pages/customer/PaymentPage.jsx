import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getBooking } from '../../api/bookingsApi'
import { createPayment } from '../../api/paymentsApi'
import Spinner from '../../components/common/Spinner'

import { PAYMENT_METHODS as METHODS } from '../../constants'

export default function PaymentPage() {
  const { bookingId } = useParams()
  const navigate      = useNavigate()

  const [booking,     setBooking]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [method,      setMethod]      = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  useEffect(() => {
    getBooking(bookingId)
      .then(r => {
        const b = r.data
        if (b.status !== 'approved') { navigate(`/bookings/${bookingId}`); return }
        setBooking(b)
      })
      .catch(() => navigate('/bookings'))
      .finally(() => setLoading(false))
  }, [bookingId])

  const handlePay = async () => {
    if (!method) { setError('Please select a payment method.'); return }
    setError(''); setSubmitting(true)
    try {
      await createPayment({ booking_id: Number(bookingId), payment_method: method, amount: booking.total_cost })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center"><Spinner size="lg" /></div>
  )

  /* ── Success state ── */
  if (success) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-6">
      <div className="relative max-w-md w-full text-center animate-slide-up">
        {/* glow blob */}
        <div className="absolute inset-0 -z-10 bg-emerald-500/10 rounded-full blur-3xl scale-150" />

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-emerald-500/40 animate-float">
          ✓
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Payment Submitted!</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Your payment request is pending admin verification.<br />
          You'll be notified once it's processed.
        </p>

        <div className="glass rounded-2xl border border-white/10 p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/30">Booking</span>
            <span className="text-white">#{String(bookingId).padStart(5, '0')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/30">Method</span>
            <span className="text-white capitalize">{method.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30 text-sm">Amount</span>
            <span className="gradient-text font-bold text-lg">₹{Number(booking.total_cost).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/payments" className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium text-center transition-all duration-200">
            My Payments
          </Link>
          <Link to="/bookings" className="btn-gradient flex-1 py-3 text-sm text-center rounded-xl">
            Back to Bookings
          </Link>
        </div>
      </div>
    </div>
  )

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'
  const { vehicle, pickup_date, return_date, total_cost, pickup_location } = booking

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      {/* bg accent */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button onClick={() => navigate(`/bookings/${bookingId}`)}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to booking
          </button>
          <p className="text-white/30 text-sm mb-1">Secure Checkout</p>
          <h1 className="text-3xl font-bold gradient-text">Complete Payment</h1>
        </div>

        {/* Booking summary */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Booking Summary</p>

          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
              <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{vehicle?.make} {vehicle?.model}</p>
              <p className="text-white/30 text-xs capitalize">{vehicle?.category} · {vehicle?.year}</p>
            </div>
            <span className="text-white/20 text-xs font-mono shrink-0">#{String(bookingId).padStart(5, '0')}</span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-white/30">Pickup</span>
              <span className="text-white">{fmt(pickup_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">Return</span>
              <span className="text-white">{fmt(return_date)}</span>
            </div>
            {pickup_location && (
              <div className="flex justify-between">
                <span className="text-white/30">Location</span>
                <span className="text-white text-right max-w-[60%] truncate">{pickup_location}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-white/5">
              <span className="text-white/50 font-semibold">Total Due</span>
              <span className="gradient-text text-2xl font-bold">₹{Number(total_cost).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Method selector */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Payment Method</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {METHODS.map(m => {
              const active = method === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => { setMethod(m.id); setError('') }}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left
                    ${active
                      ? 'border-violet-500/60 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                    }`}
                >
                  {active && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50" />
                  )}
                  <span className="text-2xl">{m.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${active ? 'text-violet-300' : 'text-white/70'}`}>{m.label}</p>
                    <p className="text-white/20 text-xs truncate">{m.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Notice */}
        <div className="flex items-start gap-3 glass rounded-xl border border-white/5 px-4 py-3 mb-5 text-xs text-white/30 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <span className="text-lg">ℹ️</span>
          <p>Your payment will be marked <span className="text-white/50 font-medium">pending</span> until verified by an administrator. Cash payments are settled at the branch.</p>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={submitting || !method}
          className="btn-gradient w-full py-4 text-base flex items-center justify-center gap-2 rounded-2xl disabled:opacity-40 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {submitting ? <Spinner size="sm" /> : (
            <>
              <span>🔒</span>
              Submit Payment · ₹{Number(total_cost).toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
