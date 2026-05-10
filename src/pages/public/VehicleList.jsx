import { useState, useEffect, useCallback } from 'react'
import { getVehicles } from '../../api/vehiclesApi'
import VehicleCard from '../../components/vehicles/VehicleCard'
import VehicleFilter from '../../components/vehicles/VehicleFilter'
import Spinner from '../../components/common/Spinner'
import Pagination from '../../components/common/Pagination'

const EMPTY_FILTERS = { category: '', date_from: '', date_to: '' }

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetch = useCallback(async (currentFilters, currentPage) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: currentPage, size: 12, ...currentFilters }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await getVehicles(params)
      const data = res.data
      setVehicles(Array.isArray(data) ? data : data.items ?? [])
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
      setPages(data.pages ?? 1)
    } catch {
      setError('Failed to load vehicles. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch(filters, page) }, [page])

  const handleSearch = () => { setPage(1); fetch(filters, 1) }
  const handlePage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text mb-2">Browse Vehicles</h1>
          <p className="text-white/40">
            {total > 0 ? `${total} vehicle${total !== 1 ? 's' : ''} available` : 'Find your perfect ride'}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <VehicleFilter filters={filters} onChange={setFilters} onSearch={handleSearch} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => fetch(filters, page)} className="btn-gradient px-6 py-2.5 text-sm">
              Retry
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-white/40 text-lg">No vehicles found for your filters.</p>
            <button
              onClick={() => { setFilters(EMPTY_FILTERS); handleSearch() }}
              className="mt-4 text-violet-400 hover:text-fuchsia-400 text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map((v, i) => (
                <div key={v.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={handlePage} />
          </>
        )}
      </div>
    </div>
  )
}
