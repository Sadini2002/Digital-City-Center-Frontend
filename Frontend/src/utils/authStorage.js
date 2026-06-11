const TOKEN_KEY = 'dcc_token'
const ADMIN_TOKEN_KEY = 'dcc_admin_token'

const memoryTokens = {
  user: null,
  admin: null,
}

function isSecureContext() {
  return (
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
}

function buildCookieFlags(maxAgeSeconds) {
  const flags = ['Path=/', 'SameSite=Strict']
  if (maxAgeSeconds > 0) flags.push(`Max-Age=${maxAgeSeconds}`)
  if (isSecureContext()) flags.push('Secure')
  return flags.join('; ')
}

function clearLegacyClientCookie(name) {
  document.cookie = `${name}=; ${buildCookieFlags(0)}`
}

async function setHttpOnlySession(cookieName, token, rememberMe) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
  const response = await fetch('/api/auth/set-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, cookieName, maxAge }),
  })
  return response.ok
}

async function clearHttpOnlySession(cookieName) {
  try {
    await fetch('/api/auth/clear-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cookieName }),
    })
  } catch {
    // Session endpoint may be unavailable outside dev server.
  }
}

async function persistToken(kind, token, rememberMe = false) {
  const cookieName = kind === 'admin' ? ADMIN_TOKEN_KEY : TOKEN_KEY

  memoryTokens[kind] = token
  clearLegacyClientCookie(cookieName)

  try {
    const httpOnlySet = await setHttpOnlySession(cookieName, token, rememberMe)
    if (httpOnlySet) return
  } catch {
    // Session endpoint unavailable — token kept in memory only (not in JS-readable cookies).
  }
}

function resolveToken(kind) {
  if (memoryTokens[kind]) return memoryTokens[kind]

  const legacyKey = kind === 'admin' ? 'admin_token' : 'token'
  const legacy = localStorage.getItem(legacyKey)
  if (legacy) {
    memoryTokens[kind] = legacy
    return legacy
  }

  return null
}

async function removeToken(kind) {
  memoryTokens[kind] = null
  const cookieName = kind === 'admin' ? ADMIN_TOKEN_KEY : TOKEN_KEY
  const legacyKey = kind === 'admin' ? 'admin_token' : 'token'

  localStorage.removeItem(legacyKey)
  clearLegacyClientCookie(cookieName)
  await clearHttpOnlySession(cookieName)
}

export async function hydrateAuthFromSession() {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'include' })
    if (!response.ok) return
    const data = await response.json()
    if (data.token) memoryTokens.user = data.token
    if (data.adminToken) memoryTokens.admin = data.adminToken
  } catch {
    // Session endpoint may be unavailable outside dev server.
  }
}

export async function setAuthToken(token, rememberMe = false) {
  if (!token) return
  localStorage.removeItem('token')
  await persistToken('user', token, rememberMe)
}

export function getAuthToken() {
  return resolveToken('user')
}

export async function clearAuthToken() {
  await removeToken('user')
}

export async function setAdminToken(token, rememberMe = false) {
  if (!token) return
  localStorage.removeItem('admin_token')
  await persistToken('admin', token, rememberMe)
}

export function getAdminToken() {
  return resolveToken('admin')
}

export async function clearAdminToken() {
  await removeToken('admin')
}
