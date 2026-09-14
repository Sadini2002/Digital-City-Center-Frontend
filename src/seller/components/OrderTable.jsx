import StatusBadge from './StatusBadge'
import { Eye, Printer } from 'lucide-react'
import {
  SELLER_ORDER_ACTION_LABELS,
  SELLER_ORDER_STATUS_FLOW,
} from '../data/sellerConstants'

export default function OrderTable({ orders, onViewDetails, onUpdateStatus, onPrint }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">No orders found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-5 py-3 font-semibold w-36">Order #</th>
            <th className="px-5 py-3 font-semibold w-32">Date</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Your Items</th>
            <th className="px-5 py-3 font-semibold w-32">Your Total</th>
            <th className="px-5 py-3 font-semibold w-36">Status</th>
            <th className="px-5 py-3 font-semibold text-right w-56">Actions</th>
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

            const itemsSummary = (order.items || [])
              .map((it) => `${it.variant?.listing?.title || 'Product'} (x${it.quantity})`)
              .join(', ')

            const currentStatus = order.sellerItemStatus
            const nextOptions = SELLER_ORDER_STATUS_FLOW[currentStatus] || []

            return (
              <tr key={order.orderId} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">
                  {dateStr}
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {order.buyer?.name || 'Customer'}
                  </div>
                  <div className="text-xs text-slate-500">{order.buyer?.email}</div>
                </td>
                <td className="px-5 py-4 text-slate-600 max-w-xs truncate" title={itemsSummary}>
                  {itemsSummary || 'No items'}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  LKR {Number(order.sellerSubtotal || 0).toLocaleString('en-LK')}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={currentStatus} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </button>

                    {onPrint && (
                      <button
                        type="button"
                        onClick={() => onPrint(order)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        title="Print Order Summary"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {currentStatus !== 'mixed' &&
                      nextOptions.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type="button"
                          onClick={() => onUpdateStatus(order.orderId, nextStatus)}
                          className={
                            nextStatus === 'rejected'
                              ? 'inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100'
                              : 'inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-dcc-primary-hover'
                          }
                        >
                          {SELLER_ORDER_ACTION_LABELS[nextStatus] || nextStatus}
                        </button>
                      ))}
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
