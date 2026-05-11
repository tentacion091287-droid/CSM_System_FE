import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getMyInvoices } from '../../api/invoicesApi'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

function InvoiceRow({ invoice }) {
  const { id, booking, amount, status, issued_date, due_date } = invoice
  return (
    <div className="group glass rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
      <div className="flex items-stretch">
        <div className={`w-1.5 shrink-0 bg-gradient-to-b
          ${status === 'paid'   ? 'from-emerald-500 to-teal-400' : ''}
          ${status === 'unpaid' ? 'from-amber-500 to-yellow-400' : ''}
        `} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/20 flex items-center justify-center text-lg">
                🧾
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Invoice #{String(id).padStart(5, '0')}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {booking?.vehicle?.make} {booking?.vehicle?.model}
                  {issued_date && <> · {format(new Date(issued_date), 'dd MMM yyyy')}</>}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="gradient-text text-xl font-bold">₹{Number(amount).toFixed(2)}</p>
              <div className="mt-1 flex justify-end">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          {due_date && status === 'unpaid' && (
            <p className="text-amber-400/70 text-xs mt-2">
              Due: {format(new Date(due_date), 'dd MMM yyyy')}
            </p>
          )}

          {booking && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-white/20 text-xs font-mono">Booking #{String(booking.id).padStart(5, '0')}</span>
              <Link
                to={`/invoices/${id}`}
                className="text-xs text-violet-400 hover:text-fuchsia-400 transition-colors font-medium"
              >
                View Invoice →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getMyInvoices({ page: pg, size: 10 })
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

  useEffect(() => { load(page) }, [page])

  const totalPaid   = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0)
  const totalUnpaid = invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + Number(i.amount), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">My Account</p>
          <h1 className="text-3xl font-bold gradient-text">My Invoices</h1>
        </div>

        {!loading && invoices.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            {[
              { label: 'Total',  value: total,       fmt: (v) => `${v}` },
              { label: 'Paid',   value: totalPaid,   fmt: (v) => `₹${v.toFixed(0)}` },
              { label: 'Unpaid', value: totalUnpaid, fmt: (v) => `₹${v.toFixed(0)}` },
            ].map(({ label, value, fmt }) => (
              <div key={label} className="glass rounded-2xl border border-white/10 p-4 text-center">
                <p className={`text-2xl font-bold ${label === 'Unpaid' && totalUnpaid > 0 ? 'text-amber-400' : 'gradient-text'}`}>
                  {fmt(value)}
                </p>
                <p className="text-white/20 text-xs mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        )}

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
            <p className="text-white/30 text-lg mb-2">No invoices yet.</p>
            <Link to="/bookings" className="text-violet-400 hover:text-fuchsia-400 text-sm transition-colors">
              View my bookings →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {invoices.map((inv, i) => (
                <div key={inv.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <InvoiceRow invoice={inv} />
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
