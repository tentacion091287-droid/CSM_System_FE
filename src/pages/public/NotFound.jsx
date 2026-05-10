import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function NotFound() {
  const { token, user } = useAuth()
  const home = user?.role === 'admin' ? '/admin' : token ? '/dashboard' : '/'

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-6">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-800/8 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center relative z-10 animate-slide-up">
        <p className="text-[9rem] sm:text-[12rem] font-black gradient-text leading-none mb-2 select-none">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 mb-10 max-w-xs mx-auto text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={home} className="btn-gradient px-8 py-3 text-sm font-semibold rounded-xl">
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 text-sm font-medium rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
