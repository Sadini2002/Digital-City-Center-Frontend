import { Link } from 'react-router-dom'
import { ArrowRight, Package, ShoppingBag, Star, Wallet } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import StatusBadge from '../components/StatusBadge'

const recentOrders = [
  { id: '#1001', customer: 'John Perera', status: 'Pending' },
  { id: '#1002', customer: 'Sarah Silva', status: 'Processing' },
  { id: '#1003', customer: 'Kamal Jay', status: 'Delivered' },
]

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function SellerDashboard() {
  const user = readUser()
  const name = user.name || 'Seller'

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-6">
        <p className="text-sm font-medium text-dcc-primary">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Hi, {name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Quick snapshot of your shop. Use the menu to manage listings and orders.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Add listing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View orders
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value="120" hint="12 active listings" icon={ShoppingBag} />
        <DashboardCard title="Orders" value="45" hint="8 awaiting action" icon={Package} />
        <DashboardCard title="Earnings" value="Rs. 25,000" hint="This month" icon={Wallet} />
        <DashboardCard title="Rating" value="4.8" hint="128 reviews" icon={Star} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900">Recent orders</h2>
            <p className="text-sm text-slate-500">Latest activity from your shop</p>
          </div>
          <Link
            to="/seller/orders"
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                  <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
