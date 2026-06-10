import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import AuthPageLayout from '../../components/auth/AuthPageLayout'
import AuthFormCard from '../../components/auth/AuthFormCard'
import AuthInput from '../../components/auth/AuthInput'
import { useAuth } from '../../context/AuthContext'

export default function ResetPassword() {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const token = params.token || searchParams.get('token') || ''
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Please complete all fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword({ email: email.trim(), token, newPassword })
      setMessage(response.message || 'Password reset successfully.')
      setEmail('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)
    } catch (err) {
      setError(err.message || 'Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout variant="forgot" centered>
      <div className="w-full min-w-0 max-w-md">
        <AuthFormCard
          title="Reset Password"
          subtitle={
            token
              ? 'Enter your registered email and choose a new password.'
              : 'Enter your email to reset your password. If you have a token, include it in the link.'
          }
        >
          {message && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              id="new-password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
              autoComplete="new-password"
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
            <AuthInput
              id="confirm-password"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
              autoComplete="new-password"
              variant="auth"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-dcc-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link to="/login" className="font-semibold text-dcc-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </AuthFormCard>
      </div>
    </AuthPageLayout>
  )
}
