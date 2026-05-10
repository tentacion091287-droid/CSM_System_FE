import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { logout } from '../../store/authSlice'
import { logoutApi } from '../../api/authApi'

const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation()
  const active = pathname === to || (to !== '/' && pathname.startsWith(to))
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-200 group
        ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300
        ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  )
}

export default function Navbar() {
  const { token, user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const handleLogout = async () => {
    setOpen(false)
    try { await logoutApi() } catch (_) {}
    dispatch(logout())
    navigate('/login')
  }

  const close = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/5">
      <div className="px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={close}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/60 transition-shadow duration-300">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight group-hover:gradient-text transition-all duration-300">
            Rydr
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/vehicles">Vehicles</NavLink>

          {!token ? (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link to="/register" className="btn-gradient text-sm px-5 py-2 rounded-xl">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</NavLink>
              <NavLink to="/bookings">Bookings</NavLink>
              <NavLink to="/profile">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(user?.name ?? user?.full_name)?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                  {(user?.name ?? user?.full_name)?.split(' ')[0] ?? 'Profile'}
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/40 hover:text-red-400 transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 animate-slide-up">
          <MobileNavLink to="/vehicles" onClick={close}>Vehicles</MobileNavLink>

          {!token ? (
            <>
              <MobileNavLink to="/login" onClick={close}>Sign in</MobileNavLink>
              <Link
                to="/register"
                onClick={close}
                className="btn-gradient text-sm px-5 py-2.5 rounded-xl text-center font-semibold"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <MobileNavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={close}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/bookings" onClick={close}>Bookings</MobileNavLink>
              <MobileNavLink to="/profile" onClick={close}>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(user?.name ?? user?.full_name)?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                  {(user?.name ?? user?.full_name)?.split(' ')[0] ?? 'Profile'}
                </span>
              </MobileNavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-400/70 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 text-left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

function MobileNavLink({ to, children, onClick }) {
  const { pathname } = useLocation()
  const active = pathname === to || (to !== '/' && pathname.startsWith(to))
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors duration-200 ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
    >
      {children}
    </Link>
  )
}
