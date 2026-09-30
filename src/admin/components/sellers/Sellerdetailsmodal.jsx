import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw, X } from 'lucide-react'
import { adminApi } from '../../services/adminApi'
import { formatDate, formatLkr, getSellerActions } from '../../utils/sellerStatus'
import SellerActionButton from './Selleractionbutton'
import SellerStatusBadge from './Sellerstatusbadge'

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-slate-900">{children || '-'}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 p-4">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

/**
 * Props:
 *  summary     - seller row from the list (shown while details load)
 *  refreshKey  - change to reload details after a status change
 *  locked      - true while a confirmation dialog is open (disables Escape/backdrop close)
 *  onAction    - (action, seller) => void
 *  onClose     - () => void
 */
export default function SellerDetailsModal({
  summary,
  refreshKey = 0,
  locked = false,
  onAction,
  onClose,
}) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await adminApi.getSellerById(summary.id)
        if (!cancelled) setDetail(response.data?.data ?? null)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load seller details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [summary.id, refreshKey, retry])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !locked) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [locked, onClose])

  const seller = detail ?? summary
  const owner = seller.owner
  const actions = getSellerActions(seller.status)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !locked) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="seller-details-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dcc-primary/10 text-lg font-bold text-dcc-primary"
              aria-hidden="true"
            >
              {String(seller.shopName || '?').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <h2
                id="seller-details-title"
                className="truncate text-lg font-bold text-slate-900"
              >
                {seller.shopName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <SellerStatusBadge status={seller.status} />
                <span className="text-xs text-slate-500">
                  Applied {formatDate(seller.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={locked}
            aria-label="Close seller details"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 overflow-y-auto p-5">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => setRetry((n) => n + 1)}
                  className="mt-1 inline-flex items-center gap-1 font-semibold underline"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  Try again
                </button>
              </div>
            </div>
          )}

          <Section title="Owner">
            <Field label="Name">{owner?.name}</Field>
            <Field label="Email">{owner?.email}</Field>
            <Field label="Phone">{owner?.phone || 'Not provided'}</Field>
            <Field label="Email verified">
              {owner ? (owner.verified ? 'Yes' : 'No') : '-'}
            </Field>
          </Section>

          <Section title="Business">
            <Field label="Business type">{seller.businessType}</Field>
            <Field label="Shop URL">{seller.shopUrl || 'Not generated'}</Field>
            <Field label="Location">{seller.location}</Field>
            <Field label="Address">{seller.address}</Field>
            <Field label="Commission rate">
              {seller.commissionRate != null ? `${seller.commissionRate}%` : '-'}
            </Field>
            <Field label="Member since">{formatDate(seller.memberSince)}</Field>
            {seller.description && (
              <div className="sm:col-span-2">
                <Field label="Description">{seller.description}</Field>
              </div>
            )}
          </Section>

          {loading && !detail ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading bank details and sales...
            </div>
          ) : (
            detail && (
              <>
                <Section title="Performance">
                  <Field label="Listings">{String(detail.stats?.listings ?? 0)}</Field>
                  <Field label="Items sold in orders">
                    {String(detail.stats?.orderItems ?? 0)}
                  </Field>
                  <Field label="Total sales (paid orders)">
                    {formatLkr(detail.stats?.totalSales)}
                  </Field>
                  <Field label="Rating">
                    {`${Number(detail.rating ?? 0).toFixed(1)} (${detail.reviewCount ?? 0} reviews)`}
                  </Field>
                </Section>

                <Section title="Bank details">
                  <Field label="Bank">{detail.bank?.bankName}</Field>
                  <Field label="Branch">{detail.bank?.branch}</Field>
                  <Field label="Account name">{detail.bank?.accountName}</Field>
                  <Field label="Account number">{detail.bank?.accountNumber}</Field>
                </Section>
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={locked}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Close
          </button>
          {actions.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {actions.map((action) => (
                <SellerActionButton
                  key={action.key}
                  action={action}
                  disabled={locked}
                  onClick={() => onAction(action, seller)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Removed sellers cannot be changed.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}