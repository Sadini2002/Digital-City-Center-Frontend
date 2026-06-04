import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import SiteLayout from '../layouts/SiteLayout'
import AuthPageMain from '../components/auth/AuthPageMain'
import LoginHero from '../components/auth/LoginHero'
import AuthFormCard from '../components/auth/AuthFormCard'
import AuthInput from '../components/auth/AuthInput'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import RoleToggle from '../components/auth/RoleToggle'
import { authApi } from '../services/api'
import {
  isDeliveryDriverActive,
  isDeliveryProviderActive,
} from '../delivery/utils/deliveryAuth'
import {
  activateDemoDeliveryDriver,
  activateDemoDeliveryProvider,
} from '../delivery/utils/deliveryApplicationStorage'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isDeliveryPortal = searchParams.get('portal') === 'delivery'
  const redirectTo = location.state?.from || '/'
  const [role, setRole] = useState(isDeliveryPortal ? 'delivery' : 'buyer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('portal') === 'delivery') setRole('delivery')
  }, [searchParams])

  const routeAfterAuth = (user) => {
    const userRole = user?.role
    if (userRole === 'DELIVERY_PROVIDER') {
      if (isDeliveryProviderActive(user)) navigate('/delivery', { replace: true })
      else navigate('/delivery/application-status', { replace: true })
      return
    }
    if (userRole === 'DELIVERY_DRIVER') {
      if (isDeliveryDriverActive(user)) navigate('/delivery', { replace: true })
      else navigate('/delivery/application-status', { replace: true })
      return
    }
    if (isDeliveryPortal) {
      setError('This account is not a delivery partner. Register as a provider or use demo access.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return
    }
    if (role === 'seller' && userRole !== 'SELLER') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setError('This account is not registered as a seller. Try signing in as a buyer.')
      return
    }
    if (role === 'buyer' && userRole === 'SELLER') {
      navigate('/seller/dashboard')
    } else if (
      String(userRole ?? '').toUpperCase().includes('ADMIN') ||
      String(userRole ?? '').toUpperCase().includes('SUPER')
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setError('Admin accounts are separate. Please use the dedicated admin portal.')
    } else if (userRole === 'SELLER') {
      navigate('/seller/dashboard')
    } else {
      navigate(redirectTo)
    }
  }

  const handleLogin = async (e) => {
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

      if (token) localStorage.setItem('token', token)
      if (user) localStorage.setItem('user', JSON.stringify(user))
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      routeAfterAuth(user)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoProvider = () => {
    activateDemoDeliveryProvider()
    navigate('/delivery', { replace: true })
  }

  const handleDemoDriver = () => {
    activateDemoDeliveryDriver()
    navigate('/delivery', { replace: true })
  }

  const handleDemoSeller = () => {
    const demoUser = {
      id: 'seller-demo-1',
      name: 'Demo Seller',
      email: 'seller@demo.local',
      role: 'SELLER',
    }
    localStorage.setItem('token', 'demo-seller-token')
    localStorage.setItem('user', JSON.stringify(demoUser))
    const from = location.state?.from
    const target = from && String(from).startsWith('/seller') ? from : '/seller/dashboard'
    navigate(target, { replace: true })
  }

  return (
    <SiteLayout activeAuth="login">
      <div className="flex-1 bg-white">
      <AuthPageMain>
        <div className="w-full min-w-0 lg:w-1/2">
          <LoginHero />
        </div>
        <div className="flex w-full min-w-0 justify-center lg:w-1/2 lg:justify-end">
          <div className="w-full min-w-0 max-w-md">
          <AuthFormCard
            title="Welcome Back"
            subtitle={
              isDeliveryPortal
                ? 'Sign in to the delivery partner portal.'
                : 'Unified login for Buyers and Sellers.'
            }
          >
            {!isDeliveryPortal && (
              <div className="mb-5">
                <RoleToggle value={role} onChange={setRole} />
              </div>
            )}
            {isDeliveryPortal && (
              <p className="mb-5 rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-dcc-primary">
                Delivery partner sign in
              </p>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={Mail}
                required
                autoComplete="email"
                variant="auth"
              />
              <AuthInput
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
                autoComplete="current-password"
                variant="auth"
                labelAction={
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-dcc-primary hover:underline sm:text-sm"
                  >
                    Forgot Password?
                  </Link>
                }
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
                <span className="text-sm text-slate-600">Remember me for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-dcc-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              {role === 'seller' && !isDeliveryPortal && (
                <button
                  type="button"
                  onClick={handleDemoSeller}
                  className="w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-semibold text-dcc-primary transition-colors hover:bg-violet-100"
                >
                  Continue as Demo Seller
                </button>
              )}
              {isDeliveryPortal && (
                <>
                  <button
                    type="button"
                    onClick={handleDemoProvider}
                    className="w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-semibold text-dcc-primary transition-colors hover:bg-violet-100"
                  >
                    Continue as Demo Provider
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoDriver}
                    className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Continue as Demo Driver
                  </button>
                </>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">or</span>
              </div>
            </div>

            <GoogleSignInButton />

            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                to={
                  isDeliveryPortal
                    ? '/register/delivery'
                    : role === 'seller'
                      ? '/register/seller'
                      : '/register'
                }
                className="font-bold text-dcc-primary hover:underline"
              >
                Register
              </Link>
            </p>
            {!isDeliveryPortal && (
              <p className="mt-3 text-center text-sm text-slate-500">
                <Link to="/login?portal=delivery" className="font-semibold text-dcc-primary hover:underline">
                  Delivery partner login
                </Link>
              </p>
            )}
          </AuthFormCard>
          </div>
        </div>
      </AuthPageMain>
      </div>
    </SiteLayout>
  )
}
