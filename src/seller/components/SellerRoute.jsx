import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken } from '../../utils/authStorage'
import { sellerApi } from '../services/sellerApi'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

function isSellerRole(role) {
  return String(role ?? '').toUpperCase() === 'SELLER'
}

export default function SellerRoute({ children }) {
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [status, setStatus] = useState(null)

  const token = getAuthToken()
  const user = getStoredUser()

  useEffect(() => {
    let mounted = true

    async function checkSeller() {
      // No authentication
      if (!token) {
        if (mounted) {
          setAllowed(false)
          setLoading(false)
        }
        return
      }

      // Must be seller
      if (!isSellerRole(user?.role)) {
        if (mounted) {
          setAllowed(false)
          setLoading(false)
        }
        return
      }

      try {
        const response = await sellerApi.getMe()

        const seller =
          response?.data?.seller ||
          response?.seller

        const sellerStatus = String(
          seller?.status || ''
        ).toLowerCase()

        if (mounted) {
          setStatus(sellerStatus)

          if (sellerStatus === 'approved') {
            setAllowed(true)
          } else {
            setAllowed(false)
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Seller route check failed:', error)

        if (mounted) {
          setAllowed(false)
          setLoading(false)
        }
      }
    }

    checkSeller()

    return () => {
      mounted = false
    }
  }, [token, user?.role])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Checking seller account...
          </p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  // Not seller
  if (!isSellerRole(user?.role)) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  // Seller is not approved
  if (!allowed) {
    return (
      <Navigate
        to="/seller/application-status"
        replace
        state={{
          status,
        }}
      />
    )
  }

  return children
}