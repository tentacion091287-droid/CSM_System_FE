import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  getAllBookings, approveBooking, rejectBooking,
  activateBooking, completeBooking, assignDriver,
} from '../../../api/bookingsApi'
import { getDrivers } from '../../../api/driversApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import StatusBadge from '../../../components/common/StatusBadge'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'
import { useToast } from '../../../context/ToastContext'
import { BOOKING_STATUSES as STATUSES } from '../../../constants'
import { fmt } from '../../../utils/format'

function AssignDriverModal({ open, booking, onClose, onDone }) {
  const [drivers,    setDrivers]    = useState([])
  const [driverId,   setDriverId]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [fetching,   setFetching]   = useState(true)

  useEffect(() => {
    if (!open) return
    setFetching(true)
    getDrivers({ is_available: true, size: 100 })
      .then(r => {
        const d = r.data
        setDrivers(Array.isArray(d) ? d : d.items ?? [])
      })
      .catch(() => setDrivers([]))
      .finally(() => setFetching(false))
    setDriverId(booking?.driver_id ? String(booking.driver_id) : '')
  }, [open, booking])

  if (!open) return null

  const handleActivate = async () => {
    setLoading(true)
    try {
      if (driverId) await assignDriver(booking.id, { driver_id: driverId })
      await activateBooking(booking.id)
      onDone()
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-1">Activate Booking</h3>
        <p className="text-white/40 text-sm mb-5">
          Booking #{String(booking?.id ?? '').padStart(5, '0')} — optionally assign a driver
        </p>

        {fetching ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <select
            value={driverId}
            onChange={e => setDriverId(e.target.value)}
            className="input-exotic mb-5"
          >
            <option value="">No driver</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.license_number ?? d.license ?? ''}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40">
            Cancel
          </button>
          <button onClick={handleActivate} disabled={loading || fetching}
            className="flex-1 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Spinner size="sm" /> : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CompleteModal({ open, booking, onClose, onDone }) {
  const [returnDate, setReturnDate] = useState('')
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    if (open) setReturnDate(format(new Date(), 'yyyy-MM-dd'))
  }, [open])

  if (!open) return null

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeBooking(booking.id, { actual_return: returnDate })
      onDone()
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-1">Complete Booking</h3>
        <p className="text-white/40 text-sm mb-5">
          Booking #{String(booking?.id ?? '').padStart(5, '0')} — set actual return date
        </p>
        <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Actual Return Date</label>
        <input
          type="date"
          value={returnDate}
          onChange={e => setReturnDate(e.target.value)}
          className="input-exotic mb-5"
        />
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40">
            Cancel
          </button>
          <button onClick={handleComplete} disabled={loading}
            className="flex-1 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Spinner size="sm" /> : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookingManage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [bookings,     setBookings]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [page,         setPage]         = useState(1)
  const [pages,        setPages]        = useState(1)
  const [total,        setTotal]        = useState(0)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirm,      setConfirm]      = useState(null)
  const [acting,       setActing]       = useState(false)
  const [assignTarget, setAssignTarget] = useState(null)
  const [completeTarget, setCompleteTarget] = useState(null)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getAllBookings({ page: pg, size: 15, search: search || undefined, status: statusFilter || undefined })
      const data = res.data
      setBookings(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, statusFilter])

  const handleConfirm = async () => {
    setActing(true)
    try {
      await confirm.action()
      toast.success(confirm.successMsg ?? 'Done')
      setConfirm(null)
      load(page)
    } catch {
      toast.error(confirm.errorMsg ?? 'Action failed')
      setConfirm(null)
    } finally { setActing(false) }
  }

  const promptApprove = (b) => setConfirm({
    title: 'Approve Booking',
    message: `Approve booking #${String(b.id).padStart(5, '0')} for ${b.customer?.name ?? b.user?.name ?? '—'}?`,
    confirmLabel: 'Approve',
    danger: false,
    successMsg: 'Booking approved',
    errorMsg: 'Failed to approve booking',
    action: () => approveBooking(b.id),
  })

  const promptReject = (b) => setConfirm({
    title: 'Reject Booking',
    message: `Reject booking #${String(b.id).padStart(5, '0')}? This action cannot be undone.`,
    confirmLabel: 'Reject',
    danger: true,
    successMsg: 'Booking rejected',
    errorMsg: 'Failed to reject booking',
    action: () => rejectBooking(b.id, {}),
  })

  const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Booking Management</h1>
          </div>
          {!loading && total > 0 && (
            <p className="text-white/20 text-sm">{total} bookings total</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by customer name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-exotic pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="input-exotic sm:w-44"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white/30 text-lg">No bookings found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden lg:grid grid-cols-[auto_2fr_2fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['#', 'Customer', 'Vehicle', 'Status', 'Dates', 'Amount', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>

              {bookings.map((b, i) => (
                <div
                  key={b.id}
                  className="flex flex-col lg:grid lg:grid-cols-[auto_2fr_2fr_auto_auto_auto_auto] gap-2 lg:gap-4 items-start lg:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => navigate(`/admin/bookings/${b.id}`)}
                >
                  <span className="text-white/25 text-xs font-mono">#{String(b.id).padStart(5, '0')}</span>

                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.customer?.name ?? b.user?.name ?? '—'}</p>
                    <p className="text-white/30 text-xs truncate">{b.customer?.email ?? b.user?.email ?? ''}</p>
                  </div>

                  <p className="text-white/50 text-sm truncate">
                    {b.vehicle?.make} {b.vehicle?.model} {b.vehicle?.year ? `(${b.vehicle.year})` : ''}
                  </p>

                  <StatusBadge status={b.status} />

                  <div className="text-white/30 text-xs">
                    <p>{fmt(b.start_date)}</p>
                    <p>→ {fmt(b.end_date)}</p>
                  </div>

                  {b.total_cost != null
                    ? <p className="gradient-text font-bold text-sm">${Number(b.total_cost).toFixed(0)}</p>
                    : <span />
                  }

                  {/* Action buttons — stop propagation so click doesn't navigate */}
                  <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => promptApprove(b)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-medium transition-all duration-200"
                        >Approve</button>
                        <button
                          onClick={() => promptReject(b)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200"
                        >Reject</button>
                      </>
                    )}
                    {b.status === 'approved' && (
                      <button
                        onClick={() => setAssignTarget(b)}
                        className="text-xs px-3 py-1.5 rounded-lg btn-gradient font-medium"
                      >Activate</button>
                    )}
                    {b.status === 'active' && (
                      <button
                        onClick={() => setCompleteTarget(b)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/30 font-medium transition-all duration-200"
                      >Complete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>

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

      <AssignDriverModal
        open={!!assignTarget}
        booking={assignTarget}
        onClose={() => setAssignTarget(null)}
        onDone={() => { setAssignTarget(null); toast.success('Booking activated'); load(page) }}
      />

      <CompleteModal
        open={!!completeTarget}
        booking={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onDone={() => { setCompleteTarget(null); toast.success('Booking completed'); load(page) }}
      />
    </div>
  )
}
