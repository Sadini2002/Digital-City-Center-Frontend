/** BACKEND: GET /delivery/deliveries/:id, PATCH /delivery/deliveries/:id/status */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Navigation, Package } from 'lucide-react'
import {
  acceptDeliveryForCurrentDriver,
  getDeliveryById,
  updateDeliveryStatus,
} from '../utils/deliveryStorage'
import DeliveryStatusBadge from '../components/DeliveryStatusBadge'
import DeliveryStatusActions from '../components/DeliveryStatusActions'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryAlert from '../components/ui/DeliveryAlert'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'
import { formatLkr } from '../../components/category/categoryData'
import { isAwaitingAccept, isGpsActiveStatus, isTerminalStatus } from '../utils/deliveryStatus'

export default function DeliveryDetailPage() {
  const { id } = useParams()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    try {
      const d = getDeliveryById(id)
      if (!d) throw new Error('Delivery not found')
      setDelivery(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleUpdate = async (payload) => {
    const updated = updateDeliveryStatus(id, payload)
    setDelivery(updated)
  }

  const handleAccept = async () => {
    const updated = acceptDeliveryForCurrentDriver(id)
    setDelivery(updated)
  }

  if (loading) return <DeliveryBlockSkeleton className="h-96" />
  if (error) {
    return <DeliveryAlert variant="error" title="Could not load delivery">{error}</DeliveryAlert>
  }
  if (!delivery) return null

  const showGps = isGpsActiveStatus(delivery.status)
  const isTerminal = isTerminalStatus(delivery.status)

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tracking code
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900">{delivery.trackingCode}</p>
            <div className="mt-3">
              <DeliveryStatusBadge status={delivery.status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {showGps && (
              <Link
                to={`/delivery/deliveries/${id}/tracking`}
                className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                <Navigation className="h-4 w-4" />
                Live GPS
              </Link>
            )}
            <Link
              to="/delivery/deliveries"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to list
            </Link>
          </div>
        </div>
      </div>

      <DeliveryPanel title="Route" subtitle="Pickup and drop-off locations">
        <div className="space-y-5">
          <div className="flex gap-3 rounded-lg bg-slate-50 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-dcc-primary">
              <Package className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Pickup (seller)</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{delivery.pickupAddress}</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg bg-emerald-50/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Drop-off (customer)</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{delivery.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </DeliveryPanel>

      <DeliveryPanel title="Job details">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium text-slate-500">Delivery fee</dt>
            <dd className="mt-1 text-lg font-bold text-dcc-primary">
              {formatLkr(delivery.feeAmount ?? 0)}
            </dd>
          </div>
          {delivery.order?.orderNumber && (
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium text-slate-500">Linked order</dt>
              <dd className="mt-1 font-semibold text-slate-900">{delivery.order.orderNumber}</dd>
            </div>
          )}
        </dl>
      </DeliveryPanel>

      {delivery.statusHistory?.length > 0 && (
        <DeliveryPanel title="Status timeline" subtitle="Automatic log of each update">
          <ol className="relative space-y-6 border-l-2 border-violet-200 pl-6">
            {delivery.statusHistory.map((h) => (
              <li key={h.id} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-dcc-primary ring-2 ring-violet-100" />
                <DeliveryStatusBadge status={h.status} />
                {h.note && <p className="mt-1 text-sm text-slate-600">{h.note}</p>}
                <p className="mt-0.5 text-xs text-slate-400">
                  {new Date(h.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        </DeliveryPanel>
      )}

      {!isTerminal && (
        <DeliveryPanel
          title="Next steps"
          subtitle="Update status as you complete each leg of the delivery"
        >
          <DeliveryStatusActions
            delivery={delivery}
            onUpdate={handleUpdate}
            onAccept={isAwaitingAccept(delivery.status) ? handleAccept : undefined}
          />
        </DeliveryPanel>
      )}
    </div>
  )
}
