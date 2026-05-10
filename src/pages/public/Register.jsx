import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/authSlice'
import { register as registerApi } from '../../api/authApi'
import Spinner from '../../components/common/Spinner'

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

const FIELDS = [
  { name: 'full_name',        label: 'Full Name',       type: 'text',     placeholder: 'John Doe',       icon: '👤' },
  { name: 'email',            label: 'Email',            type: 'email',    placeholder: 'you@example.com', icon: '✉️' },
  { name: 'phone',            label: 'Phone Number',     type: 'tel',      placeholder: '+1 234 567 890', icon: '📱' },
  { name: 'password',         label: 'Password',         type: 'password', placeholder: '••••••••',       icon: '🔒' },
  { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: '••••••••',       icon: '🔐' },
]

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ confirm_password, ...data }) => {
    setServerError('')
    try {
      const res = await registerApi(data)
      dispatch(setCredentials({ token: res.data.access_token, user: res.data.user }))
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a1a] px-4 py-12">
      {/* Animated background blobs */}
      <div className="absolute top-[-5%] right-[-10%] w-96 h-96 bg-cyan-700/25 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-[10%] left-[-10%] w-80 h-80 bg-violet-700/30 rounded-full blur-3xl animate-blob [animation-delay:3s]" />
      <div className="absolute top-[50%] right-[30%] w-64 h-64 bg-fuchsia-700/20 rounded-full blur-3xl animate-blob [animation-delay:5s]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 mb-4 shadow-lg shadow-cyan-500/40 animate-float">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Create account</h1>
          <p className="text-white/40 text-sm">Start your journey with us</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50 transition-all duration-500 card-glow">
          {serverError && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {FIELDS.map(({ name, label, type, placeholder, icon }) => (
              <div key={name} className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-widest">
                  <span className="text-base">{icon}</span> {label}
                </label>
                <input
                  type={type}
                  {...register(name)}
                  placeholder={placeholder}
                  className="input-exotic"
                />
                {errors[name] && (
                  <p className="text-xs text-fuchsia-400">{errors[name].message}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? <Spinner size="sm" /> : (
                <>
                  <span>Create account</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-fuchsia-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
