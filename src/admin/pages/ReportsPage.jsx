
import { useEffect, useState } from 'react'
import {
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import toast from 'react-hot-toast'
import { adminApi } from '../services/adminApi'

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function getLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDefaultDateRange() {
  const today = new Date()
  const from = new Date(today)

  from.setDate(from.getDate() - 29)

  return {
    dateFrom: getLocalDate(from),
    dateTo: getLocalDate(today),
  }
}

function formatLkr(value) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatCompactLkr(value) {
  return `Rs. ${new Intl.NumberFormat('en-LK', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))}`
}

function formatPeriod(value) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-LK', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })
}

/* --------------------------------------------------
   SUMMARY CARD
-------------------------------------------------- */

function SummaryCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-violet-100 p-3">
          <Icon className="h-6 w-6 text-violet-700" />
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------------------
   CHART CARD
-------------------------------------------------- */

function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="h-72 w-full">
        {children}
      </div>
    </section>
  )
}

/* --------------------------------------------------
   CUSTOM TOOLTIP
-------------------------------------------------- */

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-violet-100 bg-white p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-700">
        {formatPeriod(label)}
      </p>

      {payload.map((item) => (
        <p
          key={item.dataKey}
          className="text-sm text-slate-600"
        >
          {item.name}:{' '}
          <span className="font-semibold text-violet-700">
            {item.dataKey === 'revenue'
              ? formatLkr(item.value)
              : item.value}
          </span>
        </p>
      ))}
    </div>
  )
}

/* --------------------------------------------------
   MAIN REPORTS PAGE
-------------------------------------------------- */

export default function ReportsPage() {
  const defaultDates = getDefaultDateRange()

  const [dateFrom, setDateFrom] = useState(defaultDates.dateFrom)
  const [dateTo, setDateTo] = useState(defaultDates.dateTo)

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  /* --------------------------------------------------
     LOAD REPORTS
  -------------------------------------------------- */

  const loadReports = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select both dates.')
      return
    }

    if (dateFrom > dateTo) {
      toast.error('Start date cannot be after end date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await adminApi.getReportsAnalytics({
        dateFrom,
        dateTo,
      })

      const result = response.data

      if (!result?.success) {
        throw new Error(
          result?.message || 'Unable to load reports.'
        )
      }

      setReport(result.data)
    } catch (err) {
      console.error('Reports loading error:', err)

      setReport(null)

      const message =
        err.message || 'Failed to load analytics data.'

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
    // Initial load only. Filters are applied using the Apply Filters button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* --------------------------------------------------
     CSV EXPORT
  -------------------------------------------------- */

  const handleExportCSV = async () => {
    if (!dateFrom || !dateTo || dateFrom > dateTo) {
      toast.error('Please select a valid date range.')
      return
    }

    setExporting(true)

    try {
      const response = await adminApi.exportReportsCSV({
        dateFrom,
        dateTo,
      })

      const blob = new Blob(
        [response.data],
        { type: 'text/csv;charset=utf-8;' }
      )

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download =
        `DCC_Sales_Report_${dateFrom}_to_${dateTo}.csv`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)

      toast.success('Sales report exported successfully.')
    } catch (err) {
      console.error('CSV export error:', err)

      toast.error(
        err.message || 'Failed to export CSV report.'
      )
    } finally {
      setExporting(false)
    }
  }

  /* --------------------------------------------------
     REPORT DATA
  -------------------------------------------------- */

  const summary = report?.summary || {}

  const dailySales = report?.sales?.daily || []
  const weeklySales = report?.sales?.weekly || []
  const monthlySales = report?.sales?.monthly || []

  const topProducts = report?.topProducts || []
  const topSellers = report?.topSellers || []

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-violet-700" />

            <h1 className="text-2xl font-bold text-slate-900">
              Reports & Analytics
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor sales performance, product performance
            and seller performance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />

          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* DATE FILTERS */}

      <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-violet-700" />

          <h2 className="font-bold text-slate-900">
            Report Filters
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="report-date-from"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              Start Date
            </label>

            <input
              id="report-date-from"
              type="date"
              value={dateFrom}
              max={getLocalDate(new Date())}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label
              htmlFor="report-date-to"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              End Date
            </label>

            <input
              id="report-date-to"
              type="date"
              value={dateTo}
              min={dateFrom}
              max={getLocalDate(new Date())}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={loadReports}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />

              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </section>

      {/* ERROR STATE */}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-700">
            Unable to load reports
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadReports}
            className="mt-3 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* LOADING STATE */}

      {loading && (
        <div className="rounded-2xl border border-violet-100 bg-white p-12 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-violet-700" />

          <p className="mt-4 font-semibold text-slate-700">
            Loading reports and analytics...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Fetching sales, products and seller performance.
          </p>
        </div>
      )}

      {/* REPORT CONTENT */}

      {!loading && !error && report && (
        <>
          {/* SUMMARY CARDS */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total Sales Revenue"
              value={formatLkr(summary.totalRevenue)}
              description="Paid orders within selected dates"
              icon={TrendingUp}
            />

            <SummaryCard
              title="Total Paid Orders"
              value={Number(summary.totalOrders || 0).toLocaleString()}
              description="Successfully paid orders"
              icon={ShoppingBag}
            />

            <SummaryCard
              title="Average Order Value"
              value={formatLkr(summary.averageOrderValue)}
              description="Average value per paid order"
              icon={BarChart3}
            />
          </section>

          {/* DAILY SALES */}

          <ChartCard
            title="Daily Sales"
            description="Daily revenue and order count for the selected period."
          >
            {dailySales.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No daily sales data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySales}>
                  <defs>
                    <linearGradient
                      id="dailyRevenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#7c3aed"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="period"
                    tickFormatter={formatPeriod}
                    minTickGap={25}
                  />

                  <YAxis
                    tickFormatter={formatCompactLkr}
                  />

                  <Tooltip content={<SalesTooltip />} />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#7c3aed"
                    fill="url(#dailyRevenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* WEEKLY SALES */}

          <ChartCard
            title="Weekly Sales"
            description="Revenue generated during each week."
          >
            {weeklySales.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No weekly sales data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="period"
                    tickFormatter={formatPeriod}
                  />

                  <YAxis
                    tickFormatter={formatCompactLkr}
                  />

                  <Tooltip content={<SalesTooltip />} />

                  <Legend />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* MONTHLY SALES */}

          <ChartCard
            title="Monthly Sales"
            description="Monthly revenue and paid order trends."
          >
            {monthlySales.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No monthly sales data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="period"
                    tickFormatter={formatPeriod}
                  />

                  <YAxis
                    tickFormatter={formatCompactLkr}
                  />

                  <Tooltip content={<SalesTooltip />} />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* TOP PRODUCTS */}

          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-violet-700" />

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Top-Selling Products
                </h2>

                <p className="text-sm text-slate-500">
                  Products ranked by units sold.
                </p>
              </div>
            </div>

            {topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No product sales data available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Seller</th>
                      <th className="px-4 py-3">Units Sold</th>
                      <th className="px-4 py-3">Orders</th>
                      <th className="px-4 py-3">Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr
                        key={product.productId}
                        className="border-b border-slate-50 hover:bg-violet-50/40"
                      >
                        <td className="px-4 py-4 font-semibold text-violet-700">
                          #{index + 1}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {product.productName}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {product.sellerName}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {product.unitsSold}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {product.orders}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatLkr(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* TOP SELLERS */}

          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-700" />

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Top-Performing Sellers
                </h2>

                <p className="text-sm text-slate-500">
                  Sellers ranked by sales revenue.
                </p>
              </div>
            </div>

            {topSellers.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No seller performance data available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Seller</th>
                      <th className="px-4 py-3">Orders</th>
                      <th className="px-4 py-3">Units Sold</th>
                      <th className="px-4 py-3">Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topSellers.map((seller, index) => (
                      <tr
                        key={seller.sellerId}
                        className="border-b border-slate-50 hover:bg-violet-50/40"
                      >
                        <td className="px-4 py-4 font-semibold text-violet-700">
                          #{index + 1}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {seller.sellerName}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seller.orders}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {seller.unitsSold}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatLkr(seller.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="text-xs text-slate-500">
            Sales reports include paid orders only. Revenue is displayed
            in LKR. Report results are cached for up to 60 seconds.
          </p>
        </>
      )}
    </div>
  )
}
