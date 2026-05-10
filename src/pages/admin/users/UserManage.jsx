import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { getUsers, updateUserStatus, updateUserRole } from '../../../api/adminApi'
import ConfirmModal from '../../../components/common/ConfirmModal'
import Pagination from '../../../components/common/Pagination'
import Spinner from '../../../components/common/Spinner'

const initials = (name) =>
  name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '??'

export default function UserManage() {
  const [users,       setUsers]      = useState([])
  const [loading,     setLoading]    = useState(true)
  const [error,       setError]      = useState('')
  const [page,        setPage]       = useState(1)
  const [pages,       setPages]      = useState(1)
  const [total,       setTotal]      = useState(0)
  const [search,      setSearch]     = useState('')
  const [roleFilter,  setRoleFilter] = useState('')
  const [confirm,     setConfirm]    = useState(null)
  const [acting,      setActing]     = useState(false)

  const load = async (pg) => {
    setLoading(true); setError('')
    try {
      const res  = await getUsers({ page: pg, size: 15, search: search || undefined, role: roleFilter || undefined })
      const data = res.data
      setUsers(Array.isArray(data) ? data : data.items ?? [])
      setPages(data.pages ?? 1)
      setTotal(data.total ?? (Array.isArray(data) ? data.length : 0))
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, search, roleFilter])

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1) }
  const handleRoleChange   = (e) => { setRoleFilter(e.target.value); setPage(1) }

  const handleConfirm = async () => {
    setActing(true)
    try {
      await confirm.action()
      setConfirm(null)
      load(page)
    } catch { /* ignore */ }
    finally { setActing(false) }
  }

  const promptToggleStatus = (user) => {
    const willActive = !user.is_active
    setConfirm({
      title:   willActive ? 'Activate User' : 'Deactivate User',
      message: willActive
        ? `Activate ${user.name}? They will regain full system access.`
        : `Deactivate ${user.name}? They will lose access until reactivated.`,
      confirmLabel: willActive ? 'Activate' : 'Deactivate',
      danger:  !willActive,
      action:  () => updateUserStatus(user.id, { is_active: willActive }),
    })
  }

  const promptChangeRole = (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    setConfirm({
      title:   newRole === 'admin' ? 'Grant Admin Access' : 'Revoke Admin Access',
      message: newRole === 'admin'
        ? `Give ${user.name} full admin privileges? They will have unrestricted system access.`
        : `Remove admin privileges from ${user.name}? They will become a regular customer.`,
      confirmLabel: newRole === 'admin' ? 'Grant Admin' : 'Revoke Admin',
      danger:  true,
      action:  () => updateUserRole(user.id, { role: newRole }),
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-slide-up">
          <div>
            <p className="text-white/30 text-sm mb-1">Admin</p>
            <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          </div>
          {!loading && total > 0 && (
            <p className="text-white/20 text-sm">{total} users total</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="input-exotic pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="input-exotic sm:w-44"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-gradient px-6 py-2.5 text-sm">Retry</button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-white/30 text-lg">No users found.</p>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Column headers */}
              <div className="hidden md:grid grid-cols-[2fr_2fr_auto_auto_auto] gap-4 px-5 py-3 bg-white/3 border-b border-white/5">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <p key={h} className="text-white/25 text-xs uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>

              {/* Rows */}
              {users.map((user, i) => (
                <div
                  key={user.id}
                  className="flex flex-col md:grid md:grid-cols-[2fr_2fr_auto_auto_auto] gap-2 md:gap-4 items-start md:items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br shrink-0 flex items-center justify-center text-xs font-bold text-white
                      ${user.role === 'admin' ? 'from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20' : 'from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20'}`}
                    >
                      {initials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      <p className={`text-xs font-medium ${user.is_active ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                        {user.is_active ? '● Active' : '● Inactive'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-white/40 text-sm truncate md:block">{user.email}</p>

                  {/* Role badge */}
                  <span className={`self-start md:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                    ${user.role === 'admin'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                    }`}
                  >
                    {user.role}
                  </span>

                  {/* Joined */}
                  <p className="text-white/25 text-xs">
                    {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '—'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => promptToggleStatus(user)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200
                        ${user.is_active
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => promptChangeRole(user)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-medium transition-all duration-200"
                    >
                      {user.role === 'admin' ? '→ Customer' : '→ Admin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          open
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          loading={acting}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
