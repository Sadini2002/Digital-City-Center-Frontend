import { useState } from 'react'
import { CreditCard, Mail, Phone, Store } from 'lucide-react'
import { formatLkr } from '../../../components/category/categoryData'
import { resolveAssetUrl } from '../../utils/mediaUrl'
import { ACTIVITY_LABELS, formatDateTime, humanize } from '../../utils/orderStatus'
import StatusBadge from './StatusBadge'
import DeliveryAssignmentCard from './DeliveryAssignmentCard'
import DisputePanel from './DisputePanel'
import OrderOverridesCard from './OrderOverridesCard'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'fulfilment', label: 'Delivery & payment' },
  { key: 'disputes', label: 'Disputes' },
  { key: 'activity', label: 'Activity' },
]

function InfoRow({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children || '—'}</dd>
    </div>
  )
}

function describeActivity(entry) {
  const d = entry.details || {}
  switch (entry.action) {
    case 'status_override':
      return `${humanize(d.from)} → ${humanize(d.to)}${d.note ? ` · ${d.note}` : ''}`
    case 'payment_override':
      return `${humanize(d.from)} → ${humanize(d.to)}${d.note ? ` · ${d.note}` : ''}`
    case 'delivery_assigned':
      return `${d.providerName ?? 'Provider'}${d.driverName ? ` / ${d.driverName}` : ''}`
    case 'dispute_opened':
      return `${d.disputeNumber ?? ''} · ${d.reason ?? ''}`
    case 'dispute_status':
      return `${humanize(d.from)} → ${humanize(d.to)}`
    case 'dispute_resolved':
      return `${d.disputeNumber ?? ''} · ${humanize(d.resolution)}${d.refundAmount ? ` (${formatLkr(d.refundAmount)})` : ''}`
    default:
      return ''
  }
}

/**
 * Full order details. Used by the drawer on the order table and by the
 * standalone /admin/orders/:id page.
 *
 * Props: order (details payload), onOrderChange(nextOrder)
 */
export default function OrderDetailsPanel({ order, onOrderChange }) {
  const [tab, setTab] = useState('overview')
  const activeDisputes = order.disputes.filter((d) => ['open', 'under_review'].includes(d.status)).length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{order.orderNumber}</h2>
          <p className="text-sm text-slate-500">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge kind="order" value={order.status} />
          <StatusBadge kind="payment" value={order.payment.status} />
          {activeDisputes > 0 && <StatusBadge kind="dispute" value="open" />}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 text-sm font-semibold" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 ${
              tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
            {t.key === 'disputes' && order.disputes.length > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeDisputes ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {order.disputes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-900">Buyer</h3>
            <p className="mt-2 text-sm font-semibold text-slate-900">{order.buyer?.name}</p>
            <div className="mt-1 space-y-1 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {order.buyer?.email}
              </p>
              {order.buyer?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {order.buyer.phone}
                </p>
              )}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery address</p>
            <p className="text-sm text-slate-800">{order.deliveryAddress}</p>
            {order.notes && (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Buyer note</p>
                <p className="whitespace-pre-wrap text-sm text-slate-800">{order.notes}</p>
              </>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-900">Items ({order.items.length})</h3>
            <div className="mt-3 space-y-4">
              {order.sellers.map((seller) => (
                <div key={seller.id}>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Store className="h-3.5 w-3.5" aria-hidden="true" /> {seller.shopName}
                    {seller.contact?.phone && <span className="font-normal normal-case">· {seller.contact.phone}</span>}
                  </p>
                  <ul className="mt-2 divide-y divide-slate-100">
                    {order.items
                      .filter((item) => item.seller.id === seller.id)
                      .map((item) => (
                        <li key={item.id} className="flex gap-3 py-2.5">
                          {item.image ? (
                            <img
                              src={resolveAssetUrl(item.image)}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100" aria-hidden="true" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">
                              {item.quantity} × {formatLkr(item.unitPrice)}
                              {item.sku ? ` · ${item.sku}` : ''}
                            </p>
                            <div className="mt-1">
                              <StatusBadge kind="order" value={item.status} />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{formatLkr(item.subtotal)}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>

            <dl className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-2">
              <InfoRow label="Items subtotal">{formatLkr(order.totals.itemsSubtotal)}</InfoRow>
              <InfoRow label="Delivery fee">{formatLkr(order.totals.deliveryFee)}</InfoRow>
              <InfoRow label="Order total">
                <span className="text-base font-bold">{formatLkr(order.totals.totalAmount)}</span>
              </InfoRow>
            </dl>
          </section>
        </div>
      )}

      {tab === 'fulfilment' && (
        <div className="space-y-5">
          <DeliveryAssignmentCard key={order.id} order={order} onOrderChange={onOrderChange} />

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CreditCard className="h-4 w-4 text-dcc-primary" aria-hidden="true" /> Payment
            </h3>
            <dl className="mt-3 divide-y divide-slate-100">
              <InfoRow label="Method">{humanize(order.payment.method)}</InfoRow>
              <InfoRow label="Status">
                <StatusBadge kind="payment" value={order.payment.status} />
              </InfoRow>
              <InfoRow label="Amount">{formatLkr(order.payment.amount)}</InfoRow>
              {order.payment.transaction ? (
                <>
                  <InfoRow label="Gateway">{humanize(order.payment.transaction.gateway)}</InfoRow>
                  <InfoRow label="Reference">
                    <span className="break-all font-mono text-xs">{order.payment.transaction.reference}</span>
                  </InfoRow>
                  <InfoRow label="Transaction status">{humanize(order.payment.transaction.status)}</InfoRow>
                  <InfoRow label="Paid at">{formatDateTime(order.payment.transaction.paidAt)}</InfoRow>
                </>
              ) : (
                <InfoRow label="Transaction">No gateway transaction recorded</InfoRow>
              )}
            </dl>
          </section>

          <OrderOverridesCard key={`ov-${order.id}`} order={order} onOrderChange={onOrderChange} />
        </div>
      )}

      {tab === 'disputes' && <DisputePanel key={order.id} order={order} onOrderChange={onOrderChange} />}

      {tab === 'activity' && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-900">Admin activity</h3>
          {order.activity.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No admin changes have been made to this order.</p>
          ) : (
            <ol className="mt-3 space-y-3 border-l border-slate-200 pl-4">
              {order.activity.map((entry) => (
                <li key={entry.id} className="text-sm">
                  <p className="font-semibold text-slate-900">{ACTIVITY_LABELS[entry.action] ?? humanize(entry.action)}</p>
                  <p className="text-slate-600">{describeActivity(entry)}</p>
                  <p className="text-xs text-slate-400">
                    {entry.admin?.name ?? 'Admin'} · {formatDateTime(entry.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  )
}