
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

import AuthPageLayout from '../components/auth/AuthPageLayout'
import RegisterHero from '../components/auth/RegisterHero'
import AuthFormCard from '../components/auth/AuthFormCard'
import AuthInput from '../components/auth/AuthInput'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'

import { authApi } from '../services/api'
import { setAuthToken } from '../utils/authStorage'

const PASSWORD_HINT = 'Must be at least 8 characters with a symbol.'

function isPasswordValid(password) {
  return password.length >= 8 && /[^A-Za-z0-9]/.test(password)
}

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName || !cleanEmail || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!isPasswordValid(password)) {
      setError(PASSWORD_HINT)
      return
    }

    if (!agreed) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await authApi.register({
        name: cleanName,
        email: cleanEmail,
        password,
      })

      console.log('Registration response:', response.data)

      /*
       * Expected backend response:
       *
       * {
       *   token: "...",
       *   user: {
       *     id: "...",
       *     name: "...",
       *     email: "...",
       *     role: "BUYER"
       *   }
       * }
       */

      const token = response.data?.token
      const user = response.data?.user

      if (!token) {
        throw new Error(
          'Registration succeeded, but the server did not return an authentication token.'
        )
      }

      if (!user) {
        throw new Error(
          'Registration succeeded, but the server did not return the user account.'
        )
      }

      await setAuthToken(token, true)

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      )

      /*
       * Give the auth state a moment to update before
       * navigating to the marketplace.
       */
      navigate('/', {
        replace: true,
      })
    } catch (err) {
      console.error('Registration error:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout variant="register">
      <div className="w-full min-w-0 lg:w-1/2">
        <RegisterHero />
      </div>

      <div className="flex w-full min-w-0 justify-center lg:w-1/2 lg:justify-end">
        <div className="w-full min-w-0 max-w-md">
          <AuthFormCard
            title="Create Account"
            subtitle="Start your journey with Digital City Center today."
          >
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}

              <AuthInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                icon={User}
                required
                autoComplete="name"
                variant="auth"
              />

              {/* Email */}

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

              {/* Password */}

              <AuthInput
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                hint={PASSWORD_HINT}
                required
                autoComplete="new-password"
                variant="auth"
                rightElement={
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              {/* Account type */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account Type
                </label>

                <div className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Buyer
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Seller accounts require separate seller registration
                  and approval.
                </p>
              </div>

              {/* Terms */}

              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary"
                />

                <span className="text-sm leading-snug text-slate-600">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="font-semibold text-dcc-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="font-semibold text-dcc-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-dcc-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? 'Creating account...'
                  : 'Register Now'}
              </button>
            </form>

            {/* Divider */}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center text-xs uppercase tracking-wide text-slate-400">
                <span className="bg-white px-2">
                  or
                </span>
              </div>
            </div>

            {/* Google */}

            <GoogleSignInButton label="Sign in with Google" />

            {/* Login */}

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-dcc-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </AuthFormCard>
        </div>
      </div>
    </AuthPageLayout>
  )
}

