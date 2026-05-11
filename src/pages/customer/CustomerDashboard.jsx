import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useAuth } from '../../hooks/useAuth'
import { fmt } from '../../utils/format'
import { getMyBookings } from '../../api/bookingsApi'
import { getMyFines } from '../../api/finesApi'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'


function Section({ title, icon, children, delay = '0s' }) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h2 className="text-white/60 text-sm font-semibold uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ActiveRentalCard({ booking }) {
  const v = booking.vehicle ?? {}
  const days = booking.start_date && booking.end_date
    ? Math.max(1, Math.round((new Date(booking.end_date) - new Date(booking.start_date)) / 86400000))
    : null

  return (
    <div className="glass rounded-2xl border border-emerald-500/20 p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-sky-600/20 border border-cyan-500/20 flex items-center justify-center text-3xl shrink-0">
            🚗
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {v.make} {v.model} {v.year ? `(${v.year})` : ''}
            </p>
            <p className="text-white/40 text-sm">{v.license_plate ?? v.plate ?? ''}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <StatusBadge status={booking.status} />
              {days && <span className="text-white/30 text-xs">{days} day{days !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        </div>

        <div className="sm:text-right space-y-1.5">
          <div className="flex sm:flex-col gap-4 sm:gap-1">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider">Pickup</p>
              <p className="text-white/80 text-sm font-medium">{fmt(booking.start_date)}</p>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider">Return</p>
              <p className="text-white/80 text-sm font-medium">{fmt(booking.end_date)}</p>
            </div>
          </div>
          <Link
            to={`/bookings/${booking.id}`}
            className="inline-block mt-2 text-xs px-4 py-1.5 rounded-lg border border-white/15 text-white/50 hover:text-white hover:border-white/25 font-medium transition-all duration-200"
          >
            View Details →
          </Link>
        </div>
      </div>

      {(booking.pickup_location || booking.drop_location) && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 text-sm text-white/40">
          {booking.pickup_location && (
            <span className="flex items-center gap-1.5">
              <span className="text-white/20">📍</span>
              From: <span className="text-white/60">{booking.pickup_location}</span>
            </span>
          )}
          {booking.drop_location && (
            <span className="flex items-center gap-1.5">
              <span className="text-white/20">🏁</span>
              To: <span className="text-white/60">{booking.drop_location}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function PendingPaymentCard({ booking }) {
  const v = booking.vehicle ?? {}
  return (
    <div className="glass rounded-2xl border border-amber-500/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
      <div className="relative flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
          ⚠️
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm truncate">
            Payment pending for {v.make} {v.model}
          </p>
          <p className="text-white/40 text-xs">
            Booking #{String(booking.id).padStart(5, '0')} · Approved · {fmt(booking.start_date)} → {fmt(booking.end_date)}
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-3 shrink-0">
        {booking.total_cost != null && (
          <p className="gradient-text font-bold text-sm">₹{Number(booking.total_cost).toFixed(0)}</p>
        )}
        <Link
          to={`/payments/${booking.id}/pay`}
          className="btn-gradient text-xs px-5 py-2 rounded-xl font-semibold whitespace-nowrap"
        >
          Pay Now
        </Link>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const { user } = useAuth()

  const [activeBooking,    setActiveBooking]    = useState(null)
  const [approvedBookings, setApprovedBookings] = useState([])
  const [pendingFines,     setPendingFines]     = useState([])
  const [loading,          setLoading]          = useState(true)

  useEffect(() => {
    Promise.all([
      getMyBookings({ status: 'active',   size: 1   }).catch(() => null),
      getMyBookings({ status: 'approved', size: 10  }).catch(() => null),
      getMyFines   ({ status: 'pending',  size: 100 }).catch(() => null),
    ]).then(([activeRes, approvedRes, finesRes]) => {
      if (activeRes) {
        const d = activeRes.data
        const items = Array.isArray(d) ? d : d.items ?? []
        setActiveBooking(items[0] ?? null)
      }
      if (approvedRes) {
        const d = approvedRes.data
        setApprovedBookings(Array.isArray(d) ? d : d.items ?? [])
      }
      if (finesRes) {
        const d = finesRes.data
        setPendingFines(Array.isArray(d) ? d : d.items ?? [])
      }
    }).finally(() => setLoading(false))
  }, [])

  const pendingFinesTotal  = pendingFines.reduce((sum, f) => sum + Number(f.amount ?? 0), 0)
  const firstName = (user?.name ?? user?.full_name ?? 'there').split(' ')[0]

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-800/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-10">

        {/* Header */}
        <div className="animate-slide-up">
          <p className="text-white/30 text-sm mb-1">Customer Dashboard</p>
          <h1 className="text-3xl font-bold gradient-text">Welcome back, {firstName}</h1>
          <p className="text-white/30 text-sm mt-1">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Section 1 — Active Rental */}
            <Section title="Active Rental" icon="🚗" delay="0.05s">
              {activeBooking ? (
                <ActiveRentalCard booking={activeBooking} />
              ) : (
                <div className="glass rounded-2xl border border-white/10 p-8 text-center">
                  <p className="text-white/30 text-sm mb-4">No active rental right now.</p>
                  <Link to="/vehicles" className="btn-gradient text-sm px-6 py-2.5 rounded-xl font-semibold">
                    Browse Vehicles
                  </Link>
                </div>
              )}
            </Section>

            {/* Section 2 — Pending Payments */}
            {approvedBookings.length > 0 && (
              <Section title="Pending Payments" icon="💳" delay="0.1s">
                <div className="space-y-3">
                  {approvedBookings.map(b => (
                    <PendingPaymentCard key={b.id} booking={b} />
                  ))}
                </div>
              </Section>
            )}

            {/* Section 3 — Pending Fines */}
            {pendingFines.length > 0 && (
              <Section title="Outstanding Fines" icon="⚠️" delay="0.15s">
                <div className="glass rounded-2xl border border-red-500/20 p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {pendingFines.length} unpaid {pendingFines.length === 1 ? 'fine' : 'fines'}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        Please settle your outstanding fines to avoid further charges.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <p className="text-red-400 font-bold text-xl">₹{pendingFinesTotal.toFixed(0)}</p>
                      <Link
                        to="/fines"
                        className="text-xs px-5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200 whitespace-nowrap"
                      >
                        View Fines →
                      </Link>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* All clear state */}
            {!activeBooking && approvedBookings.length === 0 && pendingFines.length === 0 && (
              <div className="glass rounded-2xl border border-white/10 p-12 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-5xl mb-4">✅</div>
                <p className="text-white font-semibold mb-1">You're all clear!</p>
                <p className="text-white/30 text-sm mb-6">No active rentals, pending payments, or outstanding fines.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/vehicles" className="btn-gradient text-sm px-6 py-2.5 rounded-xl font-semibold">
                    Browse Vehicles
                  </Link>
                  <Link to="/bookings" className="glass border border-white/10 text-white/50 hover:text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-all duration-200">
                    My Bookings
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <Section title="Quick Access" icon="⚡" delay="0.2s">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { to: '/bookings',         icon: '📋', label: 'My Bookings'  },
                  { to: '/payments',         icon: '💳', label: 'Payments'     },
                  { to: '/invoices',         icon: '🧾', label: 'Invoices'     },
                  { to: '/fines',            icon: '⚠️', label: 'Fines'        },
                ].map(({ to, icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="glass rounded-xl border border-white/10 p-4 flex flex-col items-center gap-2 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                    <span className="text-white/50 group-hover:text-white text-xs font-medium transition-colors duration-200">{label}</span>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
