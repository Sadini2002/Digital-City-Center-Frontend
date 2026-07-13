import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import AuthFormCard from '../../components/auth/AuthFormCard'
import AuthInput from '../../components/auth/AuthInput'
import { authApi } from '../../services/api'
import { ADMIN_ROLE_LABELS, getAdminRedirectPath, isAdminRole, normalizeAdminRole } from '../utils/adminRole'
import { clearAdminToken, setAdminToken } from '../../utils/authStorage'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await authApi.login({ email, password })
      const { token, user } = response.data

      if (token) await setAdminToken(token, rememberMe)
      if (user) localStorage.setItem('admin_user', JSON.stringify(user))

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      const role = user?.role
      if (!isAdminRole(role)) {
        await clearAdminToken()
        localStorage.removeItem('admin_user')
        setError('This account is not an admin. Please login as a buyer/seller.')
        return
      }

      const normalized = normalizeAdminRole(role)
      if (normalized !== selectedRole) {
        await clearAdminToken()
        localStorage.removeItem('admin_user')
        setError(`This account is ${ADMIN_ROLE_LABELS[normalized] ?? 'another role'}. Please choose the correct role.`)
        return
      }
      const target = normalized ? getAdminRedirectPath(normalized) : '/admin/dashboard'
      navigate(target, { replace: true })
    } catch (err) {
      await clearAdminToken()
      localStorage.removeItem('admin_user')
      setError(err.message || 'Admin login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = async () => {
    const demoUser = {
      id: 'admin-demo-1',
      name: `Demo ${ADMIN_ROLE_LABELS[selectedRole] ?? 'Admin'}`,
      email: 'admin@demo.local',
      role: selectedRole,
    }
    await setAdminToken('demo-admin-token', true)
    localStorage.setItem('admin_user', JSON.stringify(demoUser))
    navigate(getAdminRedirectPath(selectedRole), { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dcc-auth px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-1 shadow-xl shadow-violet-200/50">
        <AuthFormCard
          title="Admin Login"
          subtitle="Dedicated admin portal for Super Admin, Category Manager, and Support Agent."
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="mb-5 text-xs text-slate-500">
            Admin accounts are created manually. There is no public admin registration.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="admin-role"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Admin Role
              </label>
              <select
                id="admin-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="CATEGORY_MANAGER">Category Manager</option>
                <option value="SUPPORT_AGENT">Support Agent</option>
              </select>
            </div>
            <AuthInput
              id="admin-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              icon={Mail}
              required
              autoComplete="email"
              variant="auth"
            />
            <AuthInput
              id="admin-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
              autoComplete="current-password"
              variant="auth"
              rightElement={
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-dcc-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-semibold text-dcc-primary transition-colors hover:bg-violet-100"
            >
              Continue as Demo Admin
            </button>
          </form>
        </AuthFormCard>
      </div>
    </main>
  )
}

