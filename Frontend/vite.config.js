import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

  return {
    name: 'secure-auth-cookie',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/auth/')) return next()

        const host = req.headers.host || ''
        const isLocalhost =
          host.startsWith('localhost') || host.startsWith('127.0.0.1')
        const secure =
          isLocalhost ||
          req.headers['x-forwarded-proto'] === 'https' ||
          req.socket?.encrypted === true

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
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), secureAuthCookiePlugin()],
})

