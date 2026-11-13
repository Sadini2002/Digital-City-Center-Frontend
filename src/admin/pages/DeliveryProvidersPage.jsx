
import { useCallback, useEffect, useState } from 'react'
import {
  Check,
  Clock,
  Search,
  Truck,
  Users,
  X,
  Ban,
  RefreshCw,
  Loader2,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'

import adminDeliveryApi from '../../delivery/services/adminDeliveryApi'
import DeliveryAssignmentModal from '../components/delivery/DeliveryAssignmentModal'

const inputClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-dcc-primary focus:ring-2 focus:ring-dcc-primary/20'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  active: 'bg-emerald-50 text-emerald-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
  suspended: 'bg-slate-100 text-slate-600',
}

function StatusBadge({ status }) {
  const value = String(status || 'pending').toLowerCase()

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
        statusStyles[value] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {value === 'active' ? 'Approved' : value}
    </span>
  )
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value ?? 0}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default function DeliveryProvidersPage() {
  const [providers, setProviders] = useState([])
  const [orders, setOrders] = useState([])

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    rejected: 0,
    suspended: 0,
  })

  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [rejectionProvider, setRejectionProvider] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [actingId, setActingId] = useState(null)

  // ----------------------------------------------------
  // LOAD PROVIDERS AND STATISTICS
  // ----------------------------------------------------

  const loadProviders = useCallback(async () => {
    try {
      const result = await adminDeliveryApi.listProviders({
        status,
        search,
        page: 1,
        limit: 100,
      })

      setProviders(result.data || [])

      setStats({
        total: result.stats?.total || 0,
        pending: result.stats?.pending || 0,
        active: result.stats?.active || 0,
        rejected: result.stats?.rejected || 0,
        suspended: result.stats?.suspended || 0,
      })
    } catch (error) {
      toast.error(
        error.message || 'Failed to load delivery providers.'
      )
    } finally {
      setLoading(false)
    }
  }, [status, search])

  // ----------------------------------------------------
  // LOAD UNASSIGNED ORDERS
  // ----------------------------------------------------

  const loadUnassignedOrders = useCallback(async () => {
    try {
      const result = await adminDeliveryApi.listDeliveries({
        page: 1,
        limit: 100,
      })

      setOrders(result.data || [])
    } catch (error) {
      toast.error(
        error.message || 'Failed to load unassigned orders.'
      )
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const refreshAll = async () => {
    setRefreshing(true)

    await Promise.all([
      loadProviders(),
      loadUnassignedOrders(),
    ])

    setRefreshing(false)
  }

  useEffect(() => {
    setLoading(true)
    loadProviders()
  }, [loadProviders])

  useEffect(() => {
    loadUnassignedOrders()
  }, [loadUnassignedOrders])

  // ----------------------------------------------------
  // UPDATE PROVIDER STATUS
  // ----------------------------------------------------

  const updateStatus = async (provider, nextStatus, reason = '') => {
    setActingId(provider.id)

    try {
      const result = await adminDeliveryApi.updateProvider(
        provider.id,
        {
          status: nextStatus,
          ...(reason ? { reason } : {}),
        }
      )

      toast.success(
        result.message || 'Provider status updated.'
      )

      setRejectionProvider(null)
      setRejectionReason('')

      await loadProviders()
    } catch (error) {
      toast.error(
        error.message || 'Failed to update provider.'
      )
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (event) => {
    event.preventDefault()

    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason.')
      return
    }

    await updateStatus(
      rejectionProvider,
      'rejected',
      rejectionReason.trim()
    )
  }

  const handleProviderAction = (provider, action) => {
    if (action === 'rejected') {
      setRejectionProvider(provider)
      setRejectionReason('')
      return
    }

    const confirmationMessages = {
      suspended: 'Are you sure you want to suspend this provider?',
      active: 'Are you sure you want to reactivate this provider?',
    }

    if (
      confirmationMessages[action] &&
      !window.confirm(confirmationMessages[action])
    ) {
      return
    }

    updateStatus(provider, action)
  }

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Delivery Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage provider applications and manually assign
            delivery orders.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />

          Refresh
        </button>
      </div>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Providers"
          value={stats.total}
          icon={Users}
          color="bg-violet-100 text-violet-700"
        />

        <StatCard
          title="Pending Applications"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-100 text-amber-700"
        />

        <StatCard
          title="Approved Providers"
          value={stats.active}
          icon={Check}
          color="bg-emerald-100 text-emerald-700"
        />

        <StatCard
          title="Unassigned Orders"
          value={orders.length}
          icon={Package}
          color="bg-cyan-100 text-cyan-700"
        />
      </div>

      {/* PROVIDER MANAGEMENT */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-900">
            Delivery provider applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review applications and control provider access.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search company, email or contact..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={inputClass}
            >
              <option value="all">All providers</option>
              <option value="pending">Pending</option>
              <option value="active">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Service area</th>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Loading providers...
                  </td>
                </tr>
              )}

              {!loading && providers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No delivery providers found.
                  </td>
                </tr>
              )}

              {!loading && providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-50">

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {provider.providerName || provider.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {provider.email}
                    </p>

                    {provider.rejectionReason && (
                      <p className="mt-1 max-w-xs text-xs text-rose-600">
                        Reason: {provider.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-slate-800">
                      {provider.contactPerson || '—'}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {provider.phone || '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {provider.serviceAreas?.join(', ') ||
                      provider.serviceArea ||
                      '—'}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {provider.submittedAt
                      ? new Date(provider.submittedAt).toLocaleDateString()
                      : '—'}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={provider.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">

                      {provider.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            disabled={actingId === provider.id}
                            onClick={() =>
                              handleProviderAction(provider, 'active')
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={actingId === provider.id}
                            onClick={() =>
                              handleProviderAction(provider, 'rejected')
                            }
                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {provider.status === 'active' && (
                        <button
                          type="button"
                          disabled={actingId === provider.id}
                          onClick={() =>
                            handleProviderAction(provider, 'suspended')
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Suspend
                        </button>
                      )}

                      {provider.status === 'suspended' && (
                        <button
                          type="button"
                          disabled={actingId === provider.id}
                          onClick={() =>
                            handleProviderAction(provider, 'active')
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Reactivate
                        </button>
                      )}

                      {actingId === provider.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-dcc-primary" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

      {/* UNASSIGNED ORDERS */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Truck className="h-5 w-5 text-dcc-primary" />
              Unassigned delivery orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an order and manually assign an approved provider.
            </p>
          </div>

          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-dcc-primary">
            {orders.length} orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Order number</th>
                <th className="px-5 py-4">Buyer</th>
                <th className="px-5 py-4">Seller</th>
                <th className="px-5 py-4">Delivery address</th>
                <th className="px-5 py-4">Order date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {ordersLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    Loading unassigned orders...
                  </td>
                </tr>
              )}

              {!ordersLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <Package className="mx-auto mb-2 h-7 w-7 text-slate-300" />
                    All eligible orders have been assigned.
                  </td>
                </tr>
              )}

              {!ordersLoading && orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                    {order.orderNumber}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {order.buyer?.name || '—'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.buyer?.email || ''}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {order.seller?.shopName || '—'}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-slate-600">
                    <p className="line-clamp-2">
                      {order.deliveryAddress}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                    >
                      <Truck className="h-4 w-4" />
                      Assign provider
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

      {/* ASSIGNMENT MODAL */}

      {selectedOrder && (
        <DeliveryAssignmentModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssigned={async () => {
            await loadUnassignedOrders()
          }}
        />
      )}

      {/* REJECTION MODAL */}

      {rejectionProvider && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Reject application
              </h2>

              <button
                type="button"
                onClick={() => setRejectionProvider(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close rejection modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Provide a reason for rejecting{' '}
              <strong>
                {rejectionProvider.providerName || rejectionProvider.name}
              </strong>.
            </p>

            <form onSubmit={handleReject}>
              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(event.target.value)
                }
                placeholder="Enter rejection reason..."
                className="mt-4 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-dcc-primary focus:ring-2 focus:ring-dcc-primary/20"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectionProvider(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rejectionReason.trim() || actingId !== null}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  Confirm rejection
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
