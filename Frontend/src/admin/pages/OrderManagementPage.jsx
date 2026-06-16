import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../buyer'
import { formatLkr } from '../../components/category/categoryData'

function statusPill(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('failed')) return 'bg-violet-50 text-violet-700'
  if (s.includes('pending')) return 'bg-violet-50 text-violet-700'
  if (s.includes('confirmed')) return 'bg-violet-100 text-dcc-primary'
  return 'bg-slate-100 text-slate-600'
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState(() => getOrders())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [disputeFilter, setDisputeFilter] = useState('all')

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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      String(o.status || '').toLowerCase() === statusFilter.toLowerCase()

    const oDispute = o.dispute?.status || 'none'
    const matchesDispute =
      disputeFilter === 'all' ||
      oDispute === disputeFilter

    return matchesSearch && matchesStatus && matchesDispute
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order management</h1>
        <p className="mt-1 text-sm text-slate-600">
          View all orders platform-wide (demo: orders stored in browser).
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by ID or customer email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filters:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={disputeFilter}
            onChange={(e) => setDisputeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          >
            <option value="all">All Disputes</option>
            <option value="none">No Dispute</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-slate-600">
            No matching orders found.
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

