import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getOrders, updateOrderStatus, ORDER_STATUS } from '../../buyer'
import { formatLkr } from '../../components/category/categoryData'

const STATUS_OPTIONS = [
  'All',
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.PAYMENT_FAILED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  'shipped',
  'delivered',
  'cancelled',
]

function statusPill(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('failed')) return 'bg-rose-50 text-rose-700'
  if (s.includes('cancelled')) return 'bg-slate-100 text-slate-500'
  if (s.includes('pending')) return 'bg-amber-50 text-amber-700'
  if (s.includes('confirmed')) return 'bg-violet-100 text-dcc-primary'
  if (s.includes('shipped')) return 'bg-blue-50 text-blue-700'
  if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-700'
  return 'bg-slate-100 text-slate-600'
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState(() => getOrders())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const setDispute = (orderId, disputeStatus) => {
    const current = orders.find((o) => o.id === orderId)
    if (!current) return
    updateOrderStatus(orderId, current.status, {
      dispute: {
        status: disputeStatus,
        updatedAt: new Date().toISOString(),
      },
    })
    setOrders(getOrders())
  }

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        String(o.id || '').toLowerCase().includes(q) ||
        String(o.email || '').toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'All' ||
        String(o.status || '').toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order management</h1>
        <p className="mt-1 text-sm text-slate-600">
          View all orders platform-wide (demo: orders stored in browser).
        </p>
      </div>

      {/* Search & Filter controls */}
      <section className="rounded-xl border border-dcc-primary/20 bg-white px-4 py-4 shadow-sm shadow-dcc-primary/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="order-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Email…"
              className="w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth pl-9 pr-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
          </div>
          <select
            id="order-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <span className="text-xs text-slate-500">
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-slate-600">
            {orders.length === 0
              ? 'No orders yet. Place an order in the buyer checkout to see it here.'
              : 'No orders match your search/filter.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-dcc-primary/15 text-slate-500">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Dispute</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-dcc-primary/10">
                    <td className="py-3 font-semibold text-slate-900">{o.id}</td>
                    <td className="py-3 text-slate-600">{o.email}</td>
                    <td className="py-3 text-slate-600">{o.items?.length ?? 0}</td>
                    <td className="py-3 font-semibold text-slate-900">{formatLkr(o.total || 0)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusPill(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          o.dispute?.status === 'open'
                            ? 'bg-amber-50 text-amber-700'
                            : o.dispute?.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {o.dispute?.status ?? 'none'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {o.dispute?.status === 'open' ? (
                          <button
                            type="button"
                            onClick={() => setDispute(o.id, 'resolved')}
                            className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDispute(o.id, 'open')}
                            className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                          >
                            Open dispute
                          </button>
                        )}
                        <Link
                          to={`/admin/orders/${o.id}`}
                          className="text-sm font-semibold text-dcc-primary hover:underline"
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">Dispute actions are stored locally for admin demo flows.</p>
    </div>
  )
}
