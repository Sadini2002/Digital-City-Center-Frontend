import { useMemo } from 'react'
import { ArrowUpRight, BarChart3, ShoppingCart, Store, Users } from 'lucide-react'
import { getOrders } from '../../buyer'
import { getSellerApplications } from '../utils/adminStorage'

function formatLkr(amount) {
  return `LKR ${Number(amount || 0).toLocaleString('en-LK')}`
}

export default function AdminDashboardPage() {
  const orders = useMemo(() => getOrders(), [])
  const applications = useMemo(() => getSellerApplications(), [])

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  // Demo counts (until backend provides real numbers)
  const totalBuyers = 250_000
  const totalSellers = 5_000 + applications.filter((a) => a.status === 'approved').length

  const cards = [
    { label: 'Total sellers', value: totalSellers.toLocaleString('en-LK'), icon: Store, tone: 'from-violet-50 to-white' },
    { label: 'Total buyers', value: totalBuyers.toLocaleString('en-LK'), icon: Users, tone: 'from-cyan-50 to-white' },
    { label: 'Total orders', value: totalOrders.toLocaleString('en-LK'), icon: ShoppingCart, tone: 'from-violet-50 to-white' },
    { label: 'Total revenue', value: formatLkr(totalRevenue), icon: BarChart3, tone: 'from-cyan-50 to-white' },
  ]

  const pendingApps = applications.filter((a) => a.status === 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard overview</h1>
        <p className="mt-1 text-sm text-slate-600">Platform KPIs (demo + local orders)</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border border-dcc-primary/20 bg-gradient-to-br ${c.tone} p-5 shadow-sm shadow-dcc-primary/10`}
          >
            <div className="flex items-start justify-between">
              <span className="inline-flex rounded-lg bg-dcc-primary/10 p-2">
                <c.icon className="h-5 w-5 text-dcc-primary" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <ArrowUpRight className="h-3 w-3" />
                +12%
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="mt-1 text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Sales trend snapshot</h2>
          <div className="mt-5 h-40 rounded-xl border border-dcc-primary/15 bg-gradient-to-r from-violet-50 via-white to-cyan-50 p-4">
            <div className="h-full w-full rounded-lg border border-dashed border-dcc-primary/25 bg-white/70" />
          </div>
          <p className="mt-3 text-xs text-slate-500">Connect reports API to render real chart data.</p>
        </div>

        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Quick stats</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg bg-dcc-auth px-3 py-2">
              <span className="text-slate-600">Pending sellers</span>
              <span className="font-semibold text-dcc-primary">{pendingApps.length}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-dcc-auth px-3 py-2">
              <span className="text-slate-600">Orders today</span>
              <span className="font-semibold text-dcc-primary">{totalOrders}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-dcc-auth px-3 py-2">
              <span className="text-slate-600">Revenue</span>
              <span className="font-semibold text-dcc-primary">{formatLkr(totalRevenue)}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Pending seller applications</h2>
        {pendingApps.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No pending applications right now.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {pendingApps.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{a.shopName}</p>
                  <p className="text-slate-500">{a.email}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  Pending
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

