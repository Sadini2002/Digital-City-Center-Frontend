import { useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '../../services/adminApi'
import ConfirmActionDialog from '../common/ConfirmActionDialog'
import {
  ORDER_STATUSES_NEEDING_REASON,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUSES_NEEDING_REASON,
  PAYMENT_STATUS_OPTIONS,
} from '../../utils/orderStatus'
import StatusBadge from './StatusBadge'

const TERMINAL_ORDER_STATUSES = ['cancelled', 'rejected', 'refunded']

/**
 * Admin override controls for the order and payment status.
 * Every change is confirmed and recorded in the order's activity log.
 */
export default function OrderOverridesCard({ order, onOrderChange }) {
  const [nextStatus, setNextStatus] = useState('')
  const [nextPayment, setNextPayment] = useState('')
  const [pending, setPending] = useState(null) // { kind, value }
  const [busy, setBusy] = useState(false)

  const orderLocked = TERMINAL_ORDER_STATUSES.includes(order.status)

  const run = async (reason) => {
    setBusy(true)
    try {
      const res =
        pending.kind === 'order'
          ? await adminApi.updateOrderStatus(order.id, pending.value, reason)
          : await adminApi.updateOrderPaymentStatus(order.id, pending.value, reason)
      toast.success(res.data?.message || 'Updated.')
      onOrderChange(res.data?.data)
      if (pending.kind === 'order') setNextStatus('')
      else setNextPayment('')
      setPending(null)
    } catch (err) {
      toast.error(err.message || 'Could not apply the override.')
    } finally {
      setBusy(false)
    }
  }

  const needsReason =
    pending &&
    (pending.kind === 'order'
      ? ORDER_STATUSES_NEEDING_REASON.includes(pending.value)
      : PAYMENT_STATUSES_NEEDING_REASON.includes(pending.value))

  const selectClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30 disabled:bg-slate-50 disabled:text-slate-500'

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
      <h3 className="text-sm font-bold text-slate-900">Admin overrides</h3>
      <p className="mt-0.5 text-xs text-slate-600">
        Use only to correct an order. Sellers and drivers normally move orders forward themselves. All overrides are logged.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="override-status" className="text-xs font-semibold text-slate-700">
              Order status
            </label>
            <StatusBadge kind="order" value={order.status} />
          </div>
          <select
            id="override-status"
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value)}
            disabled={orderLocked}
            className={selectClass}
          >
            <option value="">{orderLocked ? 'Order is closed' : 'Change to…'}</option>
            {ORDER_STATUS_OPTIONS.filter((o) => o.value !== order.status).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!nextStatus || orderLocked}
            onClick={() => setPending({ kind: 'order', value: nextStatus })}
            className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply order status
          </button>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="override-payment" className="text-xs font-semibold text-slate-700">
              Payment status
            </label>
            <StatusBadge kind="payment" value={order.payment.status} />
          </div>
          <select
            id="override-payment"
            value={nextPayment}
            onChange={(event) => setNextPayment(event.target.value)}
            className={selectClass}
          >
            <option value="">Change to…</option>
            {PAYMENT_STATUS_OPTIONS.filter((o) => o.value !== order.payment.status).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!nextPayment}
            onClick={() => setPending({ kind: 'payment', value: nextPayment })}
            className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply payment status
          </button>
        </div>
      </div>

      {pending && (
        <ConfirmActionDialog
          title={`Change ${pending.kind === 'order' ? 'order' : 'payment'} status?`}
          variant={needsReason ? 'danger' : 'primary'}
          confirmLabel="Apply override"
          busy={busy}
          reasonLabel="Reason"
          reasonRequired={needsReason}
          reasonHelp="Saved in the order activity log."
          description={
            <div className="space-y-2">
              <p className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  kind={pending.kind}
                  value={pending.kind === 'order' ? order.status : order.payment.status}
                />
                <span aria-hidden="true">→</span>
                <StatusBadge kind={pending.kind} value={pending.value} />
              </p>
              {pending.kind === 'order' && ['cancelled', 'rejected', 'refunded'].includes(pending.value) && (
                <p className="text-amber-700">
                  Item statuses will be updated, stock returned and any open delivery cancelled. This cannot be undone.
                </p>
              )}
              {pending.kind === 'order' && (
                <p>The buyer will be notified of the new status.</p>
              )}
            </div>
          }
          onConfirm={run}
          onCancel={() => !busy && setPending(null)}
        />
      )}
    </section>
  )
}