import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Forgot Password</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          Enter your email and we'll send you a reset link.
        </p>

        {message && (
          <div style={{ backgroundColor: '#f0fff4', border: '1px solid #86efac', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}