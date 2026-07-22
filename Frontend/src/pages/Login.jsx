import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('BUYER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const role = response.data.user.role;
      if (role === 'SELLER') navigate('/seller/dashboard');
      else if (role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              fontSize: '13px', backgroundColor: '#f9fafb', color: '#111',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🤍</span>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🛒</span>
          <Link to="/login" style={{
            fontSize: '13px', color: '#111', border: '1px solid #ddd',
            padding: '6px 14px', borderRadius: '8px', textDecoration: 'none'
          }}>Sign In</Link>
          <Link to="/register" style={{
            fontSize: '13px', color: '#fff', backgroundColor: '#4F46E5',
            padding: '6px 14px', borderRadius: '8px', textDecoration: 'none'
          }}>Register</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 420px',
        gap: '2rem', maxWidth: '1100px',
        margin: '3rem auto', padding: '0 2rem', alignItems: 'start'
      }}>

        {/* LEFT SIDE */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', color: '#4F46E5', textTransform: 'uppercase', marginBottom: '1rem' }}>
            One account, infinite possibilities
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', lineHeight: '1.2', marginBottom: '1rem' }}>
            Everything You Need,<br />
            From <span style={{ color: '#4F46E5' }}>Everyone You Love</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '380px' }}>
            Join the fastest growing marketplace in Sri Lanka. Buy from verified local shops or start selling your own products to thousands of customers today.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: '🛍️', title: 'Smart Shopping', desc: 'Access flash deals and personalized recommendations.' },
              { icon: '🏪', title: 'Seller Hub', desc: 'Powerful tools to grow your business across the nation.' }
            ].map(card => (
              <div key={card.title} style={{
                backgroundColor: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '12px', padding: '1rem'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>{card.title}</h3>
                <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.5' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LOGIN CARD */}
        <div style={{
          backgroundColor: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '2rem'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>Welcome Back</h2>
          <p style={{ fontSize: '13px', color: '#777', marginBottom: '1.5rem' }}>Unified login for Buyers and Sellers</p>

          {/* TABS */}
          <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {['BUYER', 'SELLER'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px', fontSize: '13px', border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === tab ? '#4F46E5' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#777'
                }}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              backgroundColor: '#fff0f0', border: '1px solid #ffcccc',
              color: '#cc0000', padding: '10px 12px', borderRadius: '8px',
              marginBottom: '1rem', fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div style={{ marginBottom: '1rem' }}>
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

            {/* PASSWORD */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999' }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%', padding: '9px 36px 9px 34px',
                    border: '1px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '13px', backgroundColor: '#f9fafb',
                    color: '#111', boxSizing: 'border-box'
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', color: '#999' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me for 30 days
              </label>
              <Link to="/forgot-password" style={{ fontSize: '12px', color: '#4F46E5', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '10px', backgroundColor: '#4F46E5',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '1rem'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
            <span style={{ fontSize: '12px', color: '#aaa' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
          </div>

          {/* GOOGLE */}
          <button style={{
            width: '100%', padding: '9px', border: '1px solid #e5e7eb',
            borderRadius: '8px', backgroundColor: '#fff', fontSize: '13px',
            color: '#111', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.2-11.3-7.8l-6.5 5C9.6 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.1-2.1 3.9-3.8 5.2l6.2 5.2C37.3 36.2 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#777' }}>
            Don't have an account? <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
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
}
