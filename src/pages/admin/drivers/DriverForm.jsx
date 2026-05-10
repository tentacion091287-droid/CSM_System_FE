import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getDriver, createDriver, updateDriver } from '../../../api/driversApi'
import Spinner from '../../../components/common/Spinner'

const schema = z.object({
  name:           z.string().min(2, 'Name must be at least 2 characters'),
  phone:          z.string().min(7, 'Enter a valid phone number'),
  license_number: z.string().min(3, 'License number required'),
  is_available:   z.boolean().optional(),
})

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function DriverForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [loading,  setLoading]  = useState(isEdit)
  const [saving,   setSaving]   = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', license_number: '', is_available: true },
  })

  useEffect(() => {
    if (!isEdit) return
    getDriver(id)
      .then(r => reset({
        name:           r.data.name           ?? '',
        phone:          r.data.phone          ?? '',
        license_number: r.data.license_number ?? r.data.license ?? '',
        is_available:   r.data.is_available   ?? true,
      }))
      .catch(() => setApiError('Failed to load driver.'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true); setApiError('')
    try {
      if (isEdit) await updateDriver(id, data)
      else        await createDriver(data)
      navigate('/admin/drivers')
    } catch (err) {
      setApiError(err?.response?.data?.detail ?? 'Failed to save driver.')
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

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/admin/drivers')}
            className="mt-1 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 shrink-0"
          >
            ←
          </button>
          <div>
            <p className="text-white/30 text-sm mb-1">Admin / Drivers</p>
            <h1 className="text-3xl font-bold gradient-text">
              {isEdit ? 'Edit Driver' : 'Add Driver'}
            </h1>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-2xl border border-white/10 p-6 space-y-5 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          {apiError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {apiError}
            </div>
          )}

          <Field label="Full Name" error={errors.name?.message}>
            <input
              type="text"
              placeholder="John Smith"
              {...register('name')}
              className="input-exotic"
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <input
              type="tel"
              placeholder="+1 555 000 0000"
              {...register('phone')}
              className="input-exotic"
            />
          </Field>

          <Field label="License Number" error={errors.license_number?.message}>
            <input
              type="text"
              placeholder="DL-1234567890"
              {...register('license_number')}
              className="input-exotic font-mono"
            />
          </Field>

          {/* Availability toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">Available for assignments</p>
              <p className="text-white/30 text-xs mt-0.5">Driver can be assigned to new bookings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('is_available')} />
              <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/drivers')}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Spinner size="sm" /> : (isEdit ? 'Save Changes' : 'Add Driver')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
