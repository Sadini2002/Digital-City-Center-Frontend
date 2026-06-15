const TOKEN_KEY = 'dcc_token'
const ADMIN_TOKEN_KEY = 'dcc_admin_token'

const memoryTokens = {
  user: null,
  admin: null,
}

function isSecureContext() {
  return true
}

function buildCookieFlags(maxAgeSeconds) {
  const flags = ['Path=/', 'SameSite=Lax']
  if (maxAgeSeconds > 0) flags.push(`Max-Age=${maxAgeSeconds}`)
  flags.push('Secure')
  return flags.join('; ')
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function clearCookie(name) {
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
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7

  memoryTokens[kind] = token

  try {
    const httpOnlySet = await setHttpOnlySession(cookieName, token, rememberMe)
    if (httpOnlySet) return
  } catch {
    // Fall back to client-visible secure cookie when session endpoint is unavailable.
  }

  document.cookie = `${cookieName}=${encodeURIComponent(token)}; ${buildCookieFlags(maxAge)}`
}

function resolveToken(kind) {
  if (memoryTokens[kind]) return memoryTokens[kind]

  const cookieName = kind === 'admin' ? ADMIN_TOKEN_KEY : TOKEN_KEY
  const cookieToken = readCookie(cookieName)
  if (cookieToken) {
    memoryTokens[kind] = cookieToken
    return cookieToken
  }

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
  clearCookie(cookieName)
  await clearHttpOnlySession(cookieName)
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

/** Restore auth tokens from cookies / legacy storage on app boot. */
export async function hydrateAuthFromSession() {
  resolveToken('user')
  resolveToken('admin')
}
