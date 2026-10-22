import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import OrderDetailsPanel from './OrderDetailsPanel'
import useAdminOrder from './useAdminOrder'

/**
 * Right-hand drawer with the full order details.
 * `onChanged` fires after any mutation so the table behind can refresh.
 */
export default function OrderDetailsDrawer({ orderId, onClose, onChanged }) {
  const { order, setOrder, loading, error, reload } = useAdminOrder(orderId)

  useEffect(() => {
    const onKeyDown = (event) => {
      // Let open confirmation dialogs handle Escape first.
      if (event.key === 'Escape' && !document.querySelector('[role="alertdialog"]')) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const handleChange = (next) => {
    if (next) setOrder(next)
    onChanged?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
        className="flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <p className="text-sm font-semibold text-slate-500">Order details</p>
          <div className="flex items-center gap-2">
            {order && (
              <Link
                to={`/admin/orders/${order.id}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open full page
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading && !order ? (
            <div className="flex items-center justify-center py-20 text-slate-500" aria-busy="true">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading order…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-center" role="alert">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-3 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                Try again
              </button>
            </div>
          ) : order ? (
            <OrderDetailsPanel order={order} onOrderChange={handleChange} />
          ) : null}
        </div>
      </aside>
    </div>
  )
}