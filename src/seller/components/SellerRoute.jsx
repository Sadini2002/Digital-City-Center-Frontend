import {
  Navigate,
  useLocation,
} from 'react-router-dom'

import {
  useEffect,
  useState,
} from 'react'

import {
  getAuthToken,
} from '../../utils/authStorage'

import {
  sellerApi,
} from '../services/sellerApi'

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('user') ||
        '{}'
    )
  } catch {
    return {}
  }
}

function isSellerRole(role) {
  return (
    String(role ?? '')
      .toUpperCase() ===
    'SELLER'
  )
}

export default function SellerRoute({
  children,
}) {
  const location =
    useLocation()

  const token =
    getAuthToken()

  const user =
    getStoredUser()

  const [status, setStatus] =
    useState('checking')

  const [sellerStatus, setSellerStatus] =
    useState(null)

  useEffect(() => {
    let mounted = true

    async function checkSeller() {
      if (
        !token ||
        !isSellerRole(user?.role)
      ) {
        if (mounted) {
          setStatus('unauthorized')
        }

        return
      }

      try {
        const response =
          await sellerApi.getMe()

        const seller =
          response.data?.seller

        if (!mounted) return

        setSellerStatus(
          String(
            seller?.status || ''
          ).toLowerCase()
        )

        if (
          String(
            seller?.status || ''
          ).toLowerCase() ===
          'approved'
        ) {
          setStatus('approved')
        } else {
          setStatus('not-approved')
        }
      } catch (error) {
        console.error(
          'Seller route check failed:',
          error
        )

        if (!mounted) return

        setStatus('not-approved')
      }
    }

    checkSeller()

    return () => {
      mounted = false
    }
  }, [token, user?.role])

  if (
    status === 'checking'
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-dcc-primary" />

          <p className="mt-3 text-sm text-slate-500">
            Verifying seller account...
          </p>
        </div>
      </div>
    )
  }

  if (
    status === 'unauthorized'
  ) {
    return (
      <Navigate
        to="/login?portal=seller"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    )
  }

  if (
    status === 'not-approved'
  ) {
    return (
      <Navigate
        to="/seller/application-status"
        replace
        state={{
          sellerStatus,
        }}
      />
    )
  }

  return children
}