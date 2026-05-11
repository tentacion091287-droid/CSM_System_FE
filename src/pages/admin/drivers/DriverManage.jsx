import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDrivers, deleteDriver, toggleDriverAvailability } from '../../../api/driversApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import Select from '../../../components/common/Select'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'

const initials = (name) =>
  name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '??'

function StarRow({ rating }) {
  const r = Number(rating) || 0
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 20 20" className={`w-3 h-3 ${i <= Math.round(r) ? 'text-amber-400' : 'text-white/15'}`} fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {rating != null && (
        <span className="text-white/30 text-xs ml-1">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  )
}

export default function DriverManage() {
  const [drivers,  setDrivers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)
  const [search,   setSearch]   = useState('')
  const [avail,    setAvail]    = useState('')
  const [confirm,  setConfirm]  = useState(null)
  const [acting,   setActing]   = useState(false)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const params = { page: pg, size: 15, search: search || undefined }
      if (avail !== '') params.is_available = avail === 'true'
      const res  = await getDrivers(params)
      const data = res.data
      setDrivers(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load drivers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, avail])

  const handleConfirm = async () => {
    setActing(true)
    try {
      await confirm.action()
      setConfirm(null)
      load(page)
    } catch { /* ignore */ }
    finally { setActing(false) }
  }

  const promptDelete = (d) => setConfirm({
    title: 'Delete Driver',
    message: `Permanently delete ${d.name}? This cannot be undone.`,
    confirmLabel: 'Delete',
    danger: true,
    action: () => deleteDriver(d.id),
  })

  const promptToggle = (d) => {
    const willAvail = !d.is_available
    setConfirm({
      title: willAvail ? 'Mark Available' : 'Mark Unavailable',
      message: willAvail
        ? `Mark ${d.name} as available for new assignments?`
        : `Mark ${d.name} as unavailable? They won't be assigned to new bookings.`,
      confirmLabel: willAvail ? 'Mark Available' : 'Mark Unavailable',
      danger: false,
      action: () => toggleDriverAvailability(d.id, { is_available: willAvail }),
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Driver Management</h1>
          </div>
          <Link to="/admin/drivers/new" className="btn-gradient px-5 py-2.5 text-sm font-semibold">
            + Add Driver
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or license..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-exotic pl-10"
            />
          </div>
          <Select value={avail} onChange={e => { setAvail(e.target.value); setPage(1) }} className="sm:w-48">
            <option value="">All Drivers</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </Select>
        </div>

        {/* Stats strip */}
        {!loading && total > 0 && (
          <p className="text-white/20 text-sm mb-4 animate-fade-in">{total} drivers total</p>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-white/30 text-lg">No drivers found.</p>
            <Link to="/admin/drivers/new" className="inline-block mt-6 btn-gradient px-6 py-2.5 text-sm font-semibold">
              + Add First Driver
            </Link>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['Driver', 'License', 'Rating', 'Status', 'Trips', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>

              {drivers.map((d, i) => (
                <div
                  key={d.id}
                  className="flex flex-col md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr_auto_auto] gap-2 md:gap-4 items-start md:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20 shrink-0 flex items-center justify-center text-xs font-bold text-white">
                      {initials(d.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{d.name}</p>
                      {d.phone && <p className="text-white/30 text-xs truncate">{d.phone}</p>}
                    </div>
                  </div>

                  {/* License */}
                  <p className="text-white/40 text-sm font-mono truncate">{d.license_number ?? d.license ?? '—'}</p>

                  {/* Rating */}
                  <StarRow rating={d.average_rating} />

                  {/* Availability */}
                  <span className={`self-start md:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold border
                    ${d.is_available
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400/70 border-red-500/15'
                    }`}
                  >
                    {d.is_available ? '● Available' : '● Unavailable'}
                  </span>

                  {/* Total trips */}
                  <p className="text-white/25 text-sm">{d.total_trips ?? d.trips_count ?? '—'}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/admin/drivers/${d.id}/edit`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-medium transition-all duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => promptToggle(d)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200
                        ${d.is_available
                          ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                    >
                      {d.is_available ? 'Unavail.' : 'Avail.'}
                    </button>
                    <button
                      onClick={() => promptDelete(d)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200"
                    >
                      Delete
                    </button>
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
    </div>
  )
}
