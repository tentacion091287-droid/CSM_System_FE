import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { getMaintenance, createMaintenance, updateMaintenance } from '../../../api/maintenanceApi'
import { getVehicles } from '../../../api/vehiclesApi'
import Spinner from '../../../components/common/Spinner'

const schema = z.object({
  vehicle_id:     z.coerce.number({ required_error: 'Vehicle is required' }),
  type:           z.string().min(2, 'Type is required'),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  description:    z.string().optional(),
  performed_by:   z.string().optional(),
  cost:           z.coerce.number().nonnegative().optional().or(z.literal('')),
})

import { MAINTENANCE_TYPES as TYPES } from '../../../constants'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function MaintenanceForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [loading,   setLoading]   = useState(isEdit)
  const [vehicles,  setVehicles]  = useState([])
  const [saving,    setSaving]    = useState(false)
  const [apiError,  setApiError]  = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicle_id: '',
      type: 'oil_change',
      scheduled_date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      performed_by: '',
      cost: '',
    },
  })

  useEffect(() => {
    getVehicles({ size: 200 })
      .then(r => {
        const d = r.data
        setVehicles(Array.isArray(d) ? d : d.items ?? [])
      })
      .catch(() => setVehicles([]))

    if (!isEdit) return
    getMaintenance(id)
      .then(r => reset({
        vehicle_id:     r.data.vehicle_id ?? r.data.vehicle?.id ?? '',
        type:           r.data.type ?? r.data.maintenance_type ?? 'oil_change',
        scheduled_date: r.data.scheduled_date ? r.data.scheduled_date.slice(0, 10) : format(new Date(), 'yyyy-MM-dd'),
        description:    r.data.description   ?? '',
        performed_by:   r.data.performed_by  ?? '',
        cost:           r.data.cost != null   ? String(r.data.cost) : '',
      }))
      .catch(() => setApiError('Failed to load maintenance record.'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true); setApiError('')
    const payload = { ...data }
    if (payload.cost === '' || payload.cost == null) delete payload.cost
    else payload.cost = Number(payload.cost)
    try {
      if (isEdit) await updateMaintenance(id, payload)
      else        await createMaintenance(payload)
      navigate('/admin/maintenance')
    } catch (err) {
      setApiError(err?.response?.data?.detail ?? 'Failed to save record.')
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
        <div className="flex items-start gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/admin/maintenance')}
            className="mt-1 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 shrink-0"
          >
            ←
          </button>
          <div>
            <p className="text-white/30 text-sm mb-1">Admin / Maintenance</p>
            <h1 className="text-3xl font-bold gradient-text">{isEdit ? 'Edit Record' : 'Schedule Maintenance'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-2xl border border-white/10 p-6 space-y-5 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          {apiError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {apiError}
            </div>
          )}

          <Field label="Vehicle" error={errors.vehicle_id?.message}>
            <select {...register('vehicle_id')} className="input-exotic">
              <option value="">Select a vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year ? `(${v.year})` : ''} — {v.license_plate ?? v.plate ?? ''}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Maintenance Type" error={errors.type?.message}>
            <select {...register('type')} className="input-exotic">
              {TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </Field>

          <Field label="Scheduled Date" error={errors.scheduled_date?.message}>
            <input type="date" {...register('scheduled_date')} className="input-exotic" />
          </Field>

          <Field label="Performed By (optional)" error={errors.performed_by?.message}>
            <input type="text" placeholder="Mechanic name or garage" {...register('performed_by')} className="input-exotic" />
          </Field>

          <Field label="Estimated Cost ($) — optional" error={errors.cost?.message}>
            <input type="number" min="0" step="0.01" placeholder="0.00" {...register('cost')} className="input-exotic" />
          </Field>

          <Field label="Description (optional)" error={errors.description?.message}>
            <textarea rows={3} placeholder="Any additional notes..." {...register('description')} className="input-exotic resize-none" />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/admin/maintenance')}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl btn-gradient text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Spinner size="sm" /> : (isEdit ? 'Save Changes' : 'Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
