import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getDashboard } from '../../api/dashboardApi'
import { getAllBookings } from '../../api/bookingsApi'
import { getAllFines } from '../../api/finesApi'
import { getMaintenances } from '../../api/maintenanceApi'
import StatCard from '../../components/dashboard/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import VehicleStatusChart from '../../components/dashboard/VehicleStatusChart'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'
import { fmt } from '../../utils/format'

function SectionCard({ title, sub, icon, linkTo, linkLabel, children }) {
  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <div>
            <p className="text-white font-semibold text-sm">{title}</p>
            {sub && <p className="text-white/30 text-xs">{sub}</p>}
          </div>
        </div>
        {linkTo && (
          <Link to={linkTo} className="text-xs text-violet-400 hover:text-fuchsia-400 transition-colors font-medium">
            {linkLabel ?? 'View all →'}
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

export default function AdminDashboard() {
  const [dash,           setDash]           = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [pendingFines,   setPendingFines]   = useState([])
  const [upcomingMaint,  setUpcomingMaint]  = useState([])
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    const norm = (d) => Array.isArray(d) ? d : d?.items ?? []
    Promise.allSettled([
      getDashboard(),
      getAllBookings({ page: 1, size: 8 }),
      getAllFines({ status: 'pending', page: 1, size: 5 }),
      getMaintenances({ status: 'scheduled', page: 1, size: 5 }),
    ]).then(([d, rb, pf, um]) => {
      if (d.status  === 'fulfilled') setDash(d.value.data)
      if (rb.status === 'fulfilled') setRecentBookings(norm(rb.value.data))
      if (pf.status === 'fulfilled') setPendingFines(norm(pf.value.data))
      if (um.status === 'fulfilled') setUpcomingMaint(norm(um.value.data))
    }).finally(() => setLoading(false))
  }, [])

  const vehStatus = dash ? [
    { name: 'available',   value: dash.vehicles.available   },
    { name: 'booked',      value: dash.vehicles.booked      },
    { name: 'maintenance', value: dash.vehicles.maintenance },
  ].filter(d => d.value > 0) : []

  const STAT_CARDS = [
    { icon: '📋', label: 'Total Bookings',     value: dash?.bookings?.total     ?? '—', color: 'violet',  sub: 'All time',             delay: 0    },
    { icon: '🚗', label: 'Active Rentals',     value: dash?.bookings?.active    ?? '—', color: 'emerald', sub: 'On road now',           delay: 0.05 },
    { icon: '💰', label: 'Total Revenue',      value: dash?.revenue?.total != null ? `₹${Number(dash.revenue.total).toLocaleString()}` : '—', color: 'blue', sub: 'Verified payments', delay: 0.1 },
    { icon: '✅', label: 'Available Vehicles', value: dash?.vehicles?.available ?? '—', color: 'cyan',    sub: 'Ready to book',         delay: 0.15 },
    { icon: '⏳', label: 'Pending Payments',  value: dash?.payments?.pending   ?? '—', color: 'amber',   sub: 'Awaiting processing',   delay: 0.2  },
    { icon: '⏰', label: 'Pending Bookings',  value: dash?.bookings?.pending   ?? '—', color: 'red',     sub: 'Awaiting approval',     delay: 0.25 },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-10">
      <div className="fixed top-0 right-0 w-[600px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-800/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin Panel</p>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          </div>
          <p className="text-white/20 text-sm hidden sm:block">{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {STAT_CARDS.map(card => <StatCard key={card.label} {...card} />)}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-5 gap-5 mb-8">
          <div className="lg:col-span-3 glass rounded-2xl border border-white/10 p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold text-sm">Monthly Revenue</p>
                <p className="text-white/30 text-xs">Last 6 months</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/20 flex items-center justify-center text-sm">
                📈
              </div>
            </div>
            {dash?.monthly_revenue?.length > 0
              ? <RevenueChart data={dash.monthly_revenue} />
              : <div className="h-[220px] flex items-center justify-center text-white/20 text-sm">No revenue data yet</div>
            }
          </div>

          <div className="lg:col-span-2 glass rounded-2xl border border-white/10 p-5 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold text-sm">Vehicle Status</p>
                <p className="text-white/30 text-xs">Fleet overview</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600/30 to-sky-600/30 border border-cyan-500/20 flex items-center justify-center text-sm">
                🚗
              </div>
            </div>
            {vehStatus.length > 0
              ? <VehicleStatusChart data={vehStatus} />
              : <div className="h-[220px] flex items-center justify-center text-white/20 text-sm">No data</div>
            }
          </div>
        </div>

        {/* Recent bookings */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <SectionCard title="Recent Bookings" sub="Latest activity" icon="📋" linkTo="/admin/bookings" linkLabel="View all →">
            {recentBookings.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-10">No recent bookings</p>
            ) : (
              <div>
                <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-5 py-2.5 bg-white/3 border-b border-white/5">
                  {['#', 'Customer', 'Vehicle', 'Status', 'Date', 'Amount'].map(h => (
                    <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                  ))}
                </div>
                <div className="divide-y divide-white/5">
                  {recentBookings.slice(0, 8).map(b => (
                    <Link
                      key={b.id}
                      to={`/admin/bookings/${b.id}`}
                      className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 items-start sm:items-center px-5 py-3.5 hover:bg-white/3 transition-colors"
                    >
                      <span className="text-white/20 text-xs font-mono">#{String(b.id).slice(0, 8)}</span>
                      <p className="text-white text-sm truncate">{b.customer?.name ?? b.user?.name ?? '—'}</p>
                      <p className="text-white/40 text-sm truncate">{b.vehicle?.make} {b.vehicle?.model}</p>
                      <StatusBadge status={b.status} />
                      <p className="text-white/30 text-xs">{fmt(b.created_at)}</p>
                      {b.total_cost != null
                        ? <p className="gradient-text font-bold text-sm">₹{Number(b.total_cost).toFixed(0)}</p>
                        : <span />
                      }
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Pending fines + Upcoming maintenance */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="animate-slide-up" style={{ animationDelay: '0.45s' }}>
            <SectionCard title="Pending Fines" sub="Awaiting payment" icon="⚠️" linkTo="/admin/fines" linkLabel="View all →">
              {pendingFines.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-10">No pending fines 🎉</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {pendingFines.slice(0, 5).map(f => (
                    <div key={f.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate">{f.customer?.name ?? f.user?.name ?? '—'}</p>
                        <p className="text-white/30 text-xs truncate">{f.reason ?? 'Late return'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-red-400 font-bold text-sm">₹{Number(f.amount ?? f.total_amount ?? 0).toFixed(0)}</p>
                        {f.overdue_days != null && (
                          <p className="text-white/20 text-xs">{f.overdue_days}d overdue</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <SectionCard title="Upcoming Maintenance" sub="Scheduled services" icon="🔧" linkTo="/admin/maintenance" linkLabel="View all →">
              {upcomingMaint.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-10">No upcoming maintenance</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {upcomingMaint.slice(0, 5).map(m => (
                    <div key={m.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate">{m.vehicle?.make} {m.vehicle?.model}</p>
                        <p className="text-white/30 text-xs capitalize truncate">{m.type ?? m.maintenance_type ?? '—'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-amber-400 text-sm font-medium">{fmt(m.scheduled_date)}</p>
                        {m.cost != null && (
                          <p className="text-white/20 text-xs">₹{Number(m.cost).toFixed(0)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
