import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import {
  ArrowRight,
  BarChart3,
  Package,
  ShoppingBag,
  Star,
  Wallet,
  RefreshCw,
} from 'lucide-react'

import DashboardCard from '../components/DashboardCard'

import {
  sellerApi,
} from '../services/sellerApi'

function formatLKR(value) {
  return new Intl.NumberFormat(
    'en-LK',
    {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  )
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(
    value
  ).toLocaleDateString(
    'en-LK',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}

function statusLabel(status) {
  return String(
    status || 'placed'
  )
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    )
}

function statusClass(status) {
  const value =
    String(
      status || ''
    ).toLowerCase()

  if (
    value === 'delivered'
  ) {
    return 'bg-green-50 text-green-700'
  }

  if (
    value === 'cancelled' ||
    value === 'rejected'
  ) {
    return 'bg-red-50 text-red-700'
  }

  if (
    value === 'processing' ||
    value === 'confirmed'
  ) {
    return 'bg-blue-50 text-blue-700'
  }

  return 'bg-amber-50 text-amber-700'
}

export default function SellerDashboard() {
  const [data, setData] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadDashboard =
    async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await sellerApi.getDashboard()

        setData(
          response.data
        )
      } catch (err) {
        console.error(
          'Dashboard error:',
          err
        )

        setError(
          err.message ||
            'Failed to load dashboard.'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-xl bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl bg-slate-200"
              />
            )
          )}
        </div>

        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load seller dashboard
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    )
  }

  const seller =
    data?.seller || {}

  const stats =
    data?.stats || {}

  const recentOrders =
    data?.recentOrders || []

  return (
    <div className="space-y-6">

      {/* -------------------------------------------------
          WELCOME
      ------------------------------------------------- */}

      <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-dcc-primary">
              Seller Center
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Welcome to{' '}
              {seller.shopName ||
                'your shop'}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Track your listings,
              orders and earnings
              from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/seller/listings/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Add listing
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/seller/orders"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View orders
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------
          SUMMARY CARDS
      ------------------------------------------------- */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Listings"
          value={
            stats.totalListings ?? 0
          }
          hint={`${stats.activeListings ?? 0} active`}
          icon={ShoppingBag}
          to="/seller/listings"
        />

        <DashboardCard
          title="Today's Orders"
          value={
            stats.todaysOrders ?? 0
          }
          hint={`${stats.pendingOrders ?? 0} pending`}
          icon={Package}
          to="/seller/orders"
        />

        <DashboardCard
          title="Total Earnings"
          value={formatLKR(
            stats.netEarnings
          )}
          hint={`Sales ${formatLKR(
            stats.grossSales
          )}`}
          icon={Wallet}
          to="/seller/earnings"
        />

        <DashboardCard
          title="Pending Payout"
          value={formatLKR(
            stats.pendingPayout
          )}
          hint={`Commission ${formatLKR(
            stats.platformCommission
          )}`}
          icon={BarChart3}
          to="/seller/earnings"
        />

      </section>

      {/* -------------------------------------------------
          SHOP RATING
      ------------------------------------------------- */}

      <section className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Star className="h-5 w-5 fill-current" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Shop Rating
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {Number(
                    seller.rating || 0
                  ).toFixed(1)}
                </span>

                <span className="text-sm text-slate-500">
                  / 5
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Based on{' '}
            {seller.reviewCount ||
              0}{' '}
            customer reviews.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Platform Commission
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {Number(
              seller.commissionRate ||
                0
            ).toFixed(1)}
            %
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Current commission rate
            applied to seller sales.
          </p>
        </div>

      </section>

      {/* -------------------------------------------------
          RECENT ORDERS
      ------------------------------------------------- */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your latest seller orders
            </p>
          </div>

          <Link
            to="/seller/orders"
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No orders yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Orders containing your
              products will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-900">
                          #
                          {
                            order.orderNumber
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {
                              order.customer
                                ?.name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              order.customer
                                ?.email
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {formatLKR(
                          order.sellerSubtotal
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                            order.orderStatus
                          )}`}
                        >
                          {statusLabel(
                            order.orderStatus
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </section>

    </div>
  )
}