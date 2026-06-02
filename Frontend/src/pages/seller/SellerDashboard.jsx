function DashboardCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default function SellerDashboard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value="120" />
        <DashboardCard title="Orders" value="45" />
        <DashboardCard title="Earnings" value="Rs. 25,000" />
        <DashboardCard title="Rating" value="4.8 ★" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-900">#1001</td>
                <td className="px-4 py-3 text-slate-700">John</td>
                <td className="px-4 py-3 text-slate-700">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
