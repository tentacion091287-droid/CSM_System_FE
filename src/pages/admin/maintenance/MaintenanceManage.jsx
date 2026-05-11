import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMaintenances, cancelMaintenance, completeMaintenance,
} from '../../../api/maintenanceApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import StatusBadge from '../../../components/common/StatusBadge'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'
import { useToast } from '../../../context/ToastContext'

import { MAINTENANCE_STATUSES as STATUSES } from '../../../constants'
import { fmt } from '../../../utils/format'

function CompleteModal({ open, record, onClose, onDone }) {
  const [completedDate, setCompletedDate] = useState('')
  const [cost, setCost] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setCompletedDate(format(new Date(), 'yyyy-MM-dd'))
      setCost(record?.cost != null ? String(record.cost) : '')
    }
  }, [open, record])

  if (!open) return null

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {}
      if (completedDate) payload.completed_date = completedDate
      if (cost) payload.cost = Number(cost)
      await completeMaintenance(record.id, payload)
      onDone()
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl shadow-black/60 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-1">Complete Maintenance</h3>
        <p className="text-white/40 text-sm mb-5">Record completion details</p>
        <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Completed Date</label>
        <input type="date" value={completedDate} onChange={e => setCompletedDate(e.target.value)} className="input-exotic mb-4" />
        <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Final Cost ($) — optional</label>
        <input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" className="input-exotic mb-5" />
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-40">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MaintenanceManage() {
  const toast = useToast()
  const [records,         setRecords]         = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [page,            setPage]            = useState(1)
  const [pages,           setPages]           = useState(1)
  const [total,           setTotal]           = useState(0)
  const [search,          setSearch]          = useState('')
  const [status,          setStatus]          = useState('')
  const [confirm,         setConfirm]         = useState(null)
  const [acting,          setActing]          = useState(false)
  const [completeTarget,  setCompleteTarget]  = useState(null)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getMaintenances({ page: pg, size: 15, search: search || undefined, status: status || undefined })
      const data = res.data
      setRecords(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load maintenance records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, status])

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

  const promptCancel = (m) => setConfirm({
    title: 'Cancel Maintenance',
    message: `Cancel scheduled maintenance for ${m.vehicle?.make} ${m.vehicle?.model}? This cannot be undone.`,
    confirmLabel: 'Cancel Maintenance',
    danger: true,
    successMsg: 'Maintenance cancelled',
    errorMsg: 'Failed to cancel maintenance',
    action: () => cancelMaintenance(m.id),
  })

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Maintenance Management</h1>
          </div>
          <Link to="/admin/maintenance/new" className="btn-gradient px-5 py-2.5 text-sm font-semibold">
            + Schedule
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by vehicle..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }} className="input-exotic pl-10" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input-exotic sm:w-44">
            {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Statuses'}</option>)}
          </select>
        </div>

        {!loading && total > 0 && (
          <p className="text-white/20 text-sm mb-4 animate-fade-in">{total} records total</p>
        )}

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-white/30 text-lg">No maintenance records.</p>
            <Link to="/admin/maintenance/new" className="inline-block mt-6 btn-gradient px-6 py-2.5 text-sm font-semibold">
              + Schedule First
            </Link>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden lg:grid grid-cols-[2fr_1.5fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['Vehicle', 'Type', 'Scheduled', 'Status', 'Cost', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>

              {records.map((m, i) => (
                <div key={m.id}
                  className="flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_auto_auto_auto_auto] gap-2 lg:gap-4 items-start lg:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-sm shrink-0">
                      🔧
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {m.vehicle?.make} {m.vehicle?.model}
                      </p>
                      <p className="text-white/30 text-xs">{m.performed_by ?? ''}</p>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm capitalize truncate">
                    {(m.type ?? m.maintenance_type ?? '—').replace('_', ' ')}
                  </p>

                  <p className="text-white/30 text-xs">{fmt(m.scheduled_date)}</p>

                  <StatusBadge status={m.status ?? 'scheduled'} />

                  <p className="text-amber-400/80 text-sm font-medium">
                    {m.cost != null ? `₹${Number(m.cost).toFixed(0)}` : '—'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {(m.status === 'scheduled' || m.status === 'in_progress') && (
                      <Link
                        to={`/admin/maintenance/${m.id}/edit`}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-medium transition-all duration-200"
                      >
                        Edit
                      </Link>
                    )}
                    {(m.status === 'scheduled' || m.status === 'in_progress') && (
                      <button
                        onClick={() => setCompleteTarget(m)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-medium transition-all duration-200"
                      >
                        Complete
                      </button>
                    )}
                    {m.status === 'scheduled' && (
                      <button
                        onClick={() => promptCancel(m)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200"
                      >
                        Cancel
                      </button>
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

      <CompleteModal
        open={!!completeTarget}
        record={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onDone={() => { setCompleteTarget(null); toast.success('Maintenance marked complete'); load(page) }}
      />
    </div>
  )
}
