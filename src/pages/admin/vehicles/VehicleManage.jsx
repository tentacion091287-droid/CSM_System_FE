import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVehicles, deleteVehicle, updateVehicleStatus } from '../../../api/vehiclesApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import StatusBadge from '../../../components/common/StatusBadge'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'
import { useToast } from '../../../context/ToastContext'

import { VEHICLE_CATEGORIES_WITH_ALL as CATEGORIES, VEHICLE_STATUSES as STATUSES } from '../../../constants'

export default function VehicleManage() {
  const toast = useToast()
  const [vehicles,  setVehicles]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [page,      setPage]      = useState(1)
  const [pages,     setPages]     = useState(1)
  const [total,     setTotal]     = useState(0)
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [status,    setStatus]    = useState('')
  const [confirm,   setConfirm]   = useState(null)
  const [acting,    setActing]    = useState(false)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getVehicles({ page: pg, size: 15, search: search || undefined, category: category || undefined, status: status || undefined })
      const data = res.data
      setVehicles(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, category, status])

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

  const promptDelete = (v) => setConfirm({
    title: 'Delete Vehicle',
    message: `Permanently delete ${v.make} ${v.model}? This cannot be undone.`,
    confirmLabel: 'Delete',
    danger: true,
    successMsg: `${v.make} ${v.model} deleted`,
    errorMsg: 'Failed to delete vehicle',
    action: () => deleteVehicle(v.id),
  })

  const promptStatusChange = (v) => {
    const cycle = { available: 'maintenance', maintenance: 'available', booked: 'available' }
    const next = cycle[v.status] ?? 'available'
    setConfirm({
      title: 'Change Vehicle Status',
      message: `Change ${v.make} ${v.model} from "${v.status}" to "${next}"?`,
      confirmLabel: 'Change',
      danger: false,
      successMsg: 'Vehicle status updated',
      errorMsg: 'Failed to update status',
      action: () => updateVehicleStatus(v.id, { status: next }),
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Vehicle Management</h1>
          </div>
          <Link to="/admin/vehicles/new" className="btn-gradient px-5 py-2.5 text-sm font-semibold">
            + Add Vehicle
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by make or model..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-exotic pl-10"
            />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} className="input-exotic sm:w-44">
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories'}</option>
            ))}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input-exotic sm:w-44">
            {STATUSES.map(s => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
            ))}
          </select>
        </div>

        {!loading && total > 0 && (
          <p className="text-white/20 text-sm mb-4 animate-fade-in">{total} vehicles total</p>
        )}

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-white/30 text-lg">No vehicles found.</p>
            <Link to="/admin/vehicles/new" className="inline-block mt-6 btn-gradient px-6 py-2.5 text-sm font-semibold">
              + Add First Vehicle
            </Link>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['Vehicle', 'Category', 'Plate', 'Rate/day', 'Status', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>

              {vehicles.map((v, i) => (
                <div
                  key={v.id}
                  className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-2 lg:gap-4 items-start lg:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600/20 to-sky-600/20 border border-cyan-500/20 flex items-center justify-center text-xl shrink-0">
                      🚗
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{v.make} {v.model}</p>
                      <p className="text-white/30 text-xs">{v.year ?? ''}</p>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm capitalize">{v.category ?? v.type ?? '—'}</p>
                  <p className="text-white/40 text-sm font-mono">{v.license_plate ?? v.plate ?? '—'}</p>
                  <p className="gradient-text font-bold text-sm">
                    {v.price_per_day != null ? `$${Number(v.price_per_day).toFixed(0)}/day` : '—'}
                  </p>
                  <StatusBadge status={v.status ?? 'available'} />
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/admin/vehicles/${v.id}/edit`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-medium transition-all duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => promptStatusChange(v)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/10 font-medium transition-all duration-200"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => promptDelete(v)}
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
