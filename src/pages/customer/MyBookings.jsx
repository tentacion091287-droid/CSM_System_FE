import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings } from '../../api/bookingsApi'
import BookingCard from '../../components/bookings/BookingCard'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

import { BOOKING_STATUS_TABS as STATUS_TABS } from '../../constants'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [tab, setTab]           = useState('all')
  const [page, setPage]         = useState(1)
  const [pages, setPages]       = useState(1)

  const load = async (status, pg) => {
    setLoading(true); setError('')
    try {
      const params = { page: pg, size: 10, ...(status !== 'all' && { status }) }
      const res = await getMyBookings(params)
      const data = res.data
      setBookings(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(tab, page) }, [tab, page])

  const handleTab = (t) => { setTab(t); setPage(1) }

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">My Account</p>
            <h1 className="text-3xl font-bold gradient-text">My Bookings</h1>
          </div>
          <Link to="/vehicles" className="btn-gradient px-5 py-2.5 text-sm flex items-center gap-2">
            <span>+</span> New Booking
          </Link>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {STATUS_TABS.map(s => (
            <button
              key={s}
              onClick={() => handleTab(s)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border
                ${tab === s
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-lg shadow-violet-500/30'
                  : 'glass border-white/10 text-white/40 hover:text-white hover:border-violet-500/30'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(tab, page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-white/30 text-lg mb-2">No {tab !== 'all' ? tab : ''} bookings found.</p>
            <Link to="/vehicles" className="text-violet-400 hover:text-fuchsia-400 text-sm transition-colors">Browse vehicles →</Link>
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
