import { useMemo } from 'react'
import { getOrders } from '../../buyer'
import { formatLkr } from '../../components/category/categoryData'

function groupByDay(orders) {
  const map = new Map()
  orders.forEach((o) => {
    const day = o.placedAt ? new Date(o.placedAt).toISOString().slice(0, 10) : 'unknown'
    map.set(day, (map.get(day) || 0) + (o.total || 0))
  })
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export default function ReportsPage() {
  const orders = useMemo(() => getOrders(), [])
  const daily = useMemo(() => groupByDay(orders).slice(0, 14), [orders])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalOrders = orders.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Daily/weekly/monthly sales (demo based on stored orders).
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-sm text-slate-500">Total revenue</p>
          <p className="mt-2 text-3xl font-bold text-dcc-primary">{formatLkr(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-sm text-slate-500">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalOrders}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Daily sales (last 14)</h2>
        {daily.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No data yet. Place orders to populate reports.</p>
        ) : (
          <ul className="mt-4 divide-y divide-dcc-primary/10">
            {daily.map(([day, amount]) => (
              <li key={day} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-600">{day}</span>
                <span className="font-semibold text-slate-900">{formatLkr(amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Top products/sellers and weekly/monthly breakdown can be connected once backend analytics APIs are available.
      </p>
    </div>
  )
}

