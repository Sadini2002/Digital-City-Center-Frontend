import StatusBadge from './StatusBadge'
import { Eye, ChevronRight } from 'lucide-react'

export default function OrderTable({ orders, onViewDetails, onUpdateStatus }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">No orders found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-5 py-3 font-semibold w-28">Order ID</th>
            <th className="px-5 py-3 font-semibold w-36">Date</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Items</th>
            <th className="px-5 py-3 font-semibold w-32">Total</th>
            <th className="px-5 py-3 font-semibold w-32">Status</th>
            <th className="px-5 py-3 font-semibold text-right w-52">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-LK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently'

            const itemsSummary = order.items
              ? order.items.map((it) => `${it.title || it.name} (x${it.quantity})`).join(', ')
              : 'No items'

            const nextStatuses = {
              pending_payment: { next: 'confirmed', label: 'Confirm Pay' },
              confirmed: { next: 'processing', label: 'Start Prep' },
              processing: { next: 'shipped', label: 'Ship Order' },
              shipped: { next: 'delivered', label: 'Mark Delivered' },
            }

            const transition = nextStatuses[order.status]

            return (
              <tr key={order.id} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {order.id}
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">
                  {dateStr}
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {order.shippingAddress?.fullName || 'Guest Customer'}
                  </div>
                  <div className="text-xs text-slate-500">{order.email}</div>
                </td>
                <td className="px-5 py-4 text-slate-600 max-w-xs truncate" title={itemsSummary}>
                  {itemsSummary}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  LKR {Number(order.total || 0).toLocaleString('en-LK')}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </button>
                    {transition ? (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(order.id, transition.next)}
                        className="inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-dcc-primary-hover"
                      >
                        {transition.label}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
