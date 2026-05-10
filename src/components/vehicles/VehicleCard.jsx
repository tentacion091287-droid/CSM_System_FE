import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import { CATEGORY_GRADIENT } from '../../constants'

export default function VehicleCard({ vehicle }) {
  const { id, make, model, category, daily_rate, status, image_url, year } = vehicle
  const gradient = CATEGORY_GRADIENT[category?.toLowerCase()] ?? 'from-violet-600 to-fuchsia-500'

  return (
    <div className="group glass rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-500 card-glow flex flex-col">
      {/* Image / placeholder */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {image_url ? (
          <img src={image_url} alt={`${make} ${model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-white/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        )}
        {/* Category pill */}
        <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest text-white bg-black/30 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
          {category}
        </span>
        {/* Status badge top-right */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base leading-tight">
          {make} {model}
          <span className="text-white/30 font-normal text-sm ml-1">({year})</span>
        </h3>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-white/30 text-xs uppercase tracking-wider">Daily rate</p>
            <p className="gradient-text text-2xl font-bold leading-none mt-0.5">
              ${Number(daily_rate).toFixed(0)}
              <span className="text-white/30 text-xs font-normal ml-1">/day</span>
            </p>
          </div>

          <Link
            to={`/vehicles/${id}`}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300
              ${status === 'available'
                ? 'btn-gradient'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed pointer-events-none'
              }`}
          >
            {status === 'available' ? 'View →' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  )
}
