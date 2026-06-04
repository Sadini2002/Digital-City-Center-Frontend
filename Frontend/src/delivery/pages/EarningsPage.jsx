/** BACKEND: GET /delivery/earnings?days=7|30|90 */
import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { getEarnings } from '../utils/deliveryStorage'
import DeliveryStatCard from '../components/ui/DeliveryStatCard'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryPeriodSelect from '../components/ui/DeliveryPeriodSelect'
import DeliveryEmptyState from '../components/ui/DeliveryEmptyState'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'
import { formatLkr } from '../../components/category/categoryData'
import { ROLES } from '../data/constants'
import { readDeliveryUser } from '../utils/readDeliveryUser'

export default function DeliveryEarningsPage() {
  const user = readDeliveryUser()
  const isDriver = user?.role === ROLES.DELIVERY_DRIVER
  const [data, setData] = useState(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData(getEarnings({ days }))
    setLoading(false)
  }, [days])

  const chartData = data?.chart || []
  const maxEarnings = Math.max(...chartData.map((r) => r.earnings), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed text-slate-600">
          {isDriver
            ? 'You receive 70% of each delivery fee after marking a job as Delivered.'
            : 'Company earnings include the full delivery fee from completed jobs.'}
        </p>
        <DeliveryPeriodSelect value={days} onChange={setDays} />
      </div>

      {loading ? (
        <DeliveryBlockSkeleton className="h-80" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <DeliveryStatCard
              label="Total earnings"
              value={formatLkr(data?.totalEarnings ?? 0)}
              tone="brand"
              icon={Wallet}
            />
            <DeliveryStatCard
              label="Completed deliveries"
              value={data?.totalDeliveries ?? 0}
            />
          </div>

          <DeliveryPanel title="Daily breakdown" subtitle={`Last ${days} days`}>
            {chartData.length === 0 ? (
              <DeliveryEmptyState
                title="No earnings in this period"
                description="Complete deliveries to see your earnings chart fill in."
              />
            ) : (
              <div className="flex h-56 items-end gap-1.5 sm:gap-2">
                {chartData.map((row) => (
                  <div key={row.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full max-w-[2.5rem] rounded-t-md bg-gradient-to-t from-dcc-primary to-violet-400 transition hover:opacity-90"
                      style={{ height: `${Math.max(12, (row.earnings / maxEarnings) * 100)}%` }}
                      title={`${row.date}: ${formatLkr(row.earnings)}`}
                    />
                    <span className="text-[10px] font-medium text-slate-400">{row.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </DeliveryPanel>
        </>
      )}
    </div>
  )
}
