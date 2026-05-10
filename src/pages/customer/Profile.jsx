import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { setCredentials } from '../../store/authSlice'
import { getProfile, updateProfile, changePassword } from '../../api/authApi'
import Spinner from '../../components/common/Spinner'

const profileSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password:     z.string().min(8, 'New password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your new password'),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

import { LABEL_CLS as labelCls, INPUT_CLS as inputCls } from '../../constants'

function Toast({ message, type = 'success' }) {
  const colors = type === 'success'
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    : 'bg-red-500/10 border-red-500/30 text-red-400'
  const icon = type === 'success' ? '✓' : '⚠'
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 animate-fade-in ${colors}`}>
      <span>{icon}</span> {message}
    </div>
  )
}

export default function Profile() {
  const dispatch        = useDispatch()
  const { user, token } = useAuth()

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileToast,   setProfileToast]   = useState(null)
  const [passwordToast,  setPasswordToast]  = useState(null)
  const [activeTab,      setActiveTab]      = useState('profile')

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({ resolver: zodResolver(profileSchema) })

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    getProfile()
      .then(r => {
        const { name, email, phone } = r.data
        resetProfile({ name, email, phone: phone ?? '' })
      })
      .catch(() => {
        if (user) resetProfile({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '' })
      })
      .finally(() => setLoadingProfile(false))
  }, [])

  const flash = (setter, message, type = 'success') => {
    setter({ message, type })
    setTimeout(() => setter(null), 4000)
  }

  const onProfileSubmit = async (data) => {
    try {
      const res = await updateProfile(data)
      dispatch(setCredentials({ user: res.data, token }))
      flash(setProfileToast, 'Profile updated successfully.')
    } catch (err) {
      flash(setProfileToast, err.response?.data?.detail || 'Update failed. Please try again.', 'error')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({
        current_password: data.current_password,
        new_password:     data.new_password,
      })
      resetPassword()
      flash(setPasswordToast, 'Password changed successfully.')
    } catch (err) {
      flash(setPasswordToast, err.response?.data?.detail || 'Password change failed. Please try again.', 'error')
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'ME'

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-fuchsia-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="text-white/30 text-sm mb-1">My Account</p>
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
        </div>

        {/* Avatar card */}
        <div className="glass rounded-2xl border border-white/10 p-6 mb-6 flex items-center gap-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-violet-500/40 animate-float shrink-0">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#0a0a1a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg truncate">{user?.name ?? '—'}</p>
            <p className="text-white/30 text-sm truncate">{user?.email ?? '—'}</p>
            <p className="text-white/20 text-xs mt-0.5 capitalize">{user?.role ?? 'customer'}</p>
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 mb-5 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          {[
            { id: 'profile',  label: '👤 Edit Profile' },
            { id: 'password', label: '🔒 Change Password' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                  : 'glass border border-white/10 text-white/40 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {loadingProfile ? (
              <div className="flex justify-center py-8"><Spinner size="md" /></div>
            ) : (
              <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" {...regProfile('name')} className={inputCls} placeholder="Your full name" />
                  {profileErrors.name && <p className="text-xs text-fuchsia-400 mt-1">{profileErrors.name.message}</p>}
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" {...regProfile('email')} className={inputCls} placeholder="your@email.com" />
                  {profileErrors.email && <p className="text-xs text-fuchsia-400 mt-1">{profileErrors.email.message}</p>}
                </div>

                <div>
                  <label className={labelCls}>Phone <span className="text-white/20 normal-case font-normal">(optional)</span></label>
                  <input type="tel" {...regProfile('phone')} className={inputCls} placeholder="+1 234 567 8900" />
                  {profileErrors.phone && <p className="text-xs text-fuchsia-400 mt-1">{profileErrors.phone.message}</p>}
                </div>

                {profileToast && <Toast {...profileToast} />}

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="btn-gradient w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {profileSubmitting ? <Spinner size="sm" /> : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Password tab ── */}
        {activeTab === 'password' && (
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Current Password</label>
                <input type="password" {...regPassword('current_password')} className={inputCls} placeholder="••••••••" />
                {passwordErrors.current_password && (
                  <p className="text-xs text-fuchsia-400 mt-1">{passwordErrors.current_password.message}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" {...regPassword('new_password')} className={inputCls} placeholder="Min. 8 characters" />
                {passwordErrors.new_password && (
                  <p className="text-xs text-fuchsia-400 mt-1">{passwordErrors.new_password.message}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input type="password" {...regPassword('confirm_password')} className={inputCls} placeholder="Repeat new password" />
                {passwordErrors.confirm_password && (
                  <p className="text-xs text-fuchsia-400 mt-1">{passwordErrors.confirm_password.message}</p>
                )}
              </div>

              {passwordToast && <Toast {...passwordToast} />}

              <button
                type="submit"
                disabled={passwordSubmitting}
                className="btn-gradient w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {passwordSubmitting ? <Spinner size="sm" /> : '🔒 Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
