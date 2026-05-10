import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getVehicles } from '../../api/vehiclesApi'
import VehicleCard from '../../components/vehicles/VehicleCard'
import Spinner from '../../components/common/Spinner'

const STATS = [
  { value: '500+', label: 'Vehicles' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Cities' },
  { value: '24/7', label: 'Support' },
]

const CATEGORIES = [
  { name: 'Sedan',  icon: '🚗', gradient: 'from-blue-600 to-cyan-500' },
  { name: 'SUV',    icon: '🚙', gradient: 'from-emerald-600 to-teal-500' },
  { name: 'Luxury', icon: '🏎️', gradient: 'from-yellow-500 to-amber-400' },
  { name: 'Sports', icon: '⚡', gradient: 'from-red-600 to-pink-500' },
  { name: 'Van',    icon: '🚐', gradient: 'from-violet-600 to-purple-500' },
  { name: 'Truck',  icon: '🛻', gradient: 'from-orange-600 to-amber-500' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getVehicles({ size: 4 })
      .then(res => {
        const data = res.data
        setFeatured(Array.isArray(data) ? data.slice(0, 4) : (data.items ?? []).slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a] overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-24">
        {/* Blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-violet-700/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-3xl animate-blob [animation-delay:3s]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-cyan-700/15 rounded-full blur-3xl animate-blob [animation-delay:5s]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 glass border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Premium Car Rental & Service
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-white">Drive Your</span>
            <br />
            <span className="gradient-text">Dream Car</span>
            <br />
            <span className="text-white">Today</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore our fleet of premium vehicles. From city sedans to exotic sports cars —
            the perfect ride for every journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/vehicles" className="btn-gradient px-8 py-4 text-base rounded-2xl flex items-center gap-2">
              Browse Fleet
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/register" className="px-8 py-4 text-base rounded-2xl glass border border-white/10 text-white/70 hover:text-white hover:border-violet-500/40 transition-all duration-300">
              Create Account
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 animate-float">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="gradient-text text-4xl font-extrabold">{value}</p>
              <p className="text-white/30 text-sm mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Browse by Category</h2>
            <p className="text-white/30">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, icon, gradient }) => (
              <button
                key={name}
                onClick={() => navigate(`/vehicles?category=${name.toLowerCase()}`)}
                className="group glass rounded-2xl border border-white/10 hover:border-violet-500/40 p-5 flex flex-col items-center gap-3 transition-all duration-300 card-glow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {icon}
                </div>
                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Vehicles</h2>
              <p className="text-white/30">Hand-picked for you</p>
            </div>
            <Link to="/vehicles" className="text-sm text-violet-400 hover:text-fuchsia-400 transition-colors font-medium flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : featured.length === 0 ? (
            <p className="text-center text-white/30 py-16">No vehicles available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((v, i) => (
                <div key={v.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-[size:300%] animate-gradient-shift" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to Hit the Road?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Sign up today and get access to our full fleet with exclusive member pricing.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
