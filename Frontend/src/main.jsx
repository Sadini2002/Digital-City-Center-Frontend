import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global Cookie Interceptor to enforce Secure and simulate HttpOnly
try {
  const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                     Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
  if (cookieDesc && cookieDesc.set) {
    const shadowCookies = {};
    Object.defineProperty(document, 'cookie', {
      get() {
        const realVal = cookieDesc.get.call(document) || '';
        const stack = new Error().stack || '';
        const isInternal = stack.includes('authStorage') || stack.includes('readCookie') || stack.includes('clearCookie');
        
        if (isInternal) {
          const parts = [];
          if (realVal) parts.push(realVal);
          for (const [k, v] of Object.entries(shadowCookies)) {
            if (!realVal.includes(`${k}=`)) {
              parts.push(`${k}=${v}`);
            }
          }
          return parts.join('; ');
        } else {
          return realVal.split(';').filter(cookie => {
            const trimmed = cookie.trim();
            if (!trimmed) return false;
            const name = trimmed.split('=')[0].trim();
            return name !== 'dcc_token' && name !== 'dcc_admin_token' && name !== 'ajs_anonymous_id';
          }).join('; ');
        }
      },
      set(val) {
        let cookieStr = String(val);
        if (!/;[\s]*secure/i.test(cookieStr)) {
          cookieStr = cookieStr.trim().replace(/;$/, '') + '; Secure';
        }
        if (!/;[\s]*samesite/i.test(cookieStr)) {
          cookieStr = cookieStr.trim().replace(/;$/, '') + '; SameSite=Lax';
        }
        const match = cookieStr.match(/^([^=]+)=([^;]+)/);
        if (match) {
          const name = match[1].trim();
          const value = match[2].trim();
          if (name === 'dcc_token' || name === 'dcc_admin_token' || name === 'ajs_anonymous_id') {
            shadowCookies[name] = value;
          }
        }
        cookieDesc.set.call(document, cookieStr);
      },
      configurable: true
    });
  }
} catch (e) {
  console.warn('Cookie interceptor setup failed:', e);
}

import './index.css'
import App from './App.jsx'
import { getAuthToken, hydrateAuthFromSession, setAuthToken } from './utils/authStorage'

async function bootstrap() {
  await hydrateAuthFromSession()

  const legacyToken = localStorage.getItem('token')
  if (legacyToken && !getAuthToken()) {
    await setAuthToken(legacyToken, localStorage.getItem('rememberMe') === 'true')
    localStorage.removeItem('token')
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
