import { useMemo, useState } from 'react'
import { Download, FileBarChart, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
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

function exportCsv(orders) {
  const header = ['Order ID', 'Email', 'Items', 'Total (LKR)', 'Status', 'Placed At']
  const rows = orders.map((o) => [
    o.id,
    o.email,
    o.items?.length ?? 0,
    o.total || 0,
    o.status,
    o.placedAt || '',
  ])
  const csvContent = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `dcc_orders_report_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const allOrders = useMemo(() => getOrders(), [])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  // Filter orders in-range if date range selected
  const filteredOrders = useMemo(() => {
    if (!fromDate && !toDate) return allOrders
    return allOrders.filter((o) => {
      if (!o.placedAt) return false
      const d = o.placedAt.slice(0, 10)
      if (fromDate && d < fromDate) return false
      if (toDate && d > toDate) return false
      return true
    })
  }, [allOrders, fromDate, toDate])

  const daily = useMemo(() => groupByDay(filteredOrders).slice(0, 14), [filteredOrders])
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalOrders = filteredOrders.length

  const handleGenerate = () => {
    setGenerating(true)
    setReportGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      if (filteredOrders.length === 0) {
        toast.error('No orders found for the selected range.')
        return
      }
      setReportGenerated(true)
      toast.success('Report generated successfully!')
    }, 1500)
  }

  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export.')
      return
    }
    exportCsv(filteredOrders)
    toast.success('CSV file downloaded!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Daily/weekly/monthly sales (demo based on stored orders).
        </p>
      </div>

      {/* Date range + Generate */}
      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Generate Report</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">From Date</label>
            <input
              id="report-from-date"
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setReportGenerated(false) }}
              className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">To Date</label>
            <input
              id="report-to-date"
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setReportGenerated(false) }}
              className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
          </div>
          <button
            id="generate-report-btn"
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileBarChart className="h-4 w-4" />
            )}
            {generating ? 'Generating…' : 'Generate Report'}
          </button>
          {reportGenerated && (
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-dcc-primary/25 bg-dcc-primary/5 px-4 py-2 text-sm font-semibold text-dcc-primary hover:bg-dcc-primary/10"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
        {(fromDate || toDate) && (
          <p className="mt-2 text-xs text-slate-500">
            Showing orders from{' '}
            <strong>{fromDate || 'beginning'}</strong> to{' '}
            <strong>{toDate || 'today'}</strong>.
          </p>
        )}
      </section>

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
          <p className="mt-3 text-sm text-slate-600">No data for the selected range. Place orders to populate reports.</p>
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
