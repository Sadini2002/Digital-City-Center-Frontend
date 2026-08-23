/** BACKEND: GET /delivery/analytics?days=7|30|90 — DELIVERY_PROVIDER role */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Clock, Target, XCircle } from 'lucide-react'
import { deliveryApi } from '../services/deliveryApi'
import DeliveryStatusBadge from '../components/DeliveryStatusBadge'
import DeliveryStatCard from '../components/ui/DeliveryStatCard'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryPeriodSelect from '../components/ui/DeliveryPeriodSelect'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'

export default function DeliveryAnalyticsPage() {
  const [data, setData] = useState(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const result = await deliveryApi.getAnalytics({ days })
        if (!cancelled) setData(result)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [days])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed text-slate-600">
          Metrics for assigned jobs in the last {days} days. Pending unassigned jobs are in the{' '}
          <Link to="/delivery/deliveries" className="font-semibold text-dcc-primary hover:underline">
            available pool
          </Link>
          .
        </p>
        <DeliveryPeriodSelect value={days} onChange={setDays} />
      </div>

      {loading ? (
        <DeliveryBlockSkeleton className="h-64" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DeliveryStatCard
              label="Completed"
              value={data?.completed ?? 0}
              tone="success"
              icon={Target}
            />
            <DeliveryStatCard label="Failed" value={data?.failed ?? 0} tone="danger" icon={XCircle} />
            <DeliveryStatCard
              label="Success rate"
              value={`${data?.successRate ?? 0}%`}
              tone="brand"
              icon={BarChart3}
            />
            <DeliveryStatCard
              label="Avg. delivery time"
              value={`${data?.avgDeliveryMinutes ?? 0} min`}
              icon={Clock}
            />
          </div>

          <DeliveryPanel title="Breakdown by status">
            {!data?.byStatus?.length ? (
              <p className="text-sm text-slate-500">No delivery data for this period yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.byStatus.map((row) => (
                  <li
                    key={row.status}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <DeliveryStatusBadge status={row.status} />
                    <span className="text-lg font-bold tabular-nums text-slate-900">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </DeliveryPanel>
        </>
      )}
    </div>
  )
}
