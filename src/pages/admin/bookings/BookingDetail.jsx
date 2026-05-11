import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  getBooking, approveBooking, rejectBooking,
  activateBooking, completeBooking, assignDriver,
} from '../../../api/bookingsApi'
import { getDrivers } from '../../../api/driversApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import Select from '../../../components/common/Select'
import StatusBadge from '../../../components/common/StatusBadge'
import Spinner from '../../../components/common/Spinner'

const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

function Field({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-white/25 text-xs uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-white text-sm ${mono ? 'font-mono' : 'font-medium'}`}>{value ?? '—'}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">{title}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}

export default function AdminBookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [booking,    setBooking]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [confirm,    setConfirm]    = useState(null)
  const [acting,     setActing]     = useState(false)

  // Activate modal state
  const [showActivate, setShowActivate] = useState(false)
  const [drivers,      setDrivers]      = useState([])
  const [driverId,     setDriverId]     = useState('')
  const [fetchingD,    setFetchingD]    = useState(false)
  const [activating,   setActivating]   = useState(false)

  // Complete modal state
  const [showComplete, setShowComplete] = useState(false)
  const [returnDate,   setReturnDate]   = useState('')
  const [completing,   setCompleting]   = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const res = await getBooking(id)
      setBooking(res.data)
    } catch {
      setError('Failed to load booking.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const openActivate = async () => {
    setShowActivate(true)
    setFetchingD(true)
    setDriverId(booking?.driver_id ? String(booking.driver_id) : '')
    try {
      const r = await getDrivers({ is_available: true, size: 100 })
      const d = r.data
      setDrivers(Array.isArray(d) ? d : d.items ?? [])
    } catch { setDrivers([]) }
    finally { setFetchingD(false) }
  }

  const handleActivate = async () => {
    setActivating(true)
    try {
      if (driverId) await assignDriver(id, { driver_id: driverId })
      await activateBooking(id)
      setShowActivate(false)
      load()
    } catch { /* ignore */ }
    finally { setActivating(false) }
  }

  const openComplete = () => {
    setReturnDate(format(new Date(), 'yyyy-MM-dd'))
    setShowComplete(true)
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await completeBooking(id, { actual_return: returnDate })
      setShowComplete(false)
      load()
    } catch { /* ignore */ }
    finally { setCompleting(false) }
  }

  const handleConfirm = async () => {
    setActing(true)
    try {
      await confirm.action()
      setConfirm(null)
      load()
    } catch { /* ignore */ }
    finally { setActing(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (error || !booking) return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{error || 'Booking not found.'}</p>
      <button onClick={() => navigate('/admin/bookings')} className="btn-gradient px-6 py-2.5 text-sm">← Back</button>
    </div>
  )

  const b = booking
  const customer = b.customer ?? b.user ?? {}
  const vehicle  = b.vehicle  ?? {}
  const driver   = b.driver   ?? null

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="mt-1 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 shrink-0"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-white/30 text-sm">Booking #{String(b.id).padStart(5, '0')}</p>
              <StatusBadge status={b.status} />
            </div>
            <h1 className="text-3xl font-bold gradient-text mt-1">Booking Detail</h1>
          </div>
        </div>

        <div className="space-y-5">
          {/* Customer */}
          <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <Section title="Customer">
              <Field label="Name"  value={customer.name} />
              <Field label="Email" value={customer.email} />
              <Field label="Phone" value={customer.phone ?? '—'} />
            </Section>
          </div>

          {/* Vehicle */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Section title="Vehicle">
              <Field label="Make / Model" value={`${vehicle.make ?? '—'} ${vehicle.model ?? ''}`} />
              <Field label="Year"  value={vehicle.year} />
              <Field label="Plate" value={vehicle.license_plate ?? vehicle.plate ?? '—'} mono />
              <Field label="Category" value={vehicle.category ?? vehicle.type ?? '—'} />
              <Field label="Daily Rate" value={vehicle.price_per_day != null ? `₹${Number(vehicle.price_per_day).toFixed(2)}/day` : '—'} />
            </Section>
          </div>

          {/* Dates & Financials */}
          <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Section title="Dates & Financials">
              <Field label="Start Date"    value={fmt(b.start_date)} />
              <Field label="End Date"      value={fmt(b.end_date)} />
              {b.actual_return && <Field label="Actual Return" value={fmt(b.actual_return)} />}
              <Field label="Total Cost"    value={b.total_cost != null ? `₹${Number(b.total_cost).toFixed(2)}` : '—'} />
              <Field label="Booked On"     value={fmt(b.created_at)} />
            </Section>
          </div>

          {/* Driver */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Section title="Assigned Driver">
              {driver ? (
                <>
                  <Field label="Name"    value={driver.name} />
                  <Field label="License" value={driver.license_number ?? driver.license ?? '—'} mono />
                  <Field label="Phone"   value={driver.phone ?? '—'} />
                  <Field label="Rating"  value={driver.average_rating != null ? `${Number(driver.average_rating).toFixed(1)} ★` : 'Not rated'} />
                </>
              ) : (
                <div className="col-span-3 text-white/30 text-sm">No driver assigned</div>
              )}
            </Section>
          </div>

          {/* Notes */}
          {b.notes && (
            <div className="glass rounded-2xl border border-white/10 p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <p className="text-white/25 text-xs uppercase tracking-widest font-semibold mb-2">Notes</p>
              <p className="text-white/60 text-sm leading-relaxed">{b.notes}</p>
            </div>
          )}

          {/* Admin Actions */}
          {['pending', 'approved', 'active'].includes(b.status) && (
            <div className="glass rounded-2xl border border-white/10 p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-white/25 text-xs uppercase tracking-widest font-semibold mb-4">Admin Actions</p>
              <div className="flex flex-wrap gap-3">
                {b.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setConfirm({
                        title: 'Approve Booking',
                        message: `Approve booking #${String(b.id).padStart(5, '0')}?`,
                        confirmLabel: 'Approve',
                        danger: false,
                        action: () => approveBooking(b.id),
                      })}
                      className="btn-gradient px-5 py-2.5 text-sm font-semibold"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => setConfirm({
                        title: 'Reject Booking',
                        message: `Reject booking #${String(b.id).padStart(5, '0')}? This cannot be undone.`,
                        confirmLabel: 'Reject',
                        danger: true,
                        action: () => rejectBooking(b.id, {}),
                      })}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}
                {b.status === 'approved' && (
                  <button
                    onClick={openActivate}
                    className="btn-gradient px-5 py-2.5 text-sm font-semibold"
                  >
                    ▶ Activate
                  </button>
                )}
                {b.status === 'active' && (
                  <button
                    onClick={openComplete}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200"
                  >
                    ✓ Mark Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          open
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          loading={acting}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Activate modal */}
      {showActivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowActivate(false)} />
          <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-1">Activate Booking</h3>
            <p className="text-white/40 text-sm mb-5">Optionally assign an available driver</p>
            {fetchingD ? (
              <div className="flex justify-center py-6"><Spinner /></div>
            ) : (
              <Select value={driverId} onChange={e => setDriverId(e.target.value)} className="mb-5">
                <option value="">No driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.license_number ?? d.license ?? ''}</option>
                ))}
              </Select>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowActivate(false)} disabled={activating}
                className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleActivate} disabled={activating || fetchingD}
                className="flex-1 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {activating ? <Spinner size="sm" /> : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete modal */}
      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowComplete(false)} />
          <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-1">Complete Booking</h3>
            <p className="text-white/40 text-sm mb-5">Set the actual return date</p>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Actual Return Date</label>
            <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="input-exotic mb-5" />
            <div className="flex gap-3">
              <button onClick={() => setShowComplete(false)} disabled={completing}
                className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleComplete} disabled={completing}
                className="flex-1 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {completing ? <Spinner size="sm" /> : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
