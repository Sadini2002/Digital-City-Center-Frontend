import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getOrders } from '../../buyer'
import DashboardCard from '../components/DashboardCard'
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, FileText, Send, Calendar } from 'lucide-react'
import { addSellerNotification } from '../../utils/notificationStorage'

export default function Earnings() {
  const [orders, setOrders] = useState([])
  const [payouts, setPayouts] = useState([])
  const [requestingPayout, setRequestingPayout] = useState(false)

  useEffect(() => {
    const existing = getOrders()
    setOrders(existing || [])

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
        },
      ]
      localStorage.setItem('dcc_seller_payouts', JSON.stringify(defaultPayouts))
      setPayouts(defaultPayouts)
    }
  }, [])

  const paidOrders = orders.filter(
    (o) =>
      o.status === 'confirmed' ||
      o.status === 'processing' ||
      o.status === 'shipped' ||
      o.status === 'delivered'
  )

  const grossSales = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const platformFeeRate = 0.1
  const platformFee = grossSales * platformFeeRate
  const netEarnings = grossSales - platformFee

  const totalPaidOut = payouts
    .filter((p) => p.status === 'cleared')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPaidOut = payouts
    .filter((p) => p.status === 'pending')
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

      // Add Seller notifications for payout initiation and automatic mock clearing
      addSellerNotification(
        'Payout Initiated',
        `Payout request of LKR ${newPayout.amount.toLocaleString()} (ID: ${newPayout.id}) has been submitted.`,
        'info'
      )
      addSellerNotification(
        'Payout Cleared',
        `Your payout of LKR ${newPayout.amount.toLocaleString()} (ID: ${newPayout.id}) has been cleared to ${newPayout.account}.`,
        'success'
      )

      toast.success('Payout request submitted successfully! Funds will clear in 24 hours.')
    }, 1200)
  }

  const handleExportCSV = () => {
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      'Transaction ID,Date,Account,Amount (LKR),Status\n' +
      payouts
        .map(
          (p) =>
            `${p.id},${new Date(p.date).toLocaleDateString()},${p.account},${p.amount},${p.status}`
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `earnings_history_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('CSV Export downloaded successfully!')
  }

  const monthlyData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 62000 },
    { month: 'Mar', amount: 55000 },
    { month: 'Apr', amount: 90000 },
    { month: 'May', amount: 110000 },
    { month: 'Jun', amount: grossSales > 0 ? grossSales : 125000 },
  ]
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount))

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs text-slate-700">
        <Calendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
        <div>
          <span className="font-bold text-teal-800">Weekly Payouts Scheduled:</span> Payout requests are
          processed and sent to your bank account automatically every Wednesday. You can also manually
          trigger an express withdrawal below.
        </div>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900">Request payout</h2>
            <p className="text-xs text-slate-500">Withdraw available earnings to your linked bank account.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Payout Destination
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-900">HNB Bank (Sri Lanka)</span>
            <span className="block text-xs text-slate-500">Account number ending in *4829</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-2 text-xs font-semibold text-slate-600">
            <span>Available express:</span>
            <span className="text-slate-900">Rs. {Number(availableBalance).toLocaleString('en-LK')}</span>
          </div>
          <button
            type="button"
            onClick={handleRequestPayout}
            disabled={requestingPayout || availableBalance <= 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {requestingPayout ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Sales Trend</h2>
              <p className="text-xs text-slate-500">Monthly earnings summary (in LKR).</p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </div>

          <div className="flex h-40 items-end justify-between gap-2 border-b border-slate-100 pt-4">
            {monthlyData.map((d, index) => {
              const heightPct = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0
              return (
                <div key={index} className="group relative flex flex-1 flex-col items-center">
                  <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    Rs. {Number(d.amount).toLocaleString()}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full min-h-[4px] cursor-pointer rounded-t-md bg-gradient-to-t from-dcc-primary/80 to-dcc-primary transition-all duration-500 hover:from-dcc-primary hover:to-dcc-primary-hover"
                  />
                  <span className="mt-2 block text-[10px] font-semibold text-slate-500">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Payout history</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                    <td className="py-3 text-xs text-slate-500">{p.account}</td>
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
