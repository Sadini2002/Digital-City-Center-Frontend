import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Package,
  ShoppingBag,
  Star,
  Wallet,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

import DashboardCard from '../components/DashboardCard'
import StatusBadge from '../components/StatusBadge'
import { sellerApi } from '../services/sellerApi'

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-LK')}`
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(value).toLocaleDateString(
    'en-LK',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}

function getOrderStatus(order) {
  return (
    order?.orderStatus ||
    order?.status ||
    'pending'
  )
}

export default function SellerDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const response =
        await sellerApi.getDashboard()

      setDashboard(response.data)
    } catch (err) {
      console.error(
        'Seller dashboard error:',
        err
      )

      setError(
        err?.message ||
          'Unable to load seller dashboard.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-900">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadDashboard()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    )
  }

  const seller = dashboard?.seller || {}
  const summary = dashboard?.summary || {}

  const todayOrders =
    dashboard?.todayOrders || []

  const recentOrders =
    dashboard?.recentOrders || []

  const lowStockProducts =
    dashboard?.lowStockProducts || []

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-medium text-dcc-primary">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Hi, {seller?.owner?.name || 'Seller'}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Here's what's happening with{' '}
              <strong>
                {seller.shopName || 'your shop'}
              </strong>{' '}
              today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh
          </button>

        </div>

        <div className="mt-4 flex flex-wrap gap-2">

          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-dcc-primary-hover"
          >
            Add listing
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View orders
          </Link>

        </div>
      </section>

      {/* =====================================================
          LOW STOCK
      ====================================================== */}

      {lowStockProducts.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="flex-1">

              <h3 className="font-bold text-amber-950">
                Low Stock Alert
              </h3>

              <p className="mt-1 text-sm text-amber-700">
                Some of your listings are running
                low on stock.
              </p>

              <div className="mt-3 space-y-2">

                {lowStockProducts.map(
                  (product) => (
                    <div
                      key={product.variantId}
                      className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {product.title}
                      </span>

                      <span className="text-sm font-bold text-amber-700">
                        {product.stock} left
                      </span>
                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Listings"
          value={
            summary.totalListings || 0
          }
          hint={`${summary.activeListings || 0} active listings`}
          icon={ShoppingBag}
          to="/seller/listings"
        />

        <DashboardCard
          title="Today's Orders"
          value={
            summary.todayOrders || 0
          }
          hint={`${summary.totalOrders || 0} total orders`}
          icon={Package}
          to="/seller/orders"
        />

        <DashboardCard
          title="Net Earnings"
          value={formatCurrency(
            summary.netEarnings
          )}
          hint={`Commission ${formatCurrency(
            summary.commission
          )}`}
          icon={Wallet}
          to="/seller/earnings"
        />

        <DashboardCard
          title="Rating"
          value={Number(
            seller.rating || 0
          ).toFixed(1)}
          hint={`${seller.reviewCount || 0} reviews`}
          icon={Star}
          to="/seller/settings"
        />

      </section>

      {/* =====================================================
          TODAY'S ORDERS
      ====================================================== */}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

          <div>
            <h2 className="font-bold text-slate-900">
              Today's orders
            </h2>

            <p className="text-sm text-slate-500">
              Orders received today
            </p>
          </div>

          <Link
            to="/seller/orders"
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View all
          </Link>

        </div>

        {todayOrders.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-400" />

            <p className="mt-2 text-sm font-medium text-slate-600">
              No orders today
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">

            <table className="w-full min-w-[42rem] text-left text-sm">

              <thead>
                <tr className="bg-slate-50 text-slate-600">

                  <th className="px-4 py-3 font-semibold">
                    Order
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {todayOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80"
                    >

                      <td className="px-4 py-3">

                        <p className="font-semibold text-slate-900">
                          {order.orderNumber ||
                            order.id}
                        </p>

                        <p className="text-xs text-slate-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </p>

                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">
                          {order.customer?.name ||
                            'Customer'}
                        </p>

                        <p className="text-xs text-slate-500">
                          {order.customer?.email ||
                            ''}
                        </p>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(
                          order.sellerTotal
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={getOrderStatus(
                            order
                          )}
                        />
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* =====================================================
          PENDING PAYOUT
      ====================================================== */}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-slate-500">
              Pending payout
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(
                summary.pendingPayout
              )}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Earnings from orders that are
              still being processed.
            </p>
          </div>

          <Link
            to="/seller/earnings"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View earnings
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

      {/* =====================================================
          RECENT ORDERS
      ====================================================== */}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

          <div>
            <h2 className="font-bold text-slate-900">
              Recent orders
            </h2>

            <p className="text-sm text-slate-500">
              Latest activity from your shop
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
          <div className="rounded-lg bg-slate-50 p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-400" />

            <p className="mt-2 text-sm text-slate-500">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">

            <table className="w-full min-w-[36rem] text-left text-sm">

              <thead>
                <tr className="bg-slate-50 text-slate-600">

                  <th className="px-4 py-3 font-semibold">
                    Order ID
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {recentOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80"
                    >

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {order.orderNumber ||
                          order.id}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {order.customer?.name ||
                          'Customer'}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(
                          order.sellerTotal
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={getOrderStatus(
                            order
                          )}
                        />
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