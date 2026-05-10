import { useEffect, useState } from 'react'
import { getAllPayments, processPayment } from '../../../api/paymentsApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import StatusBadge from '../../../components/common/StatusBadge'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'
import { useToast } from '../../../context/ToastContext'

import { PAYMENT_STATUSES as STATUSES, PAYMENT_METHOD_LABEL as METHOD_LABEL } from '../../../constants'
import { fmt } from '../../../utils/format'

export default function PaymentManage() {
  const toast = useToast()
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [confirm,  setConfirm]  = useState(null)
  const [acting,   setActing]   = useState(false)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getAllPayments({ page: pg, size: 15, search: search || undefined, status: status || undefined })
      const data = res.data
      setPayments(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load payments.')
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

  const promptVerify = (p) => setConfirm({
    title: 'Verify Payment',
    message: `Mark payment #${String(p.id).padStart(5, '0')} ($${Number(p.amount).toFixed(0)}) as verified?`,
    confirmLabel: 'Verify',
    danger: false,
    successMsg: 'Payment verified',
    errorMsg: 'Failed to verify payment',
    action: () => processPayment(p.id),
  })

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Payment Management</h1>
          </div>
          {!loading && total > 0 && <p className="text-white/20 text-sm">{total} payments total</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by customer..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }} className="input-exotic pl-10" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input-exotic sm:w-40">
            {STATUSES.map(s => <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-white/30 text-lg">No payments found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden md:grid grid-cols-[auto_2fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['Payment #', 'Customer', 'Booking', 'Method', 'Amount', 'Status', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>
              {payments.map((p, i) => (
                <div key={p.id}
                  className="flex flex-col md:grid md:grid-cols-[auto_2fr_auto_auto_auto_auto_auto] gap-2 md:gap-4 items-start md:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <span className="text-white/25 text-xs font-mono">#{String(p.id).padStart(5, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.customer?.name ?? p.user?.name ?? '—'}</p>
                    <p className="text-white/30 text-xs">{fmt(p.created_at)}</p>
                  </div>
                  <span className="text-white/30 text-xs font-mono">
                    {p.booking_id ? `#${String(p.booking_id).padStart(5, '0')}` : '—'}
                  </span>
                  <span className="text-white/40 text-xs capitalize">
                    {METHOD_LABEL[p.payment_method] ?? p.payment_method ?? '—'}
                  </span>
                  <p className="gradient-text font-bold text-sm">
                    ${Number(p.amount ?? 0).toFixed(0)}
                  </p>
                  <StatusBadge status={p.status ?? 'pending'} />
                  <div>
                    {p.status === 'pending' && (
                      <button
                        onClick={() => promptVerify(p)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-medium transition-all duration-200"
                      >
                        Verify
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
    </div>
  )
}
