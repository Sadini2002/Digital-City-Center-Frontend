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
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem', display: 'flex', alignItems: 'center',
        gap: '1.5rem', height: '56px'
      }}>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap' }}>
          Digital City Center
        </span>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          {['Home', 'Categories', 'Shops', 'Deals', 'About Us', 'Contact Us'].map(item => (
            <a key={item} href="#" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: '380px', margin: '0 1rem', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for products, brands and shops..."
            style={{
              width: '100%', padding: '7px 12px 7px 32px',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              fontSize: '13px', backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🤍</span>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🛒</span>
          <Link to="/login" style={{ fontSize: '13px', color: '#111', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none' }}>Sign In</Link>
          <Link to="/register" style={{ fontSize: '13px', color: '#fff', backgroundColor: '#4F46E5', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none' }}>Register</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', maxWidth: '1100px', margin: '3rem auto', padding: '0 2rem', alignItems: 'start' }}>

        {/* LEFT SIDE */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Account recovery
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', lineHeight: '1.2', marginBottom: '1rem' }}>
            Forgot Your<br />
            <span style={{ color: '#4F46E5' }}>Password?</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '380px' }}>
            No worries! Enter your email address and we'll send you a link to reset your password and get back to shopping in no time.
          </p>
          <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#4F46E5', marginBottom: '8px' }}>💡 What happens next?</h3>
            <ul style={{ fontSize: '13px', color: '#555', lineHeight: '2', paddingLeft: '1rem' }}>
              <li>We send a reset link to your email</li>
              <li>Click the link within 1 hour</li>
              <li>Create a new secure password</li>
              <li>Log back in and continue shopping</li>
            </ul>
          </div>
        </div>

        {/* FORGOT PASSWORD CARD */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1.25rem' }}>
            🔑
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Reset Password</h2>
          <p style={{ fontSize: '13px', color: '#777', marginBottom: '1.5rem' }}>Enter your email and we'll send you a reset link.</p>

          {/* SUCCESS */}
          {message && (
            <div style={{ backgroundColor: '#f0fff4', border: '1px solid #86efac', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
              ✅ {message}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999' }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%', padding: '9px 12px 9px 34px',
                    border: '1px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '13px', backgroundColor: '#f9fafb',
                    color: '#111', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '10px', backgroundColor: '#4F46E5',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '1rem'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#777' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>Back to Login</Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a1a2e', color: '#aaa', padding: '2.5rem 2rem 1.5rem', marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2rem', maxWidth: '1100px', margin: '0 auto 2rem' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Digital City Center</h3>
            <p style={{ fontSize: '12px', lineHeight: '1.7' }}>The ultimate destination for shopping and selling in Sri Lanka. Connect with local businesses and find great deals.</p>
          </div>
          {[
            { title: 'Company', links: ['About Us', 'Contact Us'] },
            { title: 'Resources', links: ['Privacy Policy', 'Terms of Service', 'Help Center'] },
            { title: 'Partners', links: ['Sell on DCC', 'Track Order'] }
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>{col.title}</h4>
              {col.links.map(link => (
                <a key={link} href="#" style={{ display: 'block', fontSize: '12px', color: '#aaa', textDecoration: 'none', marginBottom: '6px' }}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '11px' }}>© 2024 Digital City Center. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '18px' }}>
            <span style={{ cursor: 'pointer' }}>🌐</span>
            <span style={{ cursor: 'pointer' }}>💬</span>
            <span style={{ cursor: 'pointer' }}>🔔</span>
          </div>
        </div>
      </footer>
    </div>
  );
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
