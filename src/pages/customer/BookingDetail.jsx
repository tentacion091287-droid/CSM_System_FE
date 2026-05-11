import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getBooking, cancelBooking, getInvoiceByBooking, getFineByBooking } from '../../api/bookingsApi'
import BookingStatusStepper from '../../components/bookings/BookingStatusStepper'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmModal from '../../components/common/ConfirmModal'
import Spinner from '../../components/common/Spinner'

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <span className="text-white/30 text-sm">{label}</span>
    <span className="text-white text-sm font-medium">{value ?? '—'}</span>
  </div>
)

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]     = useState(null)
  const [invoice, setInvoice]     = useState(null)
  const [fine, setFine]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelling, setCancelling]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getBooking(id)
      const b = res.data
      setBooking(b)
      if (b.status === 'completed') {
        getInvoiceByBooking(id).then(r => setInvoice(r.data)).catch(() => {})
        getFineByBooking(id).then(r => setFine(r.data)).catch(() => {})
      }
    } catch {
      navigate('/bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelBooking(id)
      setCancelModal(false)
      load()
    } catch { /* ignore */ }
    finally { setCancelling(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center"><Spinner size="lg" /></div>
  )

  if (!booking) return null

  const { vehicle, status, pickup_date, return_date, pickup_location, drop_location,
          needs_driver, total_cost, driver, created_at } = booking

  const canEdit   = status === 'pending'
  const canCancel = status === 'pending'
  const canPay    = status === 'approved'
  const completed = status === 'completed'
  const canRate   = completed && driver && !booking.driver_rated

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate('/bookings')}
          className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to bookings
        </button>

        {/* Title */}
        <div className="flex items-start justify-between mb-6 animate-slide-up">
          <div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">#{String(id).padStart(5, '0')}</p>
            <h1 className="text-3xl font-bold text-white">
              {vehicle?.make} {vehicle?.model}
            </h1>
            <p className="text-white/30 text-sm mt-0.5 capitalize">{vehicle?.category} · {vehicle?.year}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Stepper */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <BookingStatusStepper status={status} />
        </div>

        {/* Action alerts */}
        {canPay && (
          <div className="mb-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 flex items-center justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-blue-300 font-semibold text-sm">Payment Required</p>
              <p className="text-white/40 text-xs mt-0.5">Your booking is approved — complete payment to confirm.</p>
            </div>
            <Link to={`/payments/${id}/pay`} className="btn-gradient shrink-0 px-5 py-2.5 text-sm">
              Pay Now →
            </Link>
          </div>
        )}

        {fine && (
          <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 p-5 flex items-center justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-red-300 font-semibold text-sm">Overdue Fine</p>
              <p className="text-white/40 text-xs mt-0.5">Amount due: <span className="text-red-400 font-semibold">₹{Number(fine.amount).toFixed(2)}</span></p>
            </div>
            <Link to="/fines" className="shrink-0 px-4 py-2 text-sm glass border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-200">
              View Fine →
            </Link>
          </div>
        )}

        {invoice && (
          <div className="mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-center justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-emerald-300 font-semibold text-sm">Invoice Available</p>
              <p className="text-white/40 text-xs mt-0.5">Your rental invoice is ready to download.</p>
            </div>
            <Link to={`/invoices/${invoice.id}`} className="shrink-0 px-4 py-2 text-sm glass border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/10 transition-all duration-200">
              View Invoice →
            </Link>
          </div>
        )}

        {canRate && (
          <div className="mb-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-5 flex items-center justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-yellow-300 font-semibold text-sm">Rate Your Driver</p>
              <p className="text-white/40 text-xs mt-0.5">How was your experience with {driver?.name}?</p>
            </div>
            <Link to={`/rate/${id}`} className="shrink-0 px-4 py-2 text-sm glass border border-yellow-500/30 text-yellow-400 rounded-xl hover:bg-yellow-500/10 transition-all duration-200">
              Rate Now ⭐
            </Link>
          </div>
        )}

        {/* Details card */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Booking Details</h2>
          <InfoRow label="Pickup Date"      value={fmt(pickup_date)} />
          <InfoRow label="Return Date"      value={fmt(return_date)} />
          <InfoRow label="Pickup Location"  value={pickup_location} />
          <InfoRow label="Drop Location"    value={drop_location} />
          <InfoRow label="Driver Included"  value={needs_driver ? 'Yes' : 'No'} />
          {driver && <InfoRow label="Assigned Driver" value={driver.name} />}
          <InfoRow label="Booked On"        value={fmt(created_at)} />
          {total_cost != null && (
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/10">
              <span className="text-white/50 font-semibold">Total Cost</span>
              <span className="gradient-text text-2xl font-bold">₹{Number(total_cost).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(canEdit || canCancel) && (
          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            {canEdit && (
              <Link to={`/bookings/${id}/edit`}
                className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/60 hover:text-white text-sm font-medium text-center transition-all duration-200 hover:border-violet-500/40">
                ✏️ Edit Booking
              </Link>
            )}
            {canCancel && (
              <button onClick={() => setCancelModal(true)}
                className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all duration-200">
                ✕ Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={cancelModal}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelModal(false)}
      />
    </div>
  )
}
