const AUTH_TOKEN_KEY = 'dcc_token'
const ADMIN_TOKEN_KEY = 'dcc_admin_token'
const USER_KEY = 'user'

/* =========================================================
   AUTH TOKEN
========================================================= */

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token, remember = true) {
  if (!token) return

  if (remember) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  }

  window.dispatchEvent(new Event('auth-changed'))
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)

  window.dispatchEvent(new Event('auth-changed'))
}

/* Old name used by some components */
export function removeAuthToken() {
  clearAuthToken()
}

/* =========================================================
   ADMIN TOKEN
========================================================= */

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  if (!token) return

  localStorage.setItem(ADMIN_TOKEN_KEY, token)

  window.dispatchEvent(new Event('auth-changed'))
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)

  window.dispatchEvent(new Event('auth-changed'))
}

/* =========================================================
   USER
========================================================= */

export function getStoredUser() {
  try {
    const value = localStorage.getItem(USER_KEY)

    if (!value) {
      return null
    }

    return JSON.parse(value)
  } catch (error) {
    console.error('Unable to read stored user:', error)
    return null
  }
}

export function setStoredUser(user) {
  if (!user) {
    localStorage.removeItem(USER_KEY)
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  window.dispatchEvent(new Event('auth-changed'))
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY)

  window.dispatchEvent(new Event('auth-changed'))
}

/* =========================================================
   AUTH SESSION
========================================================= */

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

/*
 * Used by main.jsx if your project calls it.
 */
export function hydrateAuthFromSession() {
  const token = getAuthToken()
  const user = getStoredUser()

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export function logout() {
  clearAuthToken()
  clearAdminToken()
  clearStoredUser()

  window.dispatchEvent(new Event('auth-changed'))
}