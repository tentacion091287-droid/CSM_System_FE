import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { differenceInCalendarDays, format } from 'date-fns'
import { getVehicle } from '../../api/vehiclesApi'
import { createBooking } from '../../api/bookingsApi'
import Spinner from '../../components/common/Spinner'

const schema = z.object({
  pickup_date:      z.string().min(1, 'Pickup date is required'),
  return_date:      z.string().min(1, 'Return date is required'),
  pickup_location:  z.string().min(2, 'Pickup location is required'),
  drop_location:    z.string().min(2, 'Drop location is required'),
  needs_driver:     z.boolean().optional(),
}).refine(d => d.return_date > d.pickup_date, {
  message: 'Return date must be after pickup date',
  path: ['return_date'],
})

const today = new Date().toISOString().split('T')[0]

const labelCls = 'block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5'

export default function BookVehicle() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loadingVehicle, setLoadingVehicle] = useState(true)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { needs_driver: false },
  })

  const pickupDate = watch('pickup_date')
  const returnDate = watch('return_date')

  const days = pickupDate && returnDate && returnDate > pickupDate
    ? differenceInCalendarDays(new Date(returnDate), new Date(pickupDate))
    : 0
  const estimate = days > 0 && vehicle ? days * Number(vehicle.daily_rate) : 0

  useEffect(() => {
    getVehicle(vehicleId)
      .then(r => setVehicle(r.data))
      .catch(() => navigate('/vehicles'))
      .finally(() => setLoadingVehicle(false))
  }, [vehicleId])

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await createBooking({ ...data, vehicle_id: Number(vehicleId) })
      navigate(`/bookings/${res.data.id}`)
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Booking failed. Please try again.')
    }
  }

  if (loadingVehicle) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">New Booking</p>
          <h1 className="text-3xl font-bold gradient-text">Book Vehicle</h1>
        </div>

        {/* Vehicle summary card */}
        {vehicle && (
          <div className="glass rounded-2xl border border-white/10 p-5 mb-6 flex items-center gap-5 animate-slide-up">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
              <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg">{vehicle.make} {vehicle.model}</h2>
              <p className="text-white/30 text-sm capitalize">{vehicle.category} · {vehicle.year}</p>
            </div>
            <div className="text-right">
              <p className="gradient-text text-2xl font-bold">${Number(vehicle.daily_rate).toFixed(0)}</p>
              <p className="text-white/20 text-xs">/day</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {serverError && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Pickup Date</label>
                <input type="date" min={today} {...register('pickup_date')} className="input-exotic" />
                {errors.pickup_date && <p className="text-xs text-fuchsia-400 mt-1">{errors.pickup_date.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Return Date</label>
                <input type="date" min={pickupDate || today} {...register('return_date')} className="input-exotic" />
                {errors.return_date && <p className="text-xs text-fuchsia-400 mt-1">{errors.return_date.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Pickup Location</label>
              <input type="text" placeholder="e.g. City Center Branch" {...register('pickup_location')} className="input-exotic" />
              {errors.pickup_location && <p className="text-xs text-fuchsia-400 mt-1">{errors.pickup_location.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Drop Location</label>
              <input type="text" placeholder="e.g. Airport Terminal 2" {...register('drop_location')} className="input-exotic" />
              {errors.drop_location && <p className="text-xs text-fuchsia-400 mt-1">{errors.drop_location.message}</p>}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" {...register('needs_driver')} className="sr-only peer" />
                <div className="w-11 h-6 rounded-full bg-white/10 border border-white/20 peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600 transition-all duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 peer-checked:translate-x-5" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Include a driver</p>
                <p className="text-white/20 text-xs">Additional charges may apply</p>
              </div>
            </label>

            {/* Live cost estimate */}
            {days > 0 && vehicle && (
              <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4 flex items-center justify-between animate-fade-in">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Estimated Cost</p>
                  <p className="text-white/60 text-sm mt-0.5">{days} day{days !== 1 ? 's' : ''} × ${Number(vehicle.daily_rate).toFixed(0)}/day</p>
                </div>
                <p className="gradient-text text-3xl font-bold">${estimate.toFixed(0)}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl glass border border-white/10 text-white/40 hover:text-white text-sm font-medium transition-all duration-200">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-gradient flex-1 py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                {isSubmitting ? <Spinner size="sm" /> : <>Confirm Booking <span>→</span></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
