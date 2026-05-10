import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBooking } from '../../api/bookingsApi'
import { rateDriver } from '../../api/driversApi'
import Spinner from '../../components/common/Spinner'

import { RATING_LABELS as LABELS } from '../../constants'

function StarButton({ index, filled, onEnter, onLeave, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
      className={`transition-all duration-150 ${filled ? 'scale-110' : 'scale-90 opacity-30 hover:opacity-60'}`}
    >
      <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={filled ? '#f59e0b' : 'transparent'}
          stroke={filled ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <StarButton
          key={star}
          index={star}
          filled={star <= active}
          onEnter={setHovered}
          onLeave={() => setHovered(0)}
          onClick={onChange}
        />
      ))}
    </div>
  )
}

export default function RateDriver() {
  const { bookingId } = useParams()
  const navigate      = useNavigate()

  const [booking,    setBooking]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [rating,     setRating]     = useState(0)
  const [review,     setReview]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)

  useEffect(() => {
    getBooking(bookingId)
      .then(r => {
        const b = r.data
        if (b.status !== 'completed' || !b.driver || b.driver_rated) {
          navigate(`/bookings/${bookingId}`)
          return
        }
        setBooking(b)
      })
      .catch(() => navigate('/bookings'))
      .finally(() => setLoading(false))
  }, [bookingId])

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a star rating.'); return }
    setError(''); setSubmitting(true)
    try {
      await rateDriver({ driver_id: booking.driver.id, booking_id: booking.id, rating, review: review.trim() || undefined })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit rating. Please try again.')
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
        <div className="absolute inset-0 -z-10 bg-yellow-500/10 rounded-full blur-3xl scale-150" />

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/40 animate-float">
          <svg viewBox="0 0 24 24" className="w-12 h-12">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="white" strokeWidth={0}
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
        <p className="text-white/40 text-sm mb-4">
          Your {rating}-star rating has been submitted successfully.
        </p>

        <div className="flex items-center justify-center gap-1 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} viewBox="0 0 24 24" className="w-8 h-8">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={i <= rating ? '#f59e0b' : 'transparent'}
                stroke={i <= rating ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>

        <div className="flex gap-3">
          <Link
            to="/bookings"
            className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium text-center transition-all duration-200"
          >
            My Bookings
          </Link>
          <Link to="/dashboard" className="btn-gradient flex-1 py-3 text-sm text-center rounded-xl">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )

  if (!booking) return null

  const { driver } = booking
  const initials = driver?.name
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'DR'

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-yellow-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate(`/bookings/${bookingId}`)}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to booking
          </button>
          <p className="text-white/30 text-sm mb-1">Booking #{String(bookingId).padStart(5, '0')}</p>
          <h1 className="text-3xl font-bold gradient-text">Rate Your Driver</h1>
        </div>

        {/* Driver card */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-5 text-center animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-violet-500/40 animate-float">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" />
              </svg>
            </div>
          </div>

          <h2 className="text-white font-bold text-xl mb-0.5">{driver?.name}</h2>
          <p className="text-white/30 text-sm">Your driver for this rental</p>
          {driver?.phone && (
            <p className="text-white/20 text-xs mt-2 font-mono">{driver.phone}</p>
          )}
        </div>

        {/* Rating form */}
        <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Stars */}
          <div className="text-center mb-6 pb-6 border-b border-white/5">
            <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-5">
              How was your experience?
            </p>
            <StarSelector value={rating} onChange={setRating} />
            <p className={`mt-3 text-base font-semibold transition-all duration-200 ${rating > 0 ? 'gradient-text' : 'text-white/20'}`}>
              {rating > 0 ? LABELS[rating] : 'Tap a star to rate'}
            </p>
          </div>

          {/* Review */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
              Review <span className="text-white/20 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Share your experience with this driver..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/10 transition-all duration-300 resize-none"
            />
            <p className="text-white/20 text-xs mt-1 text-right">{review.length} / 500</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/bookings/${bookingId}`)}
              className="px-5 py-3 rounded-xl glass border border-white/10 text-white/40 hover:text-white text-sm font-medium transition-all duration-200"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="btn-gradient flex-1 py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-40"
            >
              {submitting ? <Spinner size="sm" /> : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 inline">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                  </svg>
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
