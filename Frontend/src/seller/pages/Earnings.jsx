
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
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getOrders } from '../../buyer'
import DashboardCard from '../components/DashboardCard'
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, FileText, Send, Calendar, CheckSquare } from 'lucide-react'

export default function Earnings() {
  const [orders, setOrders] = useState([])
  const [payouts, setPayouts] = useState([])
  const [requestingPayout, setRequestingPayout] = useState(false)

  useEffect(() => {
    // Read local storage orders
    const existing = getOrders()
    setOrders(existing || [])

    // Read or initialize payouts history
    const storedPayouts = JSON.parse(localStorage.getItem('dcc_seller_payouts') || '[]')
    if (storedPayouts.length > 0) {
      setPayouts(storedPayouts)
    } else {
      const defaultPayouts = [
        {
          id: 'PAY-882910',
          date: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
          amount: 150000,
          account: 'HNB Bank - *4829',
          status: 'cleared',
        },
        {
          id: 'PAY-773820',
          date: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
          amount: 85000,
          account: 'HNB Bank - *4829',
          status: 'cleared',
        }
      ]
      localStorage.setItem('dcc_seller_payouts', JSON.stringify(defaultPayouts))
      setPayouts(defaultPayouts)
    }
  }, [])

  // Dynamic calculations based on paid/delivered/processing/confirmed orders
  const paidOrders = orders.filter(o => 
    o.status === 'confirmed' || 
    o.status === 'processing' || 
    o.status === 'shipped' || 
    o.status === 'delivered'
  )

  const grossSales = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const platformFeeRate = 0.10 // 10% Platform fee
  const platformFee = grossSales * platformFeeRate
  const netEarnings = grossSales - platformFee

  // Calculate total cleared payouts and pending payouts
  const totalPaidOut = payouts
    .filter(p => p.status === 'cleared')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPaidOut = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const availableBalance = Math.max(0, netEarnings - totalPaidOut - pendingPaidOut)

  const handleRequestPayout = () => {
    if (availableBalance <= 0) {
      toast.error('No available balance to withdraw.')
      return
    }

    setRequestingPayout(true)
    setTimeout(() => {
      const newPayout = {
        id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        amount: availableBalance,
        account: 'HNB Bank - *4829',
        status: 'pending',
      }

      const nextPayouts = [newPayout, ...payouts]
      localStorage.setItem('dcc_seller_payouts', JSON.stringify(nextPayouts))
      setPayouts(nextPayouts)
      setRequestingPayout(false)
      toast.success('Payout request submitted successfully! Funds will clear in 24 hours.')
    }, 1200)
  }

  const handleExportCSV = () => {
    // Generate CSV data string
    let csvContent = "data:text/csv;charset=utf-8," 
      + "Transaction ID,Date,Account,Amount (LKR),Status\n"
      + payouts.map(p => `${p.id},${new Date(p.date).toLocaleDateString()},${p.account},${p.amount},${p.status}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `earnings_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Export downloaded successfully!')
  }

  // Monthly sales mock data for the chart
  const monthlyData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 62000 },
    { month: 'Mar', amount: 55000 },
    { month: 'Apr', amount: 90000 },
    { month: 'May', amount: 110000 },
    { month: 'Jun', amount: grossSales > 0 ? grossSales : 125000 },
  ]
  const maxAmount = Math.max(...monthlyData.map(d => d.amount))

  return (
    <div className="space-y-6">
      {/* Platform weekly payouts note */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 flex items-start gap-2.5 text-xs text-slate-700">
        <Calendar className="h-4.5 w-4.5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-teal-800">Weekly Payouts Scheduled:</span> Payout requests are processed and sent to your bank account automatically every Wednesday. You can also manually trigger an express withdrawal below.
        </div>
      </div>

      {/* Earnings metrics cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Earnings"
          value={`Rs. ${Number(netEarnings).toLocaleString('en-LK')}`}
          hint="Calculated net income"
          icon={Wallet}
        />
        <DashboardCard
          title="Pending Payout"
          value={`Rs. ${Number(pendingPaidOut + availableBalance).toLocaleString('en-LK')}`}
          hint="Awaiting weekly dispatch"
          icon={Landmark}
        />
        <DashboardCard
          title="Commission Deducted"
          value={`Rs. ${Number(platformFee).toLocaleString('en-LK')}`}
          hint="10% DCC commission fee"
          icon={ArrowDownLeft}
        />
        <DashboardCard
          title="Withdrawn Cleared"
          value={`Rs. ${Number(totalPaidOut).toLocaleString('en-LK')}`}
          hint="Transferred to HNB"
          icon={ArrowUpRight}
        />
      </section>

      {/* Payout actions and chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Withdraw Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-bold text-slate-900">Request payout</h2>
            <p className="text-xs text-slate-500">Withdraw available earnings to your linked bank account.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Payout Destination
            </span>
            <span className="font-bold text-slate-900 text-sm block mt-1">HNB Bank (Sri Lanka)</span>
            <span className="text-xs text-slate-500 block">Account number ending in *4829</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 border-b border-dashed border-slate-200 pb-2">
            <span>Available express:</span>
            <span className="text-slate-900">Rs. {Number(availableBalance).toLocaleString('en-LK')}</span>
          </div>
          <button
            type="button"
            onClick={handleRequestPayout}
            disabled={requestingPayout || availableBalance <= 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {requestingPayout ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </div>

        {/* Visual Sales Chart Mockup */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Sales Trend</h2>
              <p className="text-xs text-slate-500">Monthly earnings summary (in LKR).</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </div>

          {/* Simple premium bar chart using pure Tailwind */}
          <div className="flex h-40 items-end justify-between gap-2 pt-4 border-b border-slate-100">
            {monthlyData.map((d, index) => {
              const heightPct = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0
              return (
                <div key={index} className="group flex flex-col items-center flex-1">
                  {/* Tooltip value */}
                  <div className="absolute mb-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap shadow z-10">
                    Rs. {Number(d.amount).toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full min-h-[4px] rounded-t-md bg-gradient-to-t from-dcc-primary/80 to-dcc-primary transition-all duration-500 hover:from-dcc-primary hover:to-dcc-primary-hover cursor-pointer"
                  />
                  <span className="text-[10px] font-semibold text-slate-500 mt-2 block">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">Payout history</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => {
                const dateStr = new Date(p.date).toLocaleDateString('en-LK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                return (
                  <tr key={p.id} className="text-slate-700 hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-900">{p.id}</td>
                    <td className="py-3 text-xs">{dateStr}</td>
                    <td className="py-3 text-slate-500 text-xs">{p.account}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      LKR {Number(p.amount).toLocaleString('en-LK')}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                          p.status === 'cleared'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'
                            : 'bg-amber-50 text-amber-700 ring-amber-200/80'
                        }`}
                      >
                        {p.status === 'cleared' ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
 )}
