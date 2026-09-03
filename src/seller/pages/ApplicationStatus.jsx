import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'

import {
  sellerApi,
} from '../services/sellerApi'

export default function ApplicationStatus() {
  const navigate =
    useNavigate()

  const [seller, setSeller] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadStatus =
    async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await sellerApi.getMe()

        const sellerData =
          response.data?.seller

        setSeller(sellerData)

        if (
          String(
            sellerData?.status || ''
          ).toLowerCase() ===
          'approved'
        ) {
          navigate(
            '/seller/dashboard',
            {
              replace: true,
            }
          )
        }
      } catch (err) {
        console.error(
          err
        )

        setError(
          err.message ||
            'Unable to load seller status.'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-dcc-primary" />

          <p className="mt-3 text-sm text-slate-500">
            Checking seller application...
          </p>
        </div>
      </div>
    )
  }

  const status =
    String(
      seller?.status || 'pending'
    ).toLowerCase()

  const isApproved =
    status === 'approved'

  const isRejected =
    status === 'rejected'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {isApproved ? (
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
        ) : isRejected ? (
          <XCircle className="mx-auto h-14 w-14 text-red-600" />
        ) : (
          <Clock className="mx-auto h-14 w-14 text-amber-500" />
        )}

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          {isApproved
            ? 'Seller account approved'
            : isRejected
              ? 'Seller application rejected'
              : 'Seller application pending'}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isApproved
            ? 'Your seller account has been approved. You can now access your seller dashboard.'
            : isRejected
              ? 'Your seller application was rejected. Please contact the platform administrator for more information.'
              : 'Your seller account has been created successfully. An administrator needs to approve your seller account before you can access the seller dashboard.'}
        </p>

        {seller?.shopName && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Shop
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {seller.shopName}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Status:{' '}
              <span className="font-semibold capitalize">
                {status}
              </span>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!isApproved && (
            <button
              type="button"
              onClick={loadStatus}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Check status
            </button>
          )}

          {isApproved && (
            <Link
              to="/seller/dashboard"
              className="rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Open Seller Dashboard
            </Link>
          )}

          <Link
            to="/"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}