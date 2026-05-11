import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { getAllInvoices } from '../../../api/invoicesApi'
import StatusBadge from '../../../components/common/StatusBadge'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'

const fmt = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'
const STATUSES = ['', 'paid', 'unpaid']

export default function InvoiceManage() {
  const [invoices, setInvoices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getAllInvoices({ page: pg, size: 15, search: search || undefined, status: status || undefined })
      const data = res.data
      setInvoices(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load invoices.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, status])

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">Invoice Management</h1>
          </div>
          {!loading && total > 0 && <p className="text-white/20 text-sm">{total} invoices total</p>}
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
        ) : invoices.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🧾</div>
            <p className="text-white/30 text-lg">No invoices found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="hidden md:grid grid-cols-[auto_2fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['Invoice #', 'Customer', 'Booking', 'Amount', 'Status', 'Issued'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>
              {invoices.map((inv, i) => (
                <div key={inv.id}
                  className="flex flex-col md:grid md:grid-cols-[auto_2fr_auto_auto_auto_auto] gap-2 md:gap-4 items-start md:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <span className="text-white/25 text-xs font-mono">#{String(inv.id).padStart(5, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{inv.customer?.name ?? inv.user?.name ?? '—'}</p>
                    <p className="text-white/30 text-xs truncate">{inv.customer?.email ?? inv.user?.email ?? ''}</p>
                  </div>
                  <span className="text-white/30 text-xs font-mono">
                    {inv.booking_id ? `#${String(inv.booking_id).padStart(5, '0')}` : '—'}
                  </span>
                  <p className={`font-bold text-sm ${inv.status === 'paid' ? 'text-emerald-400' : 'gradient-text'}`}>
                    ₹{Number(inv.amount ?? inv.total_amount ?? 0).toFixed(0)}
                  </p>
                  <StatusBadge status={inv.status ?? 'unpaid'} />
                  <p className="text-white/25 text-xs">{fmt(inv.issued_date ?? inv.created_at)}</p>
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
