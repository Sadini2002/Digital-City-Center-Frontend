/** BACKEND: GET /delivery/dashboard */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock, Package, Truck } from 'lucide-react'
import deliveryApi from '../services/deliveryApi'
import DashboardCard from '../../seller/components/DashboardCard'
import DeliveryStatusBadge from '../components/DeliveryStatusBadge'
import DeliveryWelcomeBanner from '../components/ui/DeliveryWelcomeBanner'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryEmptyState from '../components/ui/DeliveryEmptyState'
import { DeliveryStatsSkeleton } from '../components/ui/DeliverySkeleton'
import { getDeliveryDisplayName, readDeliveryUser } from '../utils/readDeliveryUser'
import { ROLES } from '../data/constants'

export default function DeliveryDashboardPage() {
  const user = readDeliveryUser()
  const isDriver = user?.role === ROLES.DELIVERY_DRIVER
  const name = getDeliveryDisplayName(user)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    deliveryApi.getDashboard().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-xl bg-slate-200/80" />
        <DeliveryStatsSkeleton count={3} />
      </div>
    )
  }

  const stats = data?.stats || {}

  return (
    <div className="space-y-6">
      <DeliveryWelcomeBanner
        name={name}
        subtitle={
          isDriver
            ? 'Accept jobs from the pool, update status as you go, and track earnings from completed drops.'
            : 'Overview of fleet activity, open jobs, and performance for your delivery company.'
        }
        primaryAction={{
          to: '/delivery/deliveries',
          label: isDriver ? 'View deliveries' : 'Manage deliveries',
        }}
        secondaryAction={{
          to: isDriver ? '/delivery/earnings' : '/delivery/analytics',
          label: isDriver ? 'My earnings' : 'View analytics',
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Awaiting pickup"
          value={stats.pending ?? 0}
          hint="Jobs not yet collected"
          icon={Package}
          to="/delivery/deliveries"
        />
        <DashboardCard
          title="In progress"
          value={stats.active ?? 0}
          hint="Accepted through on the way"
          icon={Truck}
          to="/delivery/deliveries"
        />
        <DashboardCard
          title="Delivered today"
          value={stats.deliveredToday ?? 0}
          hint="Completed since midnight"
          icon={CheckCircle}
          to="/delivery/deliveries"
        />
      </div>

      <DeliveryPanel
        title="Recent deliveries"
        subtitle="Latest updates across your account"
        action={
          <Link
            to="/delivery/deliveries"
            className="inline-flex items-center gap-1 text-sm font-semibold text-dcc-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        {!data?.recentDeliveries?.length ? (
          <DeliveryEmptyState
            icon={Truck}
            title="No deliveries yet"
            description="When orders are ready, they appear in Available pool for drivers to accept."
            action={
              <Link
                to="/delivery/deliveries"
                className="inline-flex rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                Open deliveries
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.recentDeliveries.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/delivery/deliveries/${d.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 transition first:pt-0 last:pb-0 hover:bg-slate-50/80 sm:px-2 sm:rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-dcc-primary">{d.trackingCode}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-600">{d.deliveryAddress}</p>
                  </div>
                  <DeliveryStatusBadge status={d.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DeliveryPanel>

      {isDriver && (stats.active ?? 0) > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          <Clock className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            You have active deliveries. Open a job and use <strong>Live tracking</strong> after marking
            picked up.
          </p>
        </div>
      )}
    </div>
  )
}
