import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/api'

const STORAGE_TOKEN = 'token'
const STORAGE_USER = 'user'
const STORAGE_USERS = 'dcc_users'

const demoUserAccounts = [
  {
    id: 'buyer-demo',
    name: 'Demo Buyer',
    fullName: 'Demo Buyer',
    email: 'buyer@demo.local',
    password: 'Demo123!',
    role: 'BUYER',
    verified: true,
  },
  {
    id: 'seller-demo',
    name: 'Demo Seller',
    fullName: 'Demo Seller',
    email: 'seller@demo.local',
    password: 'Seller123!',
    role: 'SELLER',
    verified: true,
  },
  {
    id: 'delivery-demo',
    name: 'Demo Delivery Partner',
    fullName: 'Demo Delivery Partner',
    email: 'delivery@demo.local',
    password: 'Deliver123!',
    role: 'DELIVERY_PROVIDER',
    verified: true,
  },
]

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER) || 'null')
  } catch {
    return null
  }
}

function loadStoredToken() {
  return localStorage.getItem(STORAGE_TOKEN)
}

function saveAuthState(user, token) {
  if (user) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_USER)
  }

  if (token) {
    localStorage.setItem(STORAGE_TOKEN, token)
  } else {
    localStorage.removeItem(STORAGE_TOKEN)
  }
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]')
  } catch {
    return []
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users))
}

function ensureDemoUsers() {
  const users = getStoredUsers()
  if (users.length === 0) {
    saveStoredUsers(demoUserAccounts)
    return demoUserAccounts
  }
  return users
}

function sanitizeUser(user) {
  const { password, ...rest } = user
  return {
    ...rest,
    fullName: rest.fullName || rest.name || rest.email,
  }
}

function fallbackLogin({ email, password }) {
  const users = ensureDemoUsers()
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!found) {
    throw new Error('Invalid email or password.')
  }
  return sanitizeUser(found)
}

function fallbackRegister({ name, email, password }) {
  const users = ensureDemoUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email is already registered.')
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    fullName: name,
    email,
    password,
    role: 'BUYER',
    verified: false,
  }
  const updatedUsers = [...users, newUser]
  saveStoredUsers(updatedUsers)
  return sanitizeUser(newUser)
}

function fallbackForgotPassword(email) {
  ensureDemoUsers()
  return {
    message:
      'If your email is registered, you will receive a password reset link shortly. Check your inbox.',
  }
}

function fallbackResetPassword({ email, token, newPassword }) {
  const users = ensureDemoUsers()
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (userIndex === -1) {
    return {
      message:
        'If your email is registered, your password has been reset. Please check your inbox for the reset token.',
    }
  }

  const updatedUser = {
    ...users[userIndex],
    password: newPassword,
  }
  const updatedUsers = [...users]
  updatedUsers[userIndex] = updatedUser
  saveStoredUsers(updatedUsers)

  const storedUser = loadStoredUser()
  if (storedUser?.email?.toLowerCase() === email.toLowerCase()) {
    saveAuthState(sanitizeUser(updatedUser), loadStoredToken())
  }

  return {
    message: 'Your password has been updated successfully. You may now sign in with the new password.',
  }
}

function fallbackGoogleSignIn() {
  const users = ensureDemoUsers()
  const buyerAccount = users.find((u) => u.role === 'BUYER')
  if (!buyerAccount) {
    throw new Error('Google sign-in is unavailable at this time.')
  }
  return sanitizeUser(buyerAccount)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser())

  const logout = useCallback(() => {
    saveAuthState(null, null)
    setUser(null)
  }, [])

  const login = useCallback(
    async ({ email, password }) => {
      if (!email || !password) {
        throw new Error('Email and password are required.')
      }

      if (!loadStoredToken() && !loadStoredUser()) {
        ensureDemoUsers()
      }

      try {
        const response = await authApi.login({ email, password })
        const { token, user: apiUser } = response.data
        if (!token || !apiUser) {
          throw new Error('Invalid login response from the backend.')
        }
        const normalized = sanitizeUser(apiUser)
        saveAuthState(normalized, token)
        setUser(normalized)
        return normalized
      } catch (err) {
        if (err.status == null || String(err.message).toLowerCase().includes('network')) {
          const fallbackUser = fallbackLogin({ email, password })
          saveAuthState(fallbackUser, 'demo-token')
          setUser(fallbackUser)
          return fallbackUser
        }
        throw err
      }
    },
    [],
  )

  const register = useCallback(
    async ({ name, email, password }) => {
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required.')
      }

      try {
        const response = await authApi.register({ name, email, password })
        const { token, user: apiUser } = response.data
        if (!token || !apiUser) {
          throw new Error('Invalid registration response from the backend.')
        }
        const normalized = sanitizeUser(apiUser)
        saveAuthState(normalized, token)
        setUser(normalized)
        return normalized
      } catch (err) {
        if (err.status == null || String(err.message).toLowerCase().includes('network')) {
          const fallbackUser = fallbackRegister({ name, email, password })
          saveAuthState(fallbackUser, 'demo-token')
          setUser(fallbackUser)
          return fallbackUser
        }
        throw err
      }
    },
    [],
  )

  const forgotPassword = useCallback(async (email) => {
    if (!email) {
      throw new Error('Email is required.')
    }

    try {
      const response = await authApi.forgotPassword({ email })
      return response.data
    } catch (err) {
      if (err.status == null || String(err.message).toLowerCase().includes('network')) {
        return fallbackForgotPassword(email)
      }
      throw err
    }
  }, [])

  const resetPassword = useCallback(async ({ email, token, newPassword }) => {
    if (!email || !newPassword) {
      throw new Error('Email and new password are required.')
    }

    try {
      const response = await authApi.resetPassword({ email, token, password: newPassword })
      return response.data
    } catch (err) {
      if (err.status == null || String(err.message).toLowerCase().includes('network')) {
        return fallbackResetPassword({ email, token, newPassword })
      }
      throw err
    }
  }, [])

  const googleSignIn = useCallback(async () => {
    try {
      const response = await authApi.googleSignIn()
      const { token, user: apiUser } = response.data
      if (!token || !apiUser) {
        throw new Error('Invalid social login response.')
      }
      const normalized = sanitizeUser(apiUser)
      saveAuthState(normalized, token)
      setUser(normalized)
      return normalized
    } catch (err) {
      const fallbackUser = fallbackGoogleSignIn()
      saveAuthState(fallbackUser, 'demo-token')
      setUser(fallbackUser)
      return fallbackUser
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      googleSignIn,
    }),
    [user, login, register, logout, forgotPassword, resetPassword, googleSignIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
