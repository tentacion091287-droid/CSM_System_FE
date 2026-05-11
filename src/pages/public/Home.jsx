import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getVehicles } from '../../api/vehiclesApi'
import VehicleCard from '../../components/vehicles/VehicleCard'
import Spinner from '../../components/common/Spinner'
import {
  HOME_STATS as STATS,
  HOME_BRANDS as BRANDS,
  HOME_HOW_IT_WORKS as HOW_IT_WORKS,
  HOME_FLEET as FLEET,
  HOME_TESTIMONIALS as TESTIMONIALS,
  HOME_CATEGORIES as CATEGORIES,
  HOME_PHOTO_STRIP_ROW1,
  HOME_PHOTO_STRIP_ROW2,
  HOME_ACTIVITY,
  HOME_FEATURES,
} from '../../constants'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading]   = useState(true)
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
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 32s linear infinite; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-18px) rotate(1deg); }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }

        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 1; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }

        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-on-hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: none;
        }
        .shimmer-on-hover:hover::after { animation: shimmer-sweep 0.7s ease forwards; }

        @keyframes spin-slow  { to { transform: rotate(360deg); } }
        @keyframes spin-rev   { to { transform: rotate(-360deg); } }
        .spin-slow { animation: spin-slow 22s linear infinite; }
        .spin-rev  { animation: spin-rev  16s linear infinite; }

        .animate-marquee-reverse { animation: marquee 26s linear infinite reverse; }
        .animate-marquee-slow    { animation: marquee 70s linear infinite; }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px 0 rgba(139,92,246,0.15); }
          50%       { box-shadow: 0 0 40px 8px rgba(139,92,246,0.30); }
        }
        .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }

        @keyframes border-spin {
          to { --angle: 360deg; }
        }
      `}</style>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 py-24">
        {/* Background blobs */}
        <div className="absolute top-[-15%] left-[-10%]  w-[700px] h-[700px] bg-violet-700/25  rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-700/20 rounded-full blur-3xl animate-blob [animation-delay:3s]" />
        <div className="absolute top-[30%] left-[35%]   w-[400px] h-[400px] bg-cyan-700/12    rounded-full blur-3xl animate-blob [animation-delay:5s]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 glass border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                Next-Gen Car Rentals ✦ No Cap
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] mb-6">
                <span className="text-white">Drive Your</span>
                <br />
                <span className="gradient-text">Dream Car</span>
                <br />
                <span className="text-white">Today</span>
              </h1>

              <p className="text-white/40 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                Exotic rides, zero hassle. From city cruisers to weekend supercars —
                the perfect drip for every journey.
              </p>

              {/* Live indicator */}
              <div className="flex items-center gap-3 mb-10">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-emerald-500/50 animate-pulse-ring" />
                  <span className="relative w-2 h-2 bg-emerald-400 rounded-full" />
                </div>
                <span className="text-emerald-400/80 text-sm font-medium">47 vehicles available right now</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/vehicles" className="btn-gradient px-8 py-4 text-base rounded-2xl flex items-center gap-2">
                  Browse Fleet
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/register" className="px-8 py-4 text-base rounded-2xl glass border border-white/10 text-white/70 hover:text-white hover:border-violet-500/40 transition-all duration-300">
                  Join for Free
                </Link>
              </div>

              {/* Mini stats row */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
                {[['500+', 'Vehicles'], ['10K+', 'Customers'], ['4.9★', 'Rating']].map(([v, l]) => (
                  <div key={l}>
                    <p className="gradient-text font-bold text-xl">{v}</p>
                    <p className="text-white/25 text-xs mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Car image + floating UI */}
            <div className="hidden lg:flex items-center justify-center relative" style={{ animationDelay: '0.2s' }}>
              {/* Rotating rings */}
              <div className="absolute w-[480px] h-[480px] rounded-full border border-violet-500/10 spin-slow" />
              <div className="absolute w-[380px] h-[380px] rounded-full border border-fuchsia-500/10 spin-rev" />
              <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-500/8 spin-slow" style={{ animationDuration: '30s' }} />

              {/* Main car card */}
              <div className="relative animate-float-slow">
                <div className="w-[520px] h-[310px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-500/25">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85"
                    alt="Featured car"
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#3b1f6e,#6b1d7a)'
                      e.currentTarget.insertAdjacentHTML('afterend', '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px">🏎️</div>')
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/70 via-transparent to-transparent" />
                </div>

                {/* Floating badge — top right */}
                <div className="absolute -top-5 -right-6 glass border border-white/15 rounded-2xl px-4 py-3 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Starting from</p>
                  <p className="gradient-text text-lg font-extrabold">₹49 / day</p>
                </div>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-5 -left-6 glass border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <p className="text-emerald-400 text-xs font-semibold">Available Now</p>
                </div>

                {/* Floating badge — bottom right */}
                <div className="absolute -bottom-5 right-6 glass border border-white/10 rounded-2xl px-3 py-2.5 shadow-xl flex items-center gap-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="flex -space-x-2">
                    {['violet', 'fuchsia', 'cyan'].map(c => (
                      <div key={c} className={`w-6 h-6 rounded-full border-2 border-[#0a0a1a] bg-gradient-to-br from-${c}-400 to-${c}-600`} />
                    ))}
                  </div>
                  <p className="text-white/50 text-[11px]">+2.4k booked today</p>
                </div>
              </div>
            </div>
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

      {/* ════════════════════════════════════════
          BRAND MARQUEE
      ════════════════════════════════════════ */}
      <div className="py-6 border-y border-white/5 overflow-hidden relative select-none">
        <div className="absolute inset-y-0 left-0  w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap">
          {BRANDS.map((brand, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-6 text-white/20 text-sm font-semibold uppercase tracking-[0.2em]">
              <span className="w-1 h-1 rounded-full bg-violet-500/50 shrink-0" />
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          ACTIVITY FEED TICKER
      ════════════════════════════════════════ */}
      <div className="py-2.5 border-b border-violet-500/10 bg-violet-500/4 overflow-hidden relative select-none">
        <div className="absolute inset-y-0 left-0  w-16 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {[...HOME_ACTIVITY, ...HOME_ACTIVITY].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-white/25 text-xs font-medium">
              {item}
              <span className="w-1 h-1 rounded-full bg-violet-500/40 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          PHOTO STRIP
      ════════════════════════════════════════ */}
      <div className="py-8 space-y-3 overflow-hidden border-b border-white/5">
        {/* Row 1 — scrolls left */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0  w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 animate-marquee">
            {HOME_PHOTO_STRIP_ROW1.map((img, i) => (
              <div key={i} className="shrink-0 w-72 h-44 rounded-2xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30" />
                <img
                  src={img.url} alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-colors duration-300" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-semibold tracking-wide">{img.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Row 2 — scrolls right */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0  w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 animate-marquee-reverse">
            {HOME_PHOTO_STRIP_ROW2.map((img, i) => (
              <div key={i} className="shrink-0 w-72 h-44 rounded-2xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 to-blue-900/30" />
                <img
                  src={img.url} alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-fuchsia-600/0 group-hover:bg-fuchsia-600/10 transition-colors duration-300" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-semibold tracking-wide">{img.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS
      ════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, icon, color }, i) => (
            <div
              key={label}
              className="glass rounded-2xl border border-white/10 p-6 text-center group hover:border-white/20 hover:-translate-y-1 transition-all duration-300 animate-slide-up card-glow"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {icon}
              </div>
              <p className="gradient-text text-4xl font-extrabold mb-1">{value}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY RYDR — BENTO FEATURE GRID
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-slide-up">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">The Difference</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Rydr?</h2>
            <p className="text-white/30 max-w-md mx-auto">We didn't just build a rental app. We built the way renting was supposed to feel.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HOME_FEATURES.map(({ icon, title, desc, bg, wide, color, border, accent }, i) => (
              <div
                key={title}
                className={`glass rounded-3xl border ${border} p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 animate-slide-up ${wide ? 'col-span-2' : 'col-span-1'}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} pointer-events-none`} />
                {bg && (
                  <span className="absolute -right-3 -bottom-3 text-[5.5rem] font-black text-white/5 leading-none select-none pointer-events-none">
                    {bg}
                  </span>
                )}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {icon}
                  </div>
                  <p className={`${accent} text-xs font-bold uppercase tracking-widest mb-2`}>{title}</p>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Simple AF</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How Rydr Works</h2>
            <p className="text-white/30 max-w-md mx-auto">Three steps between you and your dream ride. That's it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-emerald-500/30" />

            {HOW_IT_WORKS.map(({ step, icon, title, desc, color, border }, i) => (
              <div
                key={step}
                className={`glass rounded-3xl border ${border} p-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 animate-slide-up shimmer-on-hover`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </div>
                    <span className="text-white/8 font-black text-6xl leading-none select-none">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FLEET SHOWCASE
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 animate-slide-up">
            <div>
              <p className="text-fuchsia-400 text-xs font-semibold uppercase tracking-widest mb-3">Our Garage</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">The Fleet</h2>
              <p className="text-white/30 mt-2">Built different. For those who know.</p>
            </div>
            <Link to="/vehicles" className="text-sm text-violet-400 hover:text-fuchsia-400 transition-colors font-medium flex items-center gap-1 shrink-0">
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLEET.map(({ url, label, tag, tagColor }, i) => (
              <Link
                key={label + i}
                to="/vehicles"
                className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-400 animate-slide-up hover:-translate-y-1 shimmer-on-hover"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30 relative">
                  <img
                    src={url}
                    alt={label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">Tap to explore</p>
                  </div>
                  <span className={`${tagColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm`}>
                    {tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Filter Your Vibe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Browse by Category</h2>
            <p className="text-white/30">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, icon, gradient }, i) => (
              <button
                key={name}
                onClick={() => navigate(`/vehicles?category=${name.toLowerCase()}`)}
                className="group glass rounded-2xl border border-white/10 hover:border-violet-500/40 p-5 flex flex-col items-center gap-3 transition-all duration-300 card-glow animate-slide-up hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.05}s` }}
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

      {/* ════════════════════════════════════════
          FEATURED VEHICLES (API)
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 animate-slide-up">
            <div>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Curated Picks</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Vehicles</h2>
              <p className="text-white/30">Hand-picked for you</p>
            </div>
            <Link to="/vehicles" className="text-sm text-violet-400 hover:text-fuchsia-400 transition-colors font-medium flex items-center gap-1 shrink-0">
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

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-3">No Paid Promos</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Real Talk</h2>
            <p className="text-white/30 max-w-md mx-auto">From people who actually drive with us. Unfiltered.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, avatar, role, text, rating, gradient, border }, i) => (
              <div
                key={name}
                className={`glass rounded-3xl border ${border} p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
                <div className="relative">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <span key={j} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed mb-7">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-white/30 text-xs">{role}</p>
                    </div>
                    <div className="ml-auto">
                      <svg className="w-6 h-6 text-white/8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-[size:300%] animate-gradient-shift" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Floating blobs inside CTA */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/8 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/8 rounded-full blur-2xl" />

          <div className="relative z-10 p-12 md:p-16 text-center">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Limited Slots Daily</p>
            <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              Ready to Hit<br className="hidden md:block" /> the Road?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Sign up today and unlock our full fleet with exclusive member pricing.
              First ride perks, on us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-10 py-4 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 text-base"
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/vehicles"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 text-base"
              >
                Browse First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="py-6 px-6 border-t border-white/5 text-center">
        <p className="text-white/12 text-xs tracking-wider">© 2025 Rydr · Drive Different · All rights reserved</p>
      </div>
    </div>
  )
}
