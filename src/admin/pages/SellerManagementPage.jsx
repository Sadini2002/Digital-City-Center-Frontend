import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { adminApi } from '../services/adminApi'
import {
  STATUS_KEYS,
  STATUS_TABS,
  formatDate,
  getSellerActions,
} from '../utils/sellerStatus'
import ConfirmDialog from '../components/sellers/ConfirmDialog'
import SellerActionButton from '../components/sellers/SellerActionButton'
import SellerDetailsModal from '../components/sellers/SellerDetailsModal'
import SellerStatusBadge from '../components/sellers/SellerStatusBadge'

const PAGE_SIZE = 10

const EMPTY_COPY = {
  pending: {
    title: 'No pending applications',
    body: 'New seller registrations will appear here for review.',
  },
  approved: {
    title: 'No approved sellers yet',
    body: 'Approve a pending application to see it here.',
  },
  suspended: {
    title: 'No suspended sellers',
    body: 'Sellers you suspend will be listed here so you can reinstate them.',
  },
  rejected: {
    title: 'No rejected applications',
    body: 'Rejected applications will be listed here.',
  },
  removed: {
    title: 'No removed sellers',
    body: 'Sellers you remove will be listed here.',
  },
  all: {
    title: 'No sellers yet',
    body: 'Sellers will appear here once they register.',
  },
}

function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default function SellerManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedStatus = searchParams.get('status')
  const status = STATUS_KEYS.includes(requestedStatus) ? requestedStatus : 'pending'

  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput.trim())
  const [page, setPage] = useState(1)

  const [sellers, setSellers] = useState([])
  const [counts, setCounts] = useState({})
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [selected, setSelected] = useState(null) // seller shown in the details modal
  const [modalRefreshKey, setModalRefreshKey] = useState(0)
  const [pendingAction, setPendingAction] = useState(null) // { action, seller }
  const [busy, setBusy] = useState(false)

  const reload = useCallback(() => setReloadKey((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')

        const response = await adminApi.getSellers({
          status,
          search: search || undefined,
          page,
          limit: PAGE_SIZE,
        })

        if (cancelled) return

        const body = response.data ?? {}
        setSellers(body.data ?? [])
        setCounts(body.counts ?? {})
        setMeta(body.meta ?? { page: 1, totalPages: 1, total: 0 })
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load sellers.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [status, search, page, reloadKey])

  // If the last row on a page was just moved/removed, step back a page.
  useEffect(() => {
    if (!loading && !error && sellers.length === 0 && page > 1) {
      setPage((p) => Math.max(1, p - 1))
    }
  }, [loading, error, sellers.length, page])

  const changeStatus = (nextStatus) => {
    setPage(1)
    setSearchParams(nextStatus === 'pending' ? {} : { status: nextStatus })
  }

  const onSearchChange = (value) => {
    setSearchInput(value)
    setPage(1)
  }

  const confirmAction = async (reason) => {
    if (!pendingAction) return
    const { action, seller } = pendingAction

    try {
      setBusy(true)
      const response = await adminApi.updateSellerStatus(seller.id, action.status, reason)
      const body = response.data ?? {}

      if (body.emailSent === false) {
        toast.success(`${body.message} The email could not be sent.`, { duration: 6000 })
      } else {
        toast.success(body.message || 'Seller updated.')
      }

      setPendingAction(null)
      setModalRefreshKey((n) => n + 1)
      reload()
    } catch (err) {
      toast.error(err.message || 'Failed to update seller.')
    } finally {
      setBusy(false)
    }
  }

  const startAction = (action, seller) => setPendingAction({ action, seller })

  const emptyCopy = EMPTY_COPY[status] ?? EMPTY_COPY.all
  const hasSearch = Boolean(search)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review applications and manage seller accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Refresh
        </button>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white shadow-sm shadow-dcc-primary/10">
        {/* Status tabs */}
        <div
          role="tablist"
          aria-label="Filter sellers by status"
          className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-3"
        >
          {STATUS_TABS.map((tab) => {
            const active = tab.key === status
            const count = counts[tab.key]

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeStatus(tab.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-dcc-primary text-dcc-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {typeof count === 'number' && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      tab.key === 'pending' && count > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 p-4">
          <label htmlFor="seller-search" className="sr-only">
            Search sellers
          </label>
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="seller-search"
              type="search"
              value={searchInput}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by shop, owner, email or phone"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-9 text-sm text-slate-900 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="m-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold">Could not load sellers</p>
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

        {/* Loading */}
        {loading && sellers.length === 0 && !error && (
          <div className="space-y-3 p-4" aria-busy="true" aria-live="polite">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
            ))}
            <span className="sr-only">Loading sellers</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && sellers.length === 0 && (
          <div className="px-4 py-14 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
            {hasSearch ? (
              <>
                <p className="mt-3 font-semibold text-slate-800">
                  No sellers match "{search}"
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Check the spelling or try a different tab.
                </p>
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="mt-3 font-semibold text-slate-800">{emptyCopy.title}</p>
                <p className="mt-1 text-sm text-slate-500">{emptyCopy.body}</p>
              </>
            )}
          </div>
        )}

        {/* Table */}
        {sellers.length > 0 && !error && (
          <div
            className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : ''}`}
          >
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Shop</th>
                  <th scope="col" className="hidden px-4 py-3 sm:table-cell">Owner</th>
                  <th scope="col" className="hidden px-4 py-3 lg:table-cell">Business</th>
                  <th scope="col" className="hidden px-4 py-3 md:table-cell">Applied</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellers.map((seller) => {
                  const actions = getSellerActions(seller.status)

                  return (
                    <tr key={seller.id} className="align-middle hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(seller)}
                          className="text-left font-semibold text-slate-900 hover:text-dcc-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-dcc-primary"
                        >
                          {seller.shopName}
                        </button>
                        <p className="text-xs text-slate-500">
                          {seller.shopUrl || 'No shop URL'}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <p className="text-slate-900">{seller.owner?.name}</p>
                        <p className="text-xs text-slate-500">{seller.owner?.email}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                        {seller.businessType}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {formatDate(seller.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <SellerStatusBadge status={seller.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(seller)}
                            aria-label={`View details for ${seller.shopName}`}
                            title="View details"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </button>
                          {actions.map((action) => (
                            <SellerActionButton
                              key={action.key}
                              action={action}
                              compact
                              iconOnly={action.key === 'remove'}
                              onClick={() => startAction(action, seller)}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!error && meta.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 sm:flex-row">
            <p>
              Showing {(meta.page - 1) * PAGE_SIZE + 1}-
              {Math.min(meta.page * PAGE_SIZE, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <span aria-live="polite">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </section>

      {selected && (
        <SellerDetailsModal
          summary={selected}
          refreshKey={modalRefreshKey}
          locked={Boolean(pendingAction)}
          onAction={startAction}
          onClose={() => setSelected(null)}
        />
      )}

      {pendingAction && (
        <ConfirmDialog
          action={pendingAction.action}
          seller={pendingAction.seller}
          busy={busy}
          onConfirm={confirmAction}
          onCancel={() => !busy && setPendingAction(null)}
        />
      )}
    </div>
  )
}