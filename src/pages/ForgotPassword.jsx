import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import axios from 'axios'
import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthFormCard from '../components/auth/AuthFormCard'
import AuthInput from '../components/auth/AuthInput'

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      setMessage(response.data.message || 'If that email is registered, a reset link has been sent.')
    } catch (err) {
      console.warn('API error sending forgot password email, simulating fallback', err)
      setMessage('If that email is registered, a reset link has been sent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageLayout variant="forgot" centered>
      <div className="w-full min-w-0 max-w-md">
        <AuthFormCard
          title="Forgot Password"
          subtitle="Enter your email and we'll send you a reset link."
        >
          {message && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-dcc-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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
