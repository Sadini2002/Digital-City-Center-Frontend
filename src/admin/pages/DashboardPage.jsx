import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  BarChart3,
  Bell,
  ClipboardCheck,
  Layers,
  Package,
  RefreshCw,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'

import { adminApi } from '../services/adminApi'
import { getPlatformSettings } from '../utils/adminStorage'
import { canAdminAccessPath } from '../utils/adminRole'
import { formatDate, formatLkr } from '../utils/sellerStatus'

const CARD =
  'rounded-2xl border border-dcc-primary/20 bg-white shadow-sm shadow-dcc-primary/10'

const QUICK_LINKS = [
  { to: '/admin/sellers', label: 'Sellers', hint: 'Applications and accounts', icon: Store },
  { to: '/admin/delivery', label: 'Delivery providers', hint: 'Review provider requests', icon: Truck },
  { to: '/admin/orders', label: 'Orders', hint: 'Track all orders', icon: Package },
  { to: '/admin/categories', label: 'Categories', hint: 'Manage product categories', icon: Layers },
  { to: '/admin/reports', label: 'Reports', hint: 'Sales and performance', icon: BarChart3 },
  { to: '/admin/announcements', label: 'Announcements', hint: 'Message the marketplace', icon: Bell },
]

function getStoredAdminRole() {
  try {
    return JSON.parse(localStorage.getItem('admin_user') || '{}')?.role
  } catch {
    return null
  }
}

function formatCount(value) {
  return Number(value || 0).toLocaleString('en-LK')
}

function KpiCard({ label, value, icon }) {
  const Icon = icon

  return (
    <div className={`${CARD} p-5`}>
      <span className="inline-flex rounded-lg bg-dcc-primary/10 p-2">
        <Icon className="h-5 w-5 text-dcc-primary" aria-hidden="true" />
      </span>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className={`${CARD} p-5`} aria-hidden="true">
      <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
      <div className="mt-4 h-7 w-24 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-100" />
    </div>
  )
}

function AlertBanner({ count, noun, to, action }) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-sm font-semibold text-amber-900">
          {formatCount(count)} {noun} {count === 1 ? 'is' : 'are'} waiting for review
        </p>
      </div>
      <Link
        to={to}
        className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
      >
        {action}
      </Link>
    </div>
  )
}

function PendingPanel({ title, viewAllTo, viewAllLabel, emptyText, items, renderMeta }) {
  return (
    <section className={`${CARD} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <Link to={viewAllTo} className="text-sm font-semibold text-dcc-primary hover:underline">
          {viewAllLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-dcc-auth px-4 py-6 text-center text-sm text-slate-600">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{item.title}</p>
                <p className="truncate text-slate-500">{renderMeta(item)}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                {formatDate(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await adminApi.getDashboard()
        if (!cancelled) setData(response.data?.data ?? null)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const pricing = useMemo(() => getPlatformSettings(), [])
  const role = getStoredAdminRole()
  const quickLinks = QUICK_LINKS.filter((link) => canAdminAccessPath(role, link.to))

  const kpis = data?.kpis
  const pendingSellers = kpis?.pendingSellerApplications ?? 0
  const pendingProviders = kpis?.pendingDeliveryProviderApplications ?? 0

  const cards = kpis
    ? [
        { label: 'Total sellers', value: formatCount(kpis.totalSellers), icon: Store },
        { label: 'Total buyers', value: formatCount(kpis.totalBuyers), icon: Users },
        { label: 'Total orders', value: formatCount(kpis.totalOrders), icon: ShoppingCart },
        { label: 'Total revenue', value: formatLkr(kpis.totalRevenue), icon: Wallet },
        { label: 'Pending seller applications', value: formatCount(pendingSellers), icon: ClipboardCheck },
        { label: 'Pending delivery provider applications', value: formatCount(pendingProviders), icon: Truck },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            {data?.generatedAt
              ? `Updated ${new Date(data.generatedAt).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}`
              : 'Live platform numbers'}
          </p>
        </div>
        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">Could not load dashboard data</p>
            <p className="mt-0.5">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-2 inline-flex items-center gap-1 font-semibold underline"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Pending application alerts */}
      {!error && kpis && (pendingSellers > 0 || pendingProviders > 0) && (
        <div className="space-y-3">
          {pendingSellers > 0 && (
            <AlertBanner
              count={pendingSellers}
              noun={pendingSellers === 1 ? 'seller application' : 'seller applications'}
              to="/admin/sellers?status=pending"
              action="Review sellers"
            />
          )}
          {pendingProviders > 0 && (
            <AlertBanner
              count={pendingProviders}
              noun={
                pendingProviders === 1
                  ? 'delivery provider application'
                  : 'delivery provider applications'
              }
              to="/admin/delivery"
              action="Review providers"
            />
          )}
        </div>
      )}

      {/* KPI cards */}
      {!error && (
        <section
          aria-label="Key numbers"
          aria-busy={loading}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {loading && !kpis
            ? Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
            : cards.map((card) => <KpiCard key={card.label} {...card} />)}
        </section>
      )}

      {/* Recent pending applications */}
      {!error && kpis && (
        <section className="grid gap-4 lg:grid-cols-2">
          <PendingPanel
            title="Pending seller applications"
            viewAllTo="/admin/sellers?status=pending"
            viewAllLabel="Review all"
            emptyText="No seller applications are waiting."
            items={(data.recentPendingSellers ?? []).map((s) => ({
              id: s.id,
              title: s.shopName,
              createdAt: s.createdAt,
              ownerName: s.ownerName,
              ownerEmail: s.ownerEmail,
            }))}
            renderMeta={(item) => item.ownerEmail || item.ownerName || '-'}
          />
          <PendingPanel
            title="Pending delivery providers"
            viewAllTo="/admin/delivery"
            viewAllLabel="Review all"
            emptyText="No delivery provider applications are waiting."
            items={(data.recentPendingDeliveryProviders ?? []).map((p) => ({
              id: p.id,
              title: p.name,
              createdAt: p.createdAt,
              district: p.district,
              email: p.email,
            }))}
            renderMeta={(item) => [item.district, item.email].filter(Boolean).join(' - ') || '-'}
          />
        </section>
      )}

      {/* Quick navigation */}
      {quickLinks.length > 0 && (
        <section aria-labelledby="quick-nav-heading">
          <h2 id="quick-nav-heading" className="text-lg font-bold text-slate-900">
            Quick navigation
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${CARD} flex items-center gap-3 p-4 transition-colors hover:border-dcc-primary/50`}
                >
                  <span className="rounded-lg bg-dcc-primary/10 p-2">
                    <Icon className="h-5 w-5 text-dcc-primary" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900">{link.label}</span>
                    <span className="block truncate text-sm text-slate-500">{link.hint}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Delivery pricing (unchanged) */}
      <section className={`${CARD} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Delivery pricing configuration</h2>
            <p className="mt-1 text-sm text-slate-600">
              Active model:{' '}
              <strong className="text-dcc-primary">
                {pricing.pricingModel === 'flat' ? 'Flat fee' : 'Distance based'}
              </strong>
              {pricing.pricingModel === 'distance'
                ? ` · Base LKR ${Number(pricing.baseFee || 0).toLocaleString('en-LK')} + LKR ${Number(pricing.perKmFee || 0).toLocaleString('en-LK')}/km`
                : ` · Flat LKR ${Number(pricing.flatFee || 0).toLocaleString('en-LK')}`}
            </p>
          </div>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Configure delivery pricing
          </Link>
        </div>
      </section>

      {/* Coverage areas (unchanged) */}
      <section className={`${CARD} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Delivery coverage areas</h2>
            <p className="mt-1 text-sm text-slate-600">
              {(pricing.coverageAreas || []).length > 0
                ? `${pricing.coverageAreas.length} district(s) enabled for checkout delivery`
                : 'No coverage areas configured yet'}
            </p>
            {(pricing.coverageAreas || []).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pricing.coverageAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-dcc-primary ring-1 ring-dcc-primary/15"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/admin/settings#coverage-area-management"
            className="inline-flex items-center gap-2 rounded-xl border border-dcc-primary/25 bg-dcc-primary/5 px-4 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-dcc-primary/10"
          >
            Manage coverage areas
          </Link>
        </div>
      </section>
    </div>
  )
}