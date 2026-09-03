import { Link } from 'react-router-dom'
import useOrderLiveTracking from '../hooks/useOrderLiveTracking'
import LiveDeliveryPanel from './tracking/LiveDeliveryPanel'

/**
 * Embeds live delivery map on buyer order tracking.
 * BACKEND: GET /tracking/order/:orderId (via useOrderLiveTracking)
 */
export default function OrderLiveTrackingBlock({ orderId }) {
  const { delivery, trackingCode, location, route, isLive, loading, error } = useOrderLiveTracking(
    orderId
  )

  if (loading && !delivery) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
      </section>
    )
  }

  if (error && !delivery) {
    return (
      <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {error}
      </section>
    )
  }

  if (!delivery) {
    return (
      <section className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-600">
        A delivery job will appear here once your order is assigned to a courier.
      </section>
    )
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">Courier delivery</h2>
        {trackingCode && (
          <Link
            to={`/track/${trackingCode}`}
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            Open full tracking ({trackingCode})
          </Link>
        )}
      </div>
      <LiveDeliveryPanel
        delivery={delivery}
        liveLocation={location}
        route={route}
        isLive={isLive}
        title="Live courier map"
      />
    </section>
  )
}
