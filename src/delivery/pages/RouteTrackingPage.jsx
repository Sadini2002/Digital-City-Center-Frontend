/**
 * BACKEND:
 *   GET /deliveries/:id/tracking
 *   PUT /deliveries/:id/tracking (via useDriverGeolocation)
 */
import { Link, useLocation, useParams } from 'react-router-dom'
import { Navigation } from 'lucide-react'
import useLiveDeliveryTracking from '../hooks/useLiveDeliveryTracking'
import useDriverGeolocation from '../hooks/useDriverGeolocation'
import LiveDeliveryPanel from '../components/tracking/LiveDeliveryPanel'
import DeliveryAlert from '../components/ui/DeliveryAlert'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'

import { isGpsActiveStatus } from '../utils/deliveryStatus'

export default function RouteTrackingPage() {
  const { id } = useParams()
  const routerLocation = useLocation()
  const { tracking, location, route, isLive, loading } = useLiveDeliveryTracking(id)

  const gpsActive = tracking && isGpsActiveStatus(tracking.status)
  useDriverGeolocation(id, { enabled: true, active: gpsActive })

  if (loading && !tracking) return <DeliveryBlockSkeleton className="h-96" />
  if (!tracking) return null

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {routerLocation.state?.message && (
        <DeliveryAlert variant="success">{routerLocation.state.message}</DeliveryAlert>
      )}

      <DeliveryAlert variant={gpsActive ? 'success' : 'info'}>
        {gpsActive ? (
          <>
            <strong>GPS is live.</strong> Keep this tab open while driving. Your location updates every
            few seconds for the customer and dispatch.
          </>
        ) : (
          <>
            GPS starts after you mark the package as <strong>Picked up</strong> on the delivery page.
          </>
        )}
      </DeliveryAlert>

      <div className="flex justify-end">
        <Link
          to={`/delivery/deliveries/${id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Navigation className="h-4 w-4" />
          Back to delivery
        </Link>
      </div>

      <DeliveryPanel title="Live route map" subtitle={tracking.trackingCode}>
        <LiveDeliveryPanel
          delivery={tracking}
          liveLocation={location}
          route={route}
          isLive={isLive}
          title="Your route"
        />
      </DeliveryPanel>
    </div>
  )
}
