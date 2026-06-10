import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order management</h1>
        <p className="mt-1 text-sm text-slate-600">
          View all orders platform-wide (demo: orders stored in browser).
        </p>
      </div>
      <div className="rounded-xl border border-dcc-primary/20 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-dcc-primary/10">
        Use this view to monitor order statuses and open admin tracking details.
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        {orders.length === 0 ? (
          <p className="text-sm text-slate-600">
            No orders yet. Place an order in the buyer checkout to see it here.
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
                {orders.map((o) => (
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

