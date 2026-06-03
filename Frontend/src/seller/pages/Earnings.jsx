import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getOrders } from '../../buyer'
import DashboardCard from '../components/DashboardCard'
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, FileText, Send } from 'lucide-react'

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
          date: new Date(Date.now() - 3600000 * 24 * 10).toISOString(), // 10 days ago
          amount: 150000,
          account: 'HNB Bank - *4829',
          status: 'cleared',
        },
        {
          id: 'PAY-773820',
          date: new Date(Date.now() - 3600000 * 24 * 30).toISOString(), // 30 days ago
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

  // Calculate total cleared payouts
  const totalPaidOut = payouts
    .filter(p => p.status === 'cleared')
    .reduce((sum, p) => sum + p.amount, 0)

  const availableBalance = Math.max(0, netEarnings - totalPaidOut)

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
    toast.success('CSV Export started! Check your downloads.')
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
      {/* Earnings metrics cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Gross Sales"
          value={`Rs. ${Number(grossSales).toLocaleString('en-LK')}`}
          hint="Total order revenue"
          icon={ArrowUpRight}
        />
        <DashboardCard
          title="Platform Fee (10%)"
          value={`Rs. ${Number(platformFee).toLocaleString('en-LK')}`}
          hint="DCC service fee"
          icon={ArrowDownLeft}
        />
        <DashboardCard
          title="Net Earnings"
          value={`Rs. ${Number(netEarnings).toLocaleString('en-LK')}`}
          hint="Your total earnings"
          icon={Wallet}
        />
        <DashboardCard
          title="Available Balance"
          value={`Rs. ${Number(availableBalance).toLocaleString('en-LK')}`}
          hint="Ready for withdrawal"
          icon={Landmark}
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
              className="inline-flex items-center gap-1 text-xs font-bold text-dcc-primary hover:underline"
            >
              <FileText className="h-3.5 w-3.5" />
              Export CSV
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
  )
}
