import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function parseCookies(cookieHeader = '') {
  const cookies = {}
  cookieHeader.split(';').forEach((part) => {
    const trimmed = part.trim()
    if (!trimmed) return
    const separator = trimmed.indexOf('=')
    if (separator === -1) return
    const name = trimmed.slice(0, separator)
    const value = trimmed.slice(separator + 1)
    cookies[name] = decodeURIComponent(value)
  })
  return cookies
}

function secureAuthCookiePlugin() {
  const buildCookie = (name, value, maxAge, secure) => {
    const flags = [
      `${name}=${value}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      `Max-Age=${maxAge}`,
    ]
    if (secure) flags.push('Secure')
    return flags.join('; ')
  }

  const readBody = (req) =>
    new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {})
        } catch (error) {
          reject(error)
        }
      })
      req.on('error', reject)
    })

  const isSecureRequest = (req) => {
    const host = req.headers.host || ''
    const isLocalhost =
      host.startsWith('localhost') || host.startsWith('127.0.0.1')
    return (
      isLocalhost ||
      req.headers['x-forwarded-proto'] === 'https' ||
      req.socket?.encrypted === true
    )
  }

  const authMiddleware = async (req, res, next) => {
        if (!req.url?.startsWith('/api/auth/')) return next()

        const secure = isSecureRequest(req)

        if (req.url === '/api/auth/session' && req.method === 'GET') {
          const cookies = parseCookies(req.headers.cookie)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(
            JSON.stringify({
              token: cookies.dcc_token || null,
              adminToken: cookies.dcc_admin_token || null,
            }),
          )
          return
        }

        if (req.url === '/api/auth/set-session' && req.method === 'POST') {
          try {
            const { token, cookieName = 'dcc_token', maxAge = 60 * 60 * 24 * 7 } =
              await readBody(req)
            if (!token) {
              res.statusCode = 400
              res.end(JSON.stringify({ message: 'Token required' }))
              return
            }
            res.setHeader(
              'Set-Cookie',
              buildCookie(cookieName, encodeURIComponent(token), maxAge, secure),
            )
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ message: 'Invalid request' }))
          }
          return
        }

        if (req.url === '/api/auth/clear-session' && req.method === 'POST') {
          try {
            const { cookieName = 'dcc_token' } = await readBody(req)
            res.setHeader('Set-Cookie', buildCookie(cookieName, '', 0, secure))
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ message: 'Invalid request' }))
          }
          return
        }

        next()
  }

  return {
    name: 'secure-auth-cookie',
    configureServer(server) {
      server.middlewares.use(authMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(authMiddleware)
    },
  }
}

// https://vite.dev/config/
/// <reference types="vitest" />
export default defineConfig({
  plugins: [react(), secureAuthCookiePlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
