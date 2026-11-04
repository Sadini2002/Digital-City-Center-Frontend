import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../services/adminApi'
import { formatLkr } from '../../components/category/categoryData'
import OrderDetailsDrawer from '../components/orders/OrderDetailsDrawer'
import BuyerFilter from '../components/orders/BuyerFilter'
import StatusBadge from '../components/orders/StatusBadge'
import {
  ORDER_STATUS_META,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  formatDate,
} from '../utils/orderStatus'

const PAGE_SIZE = 20

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  paymentStatus: 'all',
  dateFrom: '',
  dateTo: '',
  sellerId: '',
  buyer: null,
  dispute: 'all',
  sort: 'newest',
}

const DISPUTE_OPTIONS = [
  { value: 'all', label: 'All orders' },
  { value: 'open', label: 'Open disputes' },
  { value: 'resolved', label: 'Resolved disputes' },
  { value: 'none', label: 'No disputes' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount_high', label: 'Amount: high to low' },
  { value: 'amount_low', label: 'Amount: low to high' },
]

const fieldClass =
  'h-[38px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30'

function FilterField({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function OrderManagementPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1 })
  const [stats, setStats] = useState({ statusCounts: {}, totalMatching: 0, openDisputes: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sellers, setSellers] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const requestRef = useRef(0)

  // Debounce the search box
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => (prev.search === searchInput.trim() ? prev : { ...prev, search: searchInput.trim() }))
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Seller dropdown options
  useEffect(() => {
    adminApi
      .getOrderSellerOptions()
      .then((res) => setSellers(res.data?.data ?? []))
      .catch(() => toast.error('Could not load the seller list.'))
  }, [])

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort: filters.sort,
      ...(filters.search && { search: filters.search }),
      ...(filters.status !== 'all' && { status: filters.status }),
      ...(filters.paymentStatus !== 'all' && { paymentStatus: filters.paymentStatus }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      ...(filters.sellerId && { sellerId: filters.sellerId }),
      ...(filters.buyer && { buyerId: filters.buyer.id }),
      ...(filters.dispute !== 'all' && { dispute: filters.dispute }),
    }),
    [filters, page],
  )

  const dateRangeInvalid = Boolean(filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo)

  const load = useCallback(async () => {
    const requestId = ++requestRef.current
    setError('')
    if (dateRangeInvalid) {
      // Don't query the API with a reversed range; the form shows the validation message.
      setLoading(false)
      return
    }
    try {
      const res = await adminApi.getOrders(params)
      if (requestId !== requestRef.current) return
      setOrders(res.data?.data ?? [])
      setMeta(res.data?.meta ?? { page: 1, total: 0, totalPages: 1 })
      setStats(res.data?.stats ?? { statusCounts: {}, totalMatching: 0, openDisputes: 0 })
    } catch (err) {
      if (requestId !== requestRef.current) return
      setError(err.message || 'Failed to load orders.')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [params, dateRangeInvalid])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const update = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const hasFilters = useMemo(
    () => JSON.stringify({ ...filters, sort: 'newest' }) !== JSON.stringify({ ...DEFAULT_FILTERS }),
    [filters],
  )

  const statusPills = [
    { value: 'all', label: 'All', count: stats.totalMatching },
    ...Object.keys(ORDER_STATUS_META)
      .filter((key) => stats.statusCounts[key])
      .map((key) => ({ value: key, label: ORDER_STATUS_META[key].label, count: stats.statusCounts[key] })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every order on the platform: track payments and deliveries, assign couriers and resolve disputes.
          </p>
        </div>
        {stats.openDisputes > 0 && (
          <button
            type="button"
            onClick={() => update({ dispute: 'open' })}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {stats.openDisputes} open dispute{stats.openDisputes === 1 ? '' : 's'}
          </button>
        )}
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Order filters">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <FilterField label="Search" htmlFor="order-search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="order-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Order #, buyer, seller or tracking number"
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </FilterField>
          </div>

          <FilterField label="Order status" htmlFor="order-status">
            <select id="order-status" value={filters.status} onChange={(e) => update({ status: e.target.value })} className={fieldClass}>
              <option value="all">All statuses</option>
              {ORDER_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Payment" htmlFor="order-payment">
            <select id="order-payment" value={filters.paymentStatus} onChange={(e) => update({ paymentStatus: e.target.value })} className={fieldClass}>
              <option value="all">All payments</option>
              {PAYMENT_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="From date" htmlFor="order-from">
            <input id="order-from" type="date" value={filters.dateFrom} max={filters.dateTo || undefined} onChange={(e) => update({ dateFrom: e.target.value })} className={fieldClass} />
          </FilterField>

          <FilterField label="To date" htmlFor="order-to">
            <input id="order-to" type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(e) => update({ dateTo: e.target.value })} className={fieldClass} />
          </FilterField>

          <FilterField label="Seller" htmlFor="order-seller">
            <select id="order-seller" value={filters.sellerId} onChange={(e) => update({ sellerId: e.target.value })} className={fieldClass}>
              <option value="">All sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shopName}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Buyer" htmlFor="order-buyer">
            <BuyerFilter value={filters.buyer} onChange={(buyer) => update({ buyer })} />
          </FilterField>

          <FilterField label="Disputes" htmlFor="order-dispute">
            <select id="order-dispute" value={filters.dispute} onChange={(e) => update({ dispute: e.target.value })} className={fieldClass}>
              {DISPUTE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Sort by" htmlFor="order-sort">
            <select id="order-sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className={fieldClass}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterField>
        </div>

        {dateRangeInvalid && (
          <p className="mt-3 text-xs font-semibold text-rose-600" role="alert">
            The start date must be before the end date.
          </p>
        )}

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-dcc-primary hover:underline">
              <X className="h-4 w-4" aria-hidden="true" /> Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick status filter">
        {statusPills.map((pill) => (
          <button
            key={pill.value}
            type="button"
            aria-pressed={filters.status === pill.value}
            onClick={() => update({ status: pill.value })}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              filters.status === pill.value
                ? 'border-dcc-primary bg-dcc-primary text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pill.label} <span className="opacity-70">{pill.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {error ? (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                load()
              }}
              className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Order</th>
                  <th scope="col" className="px-4 py-3">Buyer</th>
                  <th scope="col" className="px-4 py-3">Seller(s)</th>
                  <th scope="col" className="px-4 py-3 text-right">Total</th>
                  <th scope="col" className="px-4 py-3">Payment</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Delivery</th>
                  <th scope="col" className="px-4 py-3">Dispute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" aria-busy={loading}>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-4 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))}

                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                      {hasFilters ? 'No orders match your filters.' : 'No orders have been placed yet.'}
                    </td>
                  </tr>
                )}

                {!loading &&
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      tabIndex={0}
                      onClick={() => setSelectedId(order.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedId(order.id)
                        }
                      }}
                      className="cursor-pointer hover:bg-violet-50/50 focus-visible:bg-violet-50 focus-visible:outline-none"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{order.buyer?.name ?? '—'}</p>
                        <p className="text-xs text-slate-500">{order.buyer?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {order.sellers.length === 0 ? (
                          '—'
                        ) : (
                          <>
                            <p className="font-medium text-slate-900">{order.sellers[0].shopName}</p>
                            {order.sellers.length > 1 && (
                              <p className="text-xs text-slate-500">+{order.sellers.length - 1} more</p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">
                        {formatLkr(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="payment" value={order.payment.status} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="order" value={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        {order.delivery ? (
                          <>
                            <StatusBadge kind="delivery" value={order.delivery.status} />
                            <p className="mt-1 text-xs text-slate-500">
                              {order.delivery.provider?.name ?? 'No provider'}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">Not created</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.dispute.open > 0 ? (
                          <StatusBadge kind="dispute" value="open" />
                        ) : order.dispute.total > 0 ? (
                          <StatusBadge kind="dispute" value={order.dispute.latestStatus} />
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && meta.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row">
            <p>
              Showing {(meta.page - 1) * PAGE_SIZE + 1}–{Math.min(meta.page * PAGE_SIZE, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
              </button>
              <span className="px-2 font-semibold text-slate-900">
                {meta.page} / {meta.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedId && (
        <OrderDetailsDrawer orderId={selectedId} onClose={() => setSelectedId(null)} onChanged={load} />
      )}
    </div>
  )
}