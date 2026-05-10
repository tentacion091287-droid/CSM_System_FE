import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/authSlice'
import { login } from '../../api/authApi'
import Spinner from '../../components/common/Spinner'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await login(data)
      dispatch(setCredentials({ token: res.data.access_token, user: res.data.user }))
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a1a] px-4">
      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet-700/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-fuchsia-700/30 rounded-full blur-3xl animate-blob [animation-delay:2s]" />
      <div className="absolute top-[40%] left-[50%] w-72 h-72 bg-cyan-700/20 rounded-full blur-3xl animate-blob [animation-delay:4s]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-4 animate-glow-pulse shadow-lg shadow-violet-500/40">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Welcome back</h1>
          <p className="text-white/40 text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50 transition-all duration-500 card-glow">
          {serverError && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">Email</label>
              <input
                type="email"
                {...register('email')}
                className="input-exotic"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-fuchsia-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
              <input
                type="password"
                {...register('password')}
                className="input-exotic"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-fuchsia-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? <Spinner size="sm" /> : (
                <>
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-fuchsia-400 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
