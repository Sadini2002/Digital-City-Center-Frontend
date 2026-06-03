import React from "react";

export default function Earnings() {
  const stats = [
    {
      title: "Total Revenue",
      value: "Rs. 125,000",
      icon: "💰",
    },
    {
      title: "Pending Payouts",
      value: "Rs. 18,500",
      icon: "⏳",
    },
    {
      title: "Completed Orders",
      value: "245",
      icon: "📦",
    },
    {
      title: "This Month",
      value: "Rs. 32,000",
      icon: "📈",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Earnings
        </h1>
        <p className="text-gray-600 mt-1">
          Track your revenue and payout history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-xl md:text-2xl font-bold mt-1">
                  {item.value}
                </h2>
              </div>
              <span className="text-3xl">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Recent Payouts
          </h2>

          <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Transaction ID</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-3">2026-06-01</td>
                <td className="py-3">TXN001</td>
                <td className="py-3">Rs. 12,500</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Paid
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3">2026-05-28</td>
                <td className="py-3">TXN002</td>
                <td className="py-3">Rs. 8,000</td>
                <td className="py-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Pending
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3">2026-05-25</td>
                <td className="py-3">TXN003</td>
                <td className="py-3">Rs. 15,000</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}