import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVehicle } from '../../api/vehiclesApi'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'

import { CATEGORY_GRADIENT } from '../../constants'

const Spec = ({ label, value }) => (
  <div className="glass rounded-xl p-4 border border-white/10 flex flex-col gap-1">
    <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">{label}</span>
    <span className="text-white font-medium capitalize">{value ?? '—'}</span>
  </div>
)

export default function VehicleDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getVehicle(id)
      .then(res => setVehicle(res.data))
      .catch(() => setError('Vehicle not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = () => {
    if (!token) navigate('/login')
    else navigate(`/book/${id}`)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (error || !vehicle) return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-lg">{error || 'Vehicle not found.'}</p>
      <Link to="/vehicles" className="text-violet-400 hover:text-fuchsia-400 transition-colors">← Back to vehicles</Link>
    </div>
  )

  const gradient = CATEGORY_GRADIENT[vehicle.category?.toLowerCase()] ?? 'from-violet-600 to-fuchsia-500'

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Hero image / banner */}
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {vehicle.image_url ? (
          <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-40 h-40 text-white/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/20 to-transparent" />

        {/* Back button */}
        <Link
          to="/vehicles"
          className="absolute top-5 left-5 glass border border-white/10 px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10 pb-16">
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {vehicle.category}
              </span>
              <StatusBadge status={vehicle.status} />
            </div>
            <h1 className="text-4xl font-bold text-white">
              {vehicle.make} {vehicle.model}
              <span className="text-white/30 text-2xl font-normal ml-2">({vehicle.year})</span>
            </h1>
            {vehicle.license_plate && (
              <p className="text-white/30 text-sm mt-1 font-mono">{vehicle.license_plate}</p>
            )}
          </div>

          {/* Pricing + CTA */}
          <div className="glass rounded-2xl border border-white/10 p-6 min-w-[220px] text-center shrink-0">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Daily Rate</p>
            <p className="gradient-text text-4xl font-bold">${Number(vehicle.daily_rate).toFixed(0)}</p>
            <p className="text-white/20 text-xs mb-4">/day</p>
            <button
              onClick={handleBook}
              disabled={vehicle.status !== 'available'}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${vehicle.status === 'available'
                  ? 'btn-gradient'
                  : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                }`}
            >
              {vehicle.status === 'available' ? '🚗 Book Now' : 'Not Available'}
            </button>
            {!token && vehicle.status === 'available' && (
              <p className="text-white/20 text-xs mt-2">You&apos;ll be prompted to sign in</p>
            )}
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Spec label="Make" value={vehicle.make} />
          <Spec label="Model" value={vehicle.model} />
          <Spec label="Year" value={vehicle.year} />
          <Spec label="Category" value={vehicle.category} />
          <Spec label="Fuel Type" value={vehicle.fuel_type} />
          <Spec label="Transmission" value={vehicle.transmission} />
          <Spec label="Seats" value={vehicle.seats} />
          <Spec label="Color" value={vehicle.color} />
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">About this vehicle</h2>
            <p className="text-white/70 leading-relaxed">{vehicle.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
