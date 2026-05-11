import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../../api/bookingsApi'
import BookingCard from '../../components/bookings/BookingCard'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

export default function RentalHistory() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getHistory({ page: pg, size: 10 })
      const data = res.data
      setBookings(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load rental history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const totalSpent = bookings.reduce((s, b) => s + Number(b.total_cost ?? 0), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      {/* bg blobs */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-fuchsia-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">My Account</p>
          <h1 className="text-3xl font-bold gradient-text">Rental History</h1>
          <p className="text-white/20 text-sm mt-1">All your completed rentals in one place</p>
        </div>

        {/* Summary strip */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="glass rounded-2xl border border-white/10 p-5 text-center">
              <p className="gradient-text text-3xl font-bold">{total}</p>
              <p className="text-white/20 text-xs mt-1 uppercase tracking-wider">Completed Rentals</p>
            </div>
            <div className="glass rounded-2xl border border-white/10 p-5 text-center">
              <p className="gradient-text text-3xl font-bold">₹{totalSpent.toFixed(0)}</p>
              <p className="text-white/20 text-xs mt-1 uppercase tracking-wider">Total Spent</p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🏁</div>
            <p className="text-white/30 text-lg mb-2">No completed rentals yet.</p>
            <Link to="/vehicles" className="text-violet-400 hover:text-fuchsia-400 text-sm transition-colors">
              Browse vehicles →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {bookings.map((b, i) => (
                <div key={b.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <BookingCard booking={b} />
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
