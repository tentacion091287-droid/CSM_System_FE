import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getVehicle, createVehicle, updateVehicle } from '../../../api/vehiclesApi'
import Spinner from '../../../components/common/Spinner'

const schema = z.object({
  make:          z.string().min(1, 'Make is required'),
  model:         z.string().min(1, 'Model is required'),
  year:          z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  category:      z.string().min(1, 'Category is required'),
  license_plate: z.string().min(2, 'License plate is required'),
  price_per_day: z.coerce.number().positive('Must be a positive number'),
  seats:         z.coerce.number().int().min(1).max(20).optional(),
  fuel_type:     z.string().optional(),
  transmission:  z.string().optional(),
  description:   z.string().optional(),
  image_url:     z.string().url('Must be a valid URL').or(z.literal('')).optional(),
})

const CATEGORIES    = ['economy', 'compact', 'midsize', 'suv', 'luxury', 'van', 'truck']
const FUEL_TYPES    = ['petrol', 'diesel', 'electric', 'hybrid']
const TRANSMISSIONS = ['automatic', 'manual']

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function VehicleForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [loading,  setLoading]  = useState(isEdit)
  const [saving,   setSaving]   = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      make: '', model: '', year: new Date().getFullYear(), category: 'economy',
      license_plate: '', price_per_day: '', seats: 5,
      fuel_type: 'petrol', transmission: 'automatic', description: '', image_url: '',
    },
  })

  useEffect(() => {
    if (!isEdit) return
    getVehicle(id)
      .then(r => reset({
        make:          r.data.make          ?? '',
        model:         r.data.model         ?? '',
        year:          r.data.year          ?? new Date().getFullYear(),
        category:      r.data.category      ?? r.data.type ?? 'economy',
        license_plate: r.data.license_plate ?? r.data.plate ?? '',
        price_per_day: r.data.price_per_day ?? '',
        seats:         r.data.seats         ?? 5,
        fuel_type:     r.data.fuel_type     ?? 'petrol',
        transmission:  r.data.transmission  ?? 'automatic',
        description:   r.data.description   ?? '',
        image_url:     r.data.image_url     ?? '',
      }))
      .catch(() => setApiError('Failed to load vehicle.'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true); setApiError('')
    const payload = { ...data }
    if (!payload.image_url) delete payload.image_url
    try {
      if (isEdit) await updateVehicle(id, payload)
      else        await createVehicle(payload)
      navigate('/admin/vehicles')
    } catch (err) {
      setApiError(err?.response?.data?.detail ?? 'Failed to save vehicle.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-800/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-start gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/admin/vehicles')}
            className="mt-1 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 shrink-0"
          >
            ←
          </button>
          <div>
            <p className="text-white/30 text-sm mb-1">Admin / Vehicles</p>
            <h1 className="text-3xl font-bold gradient-text">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {apiError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {apiError}
            </div>
          )}

          {/* Make / Model / Year */}
          <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
            <p className="text-white/25 text-xs uppercase tracking-widest font-semibold">Vehicle Info</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Make" error={errors.make?.message}>
                <input type="text" placeholder="Toyota" {...register('make')} className="input-exotic" />
              </Field>
              <Field label="Model" error={errors.model?.message}>
                <input type="text" placeholder="Camry" {...register('model')} className="input-exotic" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year" error={errors.year?.message}>
                <input type="number" min="1990" max={new Date().getFullYear() + 1} {...register('year')} className="input-exotic" />
              </Field>
              <Field label="Category" error={errors.category?.message}>
                <select {...register('category')} className="input-exotic">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="License Plate" error={errors.license_plate?.message}>
              <input type="text" placeholder="KA-01-AB-1234" {...register('license_plate')} className="input-exotic font-mono" />
            </Field>
          </div>

          {/* Specs */}
          <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
            <p className="text-white/25 text-xs uppercase tracking-widest font-semibold">Specs & Pricing</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fuel Type" error={errors.fuel_type?.message}>
                <select {...register('fuel_type')} className="input-exotic">
                  {FUEL_TYPES.map(f => (
                    <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Transmission" error={errors.transmission?.message}>
                <select {...register('transmission')} className="input-exotic">
                  {TRANSMISSIONS.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Seats" error={errors.seats?.message}>
                <input type="number" min="1" max="20" {...register('seats')} className="input-exotic" />
              </Field>
              <Field label="Price per Day ($)" error={errors.price_per_day?.message}>
                <input type="number" min="1" step="0.01" placeholder="59.99" {...register('price_per_day')} className="input-exotic" />
              </Field>
            </div>
          </div>

          {/* Description / Image */}
          <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
            <p className="text-white/25 text-xs uppercase tracking-widest font-semibold">Details</p>
            <Field label="Description" error={errors.description?.message}>
              <textarea
                rows={3}
                placeholder="Optional vehicle description..."
                {...register('description')}
                className="input-exotic resize-none"
              />
            </Field>
            <Field label="Image URL (optional)" error={errors.image_url?.message}>
              <input type="url" placeholder="https://..." {...register('image_url')} className="input-exotic" />
            </Field>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Spinner size="sm" /> : (isEdit ? 'Save Changes' : 'Add Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
