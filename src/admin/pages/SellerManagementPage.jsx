import {
  useEffect,
  useState,
} from 'react'

import {
  Check,
  X,
  Ban,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  adminApi,
} from '../services/adminApi'

function StatusPill({
  status,
}) {
  const normalized =
    String(
      status || 'pending'
    ).toLowerCase()

  if (
    normalized ===
    'approved'
  ) {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        Approved
      </span>
    )
  }

  if (
    normalized ===
    'rejected'
  ) {
    return (
      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
        Rejected
      </span>
    )
  }

  if (
    normalized ===
    'suspended'
  ) {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        Suspended
      </span>
    )
  }

  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Pending
    </span>
  )
}

export default function SellerManagementPage() {
  const [
    applications,
    setApplications,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    actionId,
    setActionId,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState('')

  const loadSellers =
    async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await adminApi.getPendingSellers()

        const sellers =
          response.data?.pending ||
          []

        setApplications(
          sellers
        )
      } catch (err) {
        console.error(
          'Load sellers error:',
          err
        )

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            'Failed to load seller applications.'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadSellers()
  }, [])

  const approve =
    async (sellerId) => {
      try {
        setActionId(
          sellerId
        )

        await adminApi.approveSeller(
          sellerId
        )

        toast.success(
          'Seller approved successfully.'
        )

        /*
         * Reload from database.
         */
        await loadSellers()
      } catch (err) {
        console.error(
          'Approve seller error:',
          err
        )

        toast.error(
          err.response?.data
            ?.message ||
            'Failed to approve seller.'
        )
      } finally {
        setActionId(null)
      }
    }

  const reject =
    async (sellerId) => {
      const reason =
        window.prompt(
          'Enter the reason for rejecting this seller:'
        )

      if (
        reason === null
      ) {
        return
      }

      if (
        !reason.trim()
      ) {
        toast.error(
          'Rejection reason is required.'
        )

        return
      }

      try {
        setActionId(
          sellerId
        )

        await adminApi.rejectSeller(
          sellerId,
          reason.trim()
        )

        toast.success(
          'Seller rejected successfully.'
        )

        await loadSellers()
      } catch (err) {
        console.error(
          'Reject seller error:',
          err
        )

        toast.error(
          err.response?.data
            ?.message ||
            'Failed to reject seller.'
        )
      } finally {
        setActionId(null)
      }
    }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Seller Management
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Review and manage seller
            applications.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSellers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? 'animate-spin'
                : ''
            }`}
          />

          Refresh
        </button>
      </div>

      {/* INFO */}

      <div className="rounded-xl border border-dcc-primary/20 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        Review seller business
        information before approving
        access to the seller portal.
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* PENDING */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pending Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sellers waiting for
              approval.
            </p>
          </div>

          {!loading && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {applications.length}{' '}
              pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-dcc-primary" />

            <p className="mt-3 text-sm text-slate-500">
              Loading seller
              applications...
            </p>
          </div>
        ) : applications.length ===
          0 ? (
          <div className="py-12 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 font-semibold text-slate-700">
              No pending seller
              applications
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New seller registrations
              will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">

            {applications.map(
              (seller) => {
                const busy =
                  actionId ===
                  seller.id

                return (
                  <div
                    key={
                      seller.id
                    }
                    className="rounded-xl border border-slate-200 p-5"
                  >

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                      {/* SELLER INFO */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {
                              seller.shopName
                            }
                          </h3>

                          <StatusPill
                            status={
                              seller.status
                            }
                          />
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <span className="font-semibold">
                              Owner:
                            </span>{' '}
                            {
                              seller.owner
                                ?.name
                            }
                          </p>

                          <p>
                            <span className="font-semibold">
                              Email:
                            </span>{' '}
                            {
                              seller.owner
                                ?.email
                            }
                          </p>

                          <p>
                            <span className="font-semibold">
                              Phone:
                            </span>{' '}
                            {
                              seller.owner
                                ?.phone ||
                              'Not provided'
                            }
                          </p>

                          <p>
                            <span className="font-semibold">
                              Business:
                            </span>{' '}
                            {
                              seller.businessType
                            }
                          </p>

                          <p>
                            <span className="font-semibold">
                              Shop URL:
                            </span>{' '}
                            {seller.shopUrl ||
                              'Not generated'}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Registered:
                            </span>{' '}
                            {seller.createdAt
                              ? new Date(
                                  seller.createdAt
                                ).toLocaleDateString()
                              : '-'}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            approve(
                              seller.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" />

                          {busy
                            ? 'Processing...'
                            : 'Approve'}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            reject(
                              seller.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <X className="h-4 w-4" />

                          Reject
                        </button>
                      </div>

                    </div>
                  </div>
                )
              }
            )}

          </div>
        )}

      </section>
    </div>
  )
}