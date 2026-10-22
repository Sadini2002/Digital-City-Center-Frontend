import { useEffect, useMemo, useState } from 'react'
import { Loader2, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../../services/adminApi'
import StatusBadge from './StatusBadge'
import { formatDateTime } from '../../utils/orderStatus'

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children || '—'}</dd>
    </div>
  )
}

/**
 * Shows delivery information and lets the admin assign / re-assign
 * the delivery provider and driver.
 */
export default function DeliveryAssignmentCard({ order, onOrderChange }) {
  const delivery = order.delivery
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [providerId, setProviderId] = useState(delivery?.provider?.id ? String(delivery.provider.id) : '')
  const [driverId, setDriverId] = useState(delivery?.driver?.id ? String(delivery.driver.id) : '')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    adminApi
      .getDeliveryProviderOptions()
      .then((res) => !cancelled && setProviders(res.data?.data ?? []))
      .catch((err) => !cancelled && toast.error(err.message || 'Could not load delivery providers.'))
      .finally(() => !cancelled && setLoadingProviders(false))
    return () => {
      cancelled = true
    }
  }, [])

  const drivers = useMemo(
    () => providers.find((p) => String(p.id) === providerId)?.drivers ?? [],
    [providers, providerId],
  )

  const orderClosed = ['cancelled', 'rejected', 'refunded'].includes(order.status)
  const deliveryClosed = delivery && ['DELIVERED', 'CANCELLED'].includes(delivery.status)
  const locked = orderClosed || deliveryClosed

  const unchanged =
    delivery &&
    String(delivery.provider?.id ?? '') === providerId &&
    String(delivery.driver?.id ?? '') === driverId

  const submit = async () => {
    if (!providerId) {
      toast.error('Select a delivery provider.')
      return
    }
    setBusy(true)
    try {
      const res = await adminApi.assignOrderDelivery(order.id, Number(providerId), driverId ? Number(driverId) : null)
      toast.success(res.data?.message || 'Delivery assigned.')
      onOrderChange(res.data?.data)
    } catch (err) {
      toast.error(err.message || 'Could not assign delivery.')
    } finally {
      setBusy(false)
    }
  }

  const selectClass =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30 disabled:bg-slate-50 disabled:text-slate-500'

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Truck className="h-4 w-4 text-dcc-primary" aria-hidden="true" /> Delivery
        </h3>
        {delivery && <StatusBadge kind="delivery" value={delivery.status} />}
      </div>

      {delivery ? (
        <dl className="mt-3 divide-y divide-slate-100">
          <Row label="Tracking number">{delivery.trackingNumber}</Row>
          <Row label="Provider">
            {delivery.provider ? (
              <>
                {delivery.provider.providerName}
                {delivery.provider.phone && <span className="block text-xs font-normal text-slate-500">{delivery.provider.phone}</span>}
              </>
            ) : (
              'Not assigned'
            )}
          </Row>
          <Row label="Driver">
            {delivery.driver ? (
              <>
                {delivery.driver.fullName}
                <span className="block text-xs font-normal text-slate-500">
                  {[delivery.driver.vehicleType, delivery.driver.vehiclePlate].filter(Boolean).join(' · ')}
                </span>
              </>
            ) : (
              'Not assigned'
            )}
          </Row>
          <Row label="Pickup">{delivery.pickupAddress}</Row>
          <Row label="Drop-off">{delivery.deliveryAddress}</Row>
          <Row label="Assigned">{formatDateTime(delivery.assignedAt)}</Row>
          <Row label="Picked up">{formatDateTime(delivery.pickedUpAt)}</Row>
          <Row label="Delivered">{formatDateTime(delivery.deliveredAt)}</Row>
          {delivery.failureReason && <Row label="Failure reason">{delivery.failureReason}</Row>}
        </dl>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          No delivery has been created for this order yet.
        </p>
      )}

      {delivery?.history?.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold text-slate-700">Delivery history</summary>
          <ol className="mt-2 space-y-2 border-l border-slate-200 pl-4">
            {[...delivery.history].reverse().map((entry) => (
              <li key={entry.id} className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{entry.status}</span> · {formatDateTime(entry.createdAt)}
                {entry.note && <span className="block">{entry.note}</span>}
              </li>
            ))}
          </ol>
        </details>
      )}

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {delivery ? 'Re-assign delivery' : 'Assign delivery'}
        </p>

        {locked ? (
          <p className="mt-2 text-sm text-slate-600">
            {orderClosed ? `This order is ${order.status}.` : `This delivery is already ${delivery.status.toLowerCase()}.`} It can no longer be assigned.
          </p>
        ) : (
          <>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="assign-provider" className="text-xs font-semibold text-slate-700">
                  Provider
                </label>
                <select
                  id="assign-provider"
                  value={providerId}
                  disabled={loadingProviders || busy}
                  onChange={(event) => {
                    setProviderId(event.target.value)
                    setDriverId('')
                  }}
                  className={selectClass}
                >
                  <option value="">{loadingProviders ? 'Loading…' : 'Select provider'}</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.providerName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="assign-driver" className="text-xs font-semibold text-slate-700">
                  Driver <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <select
                  id="assign-driver"
                  value={driverId}
                  disabled={!providerId || busy}
                  onChange={(event) => setDriverId(event.target.value)}
                  className={selectClass}
                >
                  <option value="">Let the provider choose</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName}
                      {d.vehicleType ? ` (${d.vehicleType})` : ''}
                      {!d.isAvailable ? ' – busy' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={busy || !providerId || unchanged}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {delivery ? 'Save assignment' : 'Assign delivery'}
            </button>
          </>
        )}
      </div>
    </section>
  )
}