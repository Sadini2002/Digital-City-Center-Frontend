import React from 'react';
export default function SellerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Seller Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <DashboardCard title="Products" value="120" />
        <DashboardCard title="Orders" value="45" />
        <DashboardCard title="Earnings" value="Rs. 25,000" />
        <DashboardCard title="Rating" value="4.8 ★" />
      </div>

      <div className="mt-8 bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#1001</td>
              <td>John</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}