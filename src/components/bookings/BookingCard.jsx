import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import StatusBadge from '../common/StatusBadge'

export default function BookingCard({ booking }) {
  const { id, vehicle, pickup_date, return_date, status, total_cost, pickup_location } = booking

  return (
    <Link
      to={`/bookings/${id}`}
      className="block group glass rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 card-glow overflow-hidden"
    >
      <div className="flex items-stretch">
        {/* Color accent bar */}
        <div className={`w-1.5 shrink-0 bg-gradient-to-b
          ${status === 'pending'   ? 'from-yellow-500 to-amber-400' : ''}
          ${status === 'approved'  ? 'from-blue-500 to-cyan-400' : ''}
          ${status === 'active'    ? 'from-emerald-500 to-teal-400' : ''}
          ${status === 'completed' ? 'from-white/20 to-white/10' : ''}
          ${status === 'cancelled' || status === 'rejected' ? 'from-red-500 to-rose-400' : ''}
        `} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1 font-semibold">
                #{String(id).padStart(5, '0')}
              </p>
              <h3 className="text-white font-semibold text-base leading-tight group-hover:gradient-text transition-all duration-300">
                {vehicle?.make} {vehicle?.model}
                {vehicle?.year && <span className="text-white/30 font-normal text-sm ml-1">({vehicle.year})</span>}
              </h3>
              {pickup_location && (
                <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                  <span>📍</span> {pickup_location}
                </p>
              )}
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1">
                <span className="text-violet-400">↗</span>
                {pickup_date ? format(new Date(pickup_date), 'dd MMM yyyy') : '—'}
              </span>
              <span className="text-white/10">→</span>
              <span className="flex items-center gap-1">
                <span className="text-fuchsia-400">↙</span>
                {return_date ? format(new Date(return_date), 'dd MMM yyyy') : '—'}
              </span>
            </div>

            {total_cost != null && (
              <span className="gradient-text font-bold text-lg">
                ₹{Number(total_cost).toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
