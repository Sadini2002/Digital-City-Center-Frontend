/** BACKEND: Parent passes delivery object from tracking/delivery APIs (see trackingApi.js) */
import { Radio } from 'lucide-react'
import DeliveryStatusBadge from '../DeliveryStatusBadge'
import DeliveryTimeline from './DeliveryTimeline'
import LiveEtaBadge from './LiveEtaBadge'
import TrackingHistoryList from './TrackingHistoryList'
import TrackingMap from './TrackingMap'

/**
 * Shared live/public tracking UI.
 * Data from trackingApi.getPublic / trackingApi.getDeliveryLive (BACKEND) or mocks.
 */
export default function LiveDeliveryPanel({
  delivery,
  liveLocation,
  route,
  isLive = false,
  showHistory = true,
  title = 'Live delivery',
}) {
  if (!delivery) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Delivery has not been created for this shipment yet.
      </div>
    )
  }

  const driverLoc =
    liveLocation ||
    delivery.location ||
    (route?.length ? route[route.length - 1] : null)

  const path = route?.length ? route : delivery.route || []

  const pickup =
    delivery.pickup ||
    (delivery.pickupAddress
      ? { label: delivery.pickupAddress, latitude: delivery.pickupLatitude, longitude: delivery.pickupLongitude }
      : null)

  const dropoff =
    delivery.dropoff ||
    (delivery.deliveryAddress
      ? { label: delivery.deliveryAddress, latitude: delivery.dropoffLatitude, longitude: delivery.dropoffLongitude }
      : null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          {delivery.trackingCode && (
            <p className="font-mono text-sm text-slate-500">{delivery.trackingCode}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <Radio className="h-3 w-3 animate-pulse" />
              Live
            </span>
          )}
          <DeliveryStatusBadge status={delivery.status} />
        </div>
      </div>

      <LiveEtaBadge
        etaMinutes={liveLocation?.etaMinutes ?? delivery.etaMinutes}
        distanceKm={liveLocation?.distanceRemainingKm ?? delivery.distanceRemainingKm}
      />

      <TrackingMap
        pickup={pickup}
        dropoff={dropoff}
        driverLocation={driverLoc}
        route={path}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Delivery timeline</h4>
          <DeliveryTimeline steps={delivery.timeline || []} />
        </div>
        {showHistory && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">GPS history</h4>
            <TrackingHistoryList points={path} />
          </div>
        )}
      </div>

      {delivery.driver && (
        <p className="text-sm text-slate-600">
          Driver: <span className="font-medium">{delivery.driver.fullName}</span>
          {delivery.driver.phone ? ` · ${delivery.driver.phone}` : ''}
        </p>
      )}
    </div>
  )
}
