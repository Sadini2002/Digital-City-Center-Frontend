import { useState } from 'react'
import { Gavel, Loader2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../../services/adminApi'
import { formatLkr } from '../../../components/category/categoryData'
import ConfirmActionDialog from '../common/ConfirmActionDialog'
import StatusBadge from './StatusBadge'
import { DISPUTE_RESOLUTIONS, formatDateTime, humanize } from '../../utils/orderStatus'

const ACTIVE = ['open', 'under_review']
const REASON_SUGGESTIONS = [
  'Item not received',
  'Item not as described',
  'Damaged item',
  'Wrong item delivered',
  'Payment issue',
  'Seller not responding',
]

function OpenDisputeForm({ order, onOrderChange }) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (reason.trim().length < 3) {
      setError('Enter a reason (at least 3 characters).')
      return
    }
    setError('')
    setBusy(true)
    try {
      const res = await adminApi.openDispute(order.id, {
        reason: reason.trim(),
        description: description.trim(),
        ...(sellerId ? { sellerId: Number(sellerId) } : {}),
      })
      toast.success(res.data?.message || 'Dispute opened.')
      onOrderChange(res.data?.data)
    } catch (err) {
      toast.error(err.message || 'Could not open the dispute.')
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30'

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-dashed border-slate-300 p-4">
      <h4 className="text-sm font-bold text-slate-900">Open a dispute</h4>
      <p className="mt-0.5 text-xs text-slate-500">
        Record a complaint on behalf of the buyer (for example, received by phone or email).
      </p>

      <div className="mt-3 space-y-3">
        <div>
          <label htmlFor="dispute-reason" className="text-xs font-semibold text-slate-700">
            Reason
          </label>
          <input
            id="dispute-reason"
            list="dispute-reason-options"
            value={reason}
            maxLength={120}
            onChange={(event) => setReason(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(error)}
          />
          <datalist id="dispute-reason-options">
            {REASON_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
          {error && (
            <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
              {error}
            </p>
          )}
        </div>

        {order.sellers.length > 1 && (
          <div>
            <label htmlFor="dispute-seller" className="text-xs font-semibold text-slate-700">
              Seller concerned <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <select
              id="dispute-seller"
              value={sellerId}
              onChange={(event) => setSellerId(event.target.value)}
              className={`${inputClass} bg-white`}
            >
              <option value="">Not specific</option>
              {order.sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shopName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="dispute-description" className="text-xs font-semibold text-slate-700">
            Details <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="dispute-description"
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Open dispute
        </button>
      </div>
    </form>
  )
}

function ResolveForm({ order, dispute, onOrderChange, onCancel }) {
  const [resolution, setResolution] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  const total = order.totals.totalAmount
  const refundable = ['paid', 'partially_refunded'].includes(order.payment.status)
  const isRefundChoice = resolution === 'refund_buyer' || resolution === 'partial_refund'

  const validate = () => {
    const next = {}
    if (!resolution) next.resolution = 'Choose a resolution.'
    if (isRefundChoice && !refundable) {
      next.resolution = 'This order has no captured payment to refund. Pick another resolution.'
    }
    if (resolution === 'refund_buyer' && order.payment.status === 'partially_refunded') {
      next.resolution = 'Already partially refunded. Use a partial refund for the remaining amount.'
    }
    if (resolution === 'partial_refund') {
      const value = Number(amount)
      if (!Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount greater than zero.'
      else if (value >= total) next.amount = 'Must be less than the order total. Use a full refund instead.'
    }
    if (note.trim().length < 3) next.note = 'A resolution note is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async () => {
    setBusy(true)
    try {
      const res = await adminApi.resolveDispute(dispute.id, {
        resolution,
        note: note.trim(),
        ...(resolution === 'partial_refund' ? { refundAmount: Number(amount) } : {}),
      })
      toast.success(res.data?.message || 'Dispute resolved.')
      onOrderChange(res.data?.data)
    } catch (err) {
      toast.error(err.message || 'Could not resolve the dispute.')
      setConfirming(false)
    } finally {
      setBusy(false)
    }
  }

  const chosen = DISPUTE_RESOLUTIONS.find((r) => r.value === resolution)

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h5 className="text-sm font-bold text-slate-900">Resolve dispute</h5>

      <fieldset className="mt-3 space-y-2">
        <legend className="sr-only">Resolution</legend>
        {DISPUTE_RESOLUTIONS.map((option) => {
          const disabled =
            (option.value === 'refund_buyer' || option.value === 'partial_refund') && !refundable
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer gap-3 rounded-lg border bg-white p-3 ${
                resolution === option.value ? 'border-dcc-primary ring-1 ring-dcc-primary' : 'border-slate-200'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                name={`resolution-${dispute.id}`}
                value={option.value}
                checked={resolution === option.value}
                disabled={disabled}
                onChange={() => {
                  setResolution(option.value)
                  setErrors({})
                }}
                className="mt-1 accent-[#5113D7]"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                <span className="block text-xs text-slate-600">
                  {disabled ? 'Unavailable: no captured payment to refund.' : option.help}
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>
      {errors.resolution && (
        <p className="mt-2 text-xs font-semibold text-rose-600" role="alert">
          {errors.resolution}
        </p>
      )}

      {resolution === 'partial_refund' && (
        <div className="mt-3">
          <label htmlFor={`refund-${dispute.id}`} className="text-xs font-semibold text-slate-700">
            Refund amount (LKR) · order total {formatLkr(total)}
          </label>
          <input
            id={`refund-${dispute.id}`}
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
          />
          {errors.amount && (
            <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
              {errors.amount}
            </p>
          )}
        </div>
      )}

      <div className="mt-3">
        <label htmlFor={`note-${dispute.id}`} className="text-xs font-semibold text-slate-700">
          Resolution note
        </label>
        <textarea
          id={`note-${dispute.id}`}
          rows={3}
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Explain the decision. The buyer and seller are notified of the outcome."
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
        />
        {errors.note && (
          <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
            {errors.note}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => validate() && setConfirming(true)}
          className="rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
        >
          Review &amp; resolve
        </button>
      </div>

      {confirming && (
        <ConfirmActionDialog
          title={`Resolve ${dispute.disputeNumber}?`}
          variant={isRefundChoice ? 'danger' : 'primary'}
          confirmLabel="Resolve dispute"
          busy={busy}
          description={
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-slate-900">{chosen?.label}</span>
                {resolution === 'refund_buyer' && ` — ${formatLkr(total)}`}
                {resolution === 'partial_refund' && ` — ${formatLkr(Number(amount))}`}
              </p>
              <p>{chosen?.help}</p>
              <p className="text-amber-700">This closes the dispute and cannot be undone.</p>
            </div>
          }
          onConfirm={submit}
          onCancel={() => !busy && setConfirming(false)}
        />
      )}
    </div>
  )
}

function DisputeCard({ order, dispute, onOrderChange }) {
  const [resolving, setResolving] = useState(false)
  const [busy, setBusy] = useState(false)
  const active = ACTIVE.includes(dispute.status)

  const changeStatus = async (status) => {
    setBusy(true)
    try {
      const res = await adminApi.updateDisputeStatus(dispute.id, status)
      toast.success(status === 'under_review' ? 'Marked as under review.' : 'Dispute reopened.')
      onOrderChange(res.data?.data)
    } catch (err) {
      toast.error(err.message || 'Could not update the dispute.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-slate-900">{dispute.disputeNumber}</p>
          <p className="text-xs text-slate-500">Opened {formatDateTime(dispute.createdAt)}</p>
        </div>
        <StatusBadge kind="dispute" value={dispute.status} />
      </div>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</dt>
          <dd className="text-slate-900">{dispute.reason}</dd>
        </div>
        {dispute.description && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Details</dt>
            <dd className="whitespace-pre-wrap text-slate-700">{dispute.description}</dd>
          </div>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
          {dispute.openedBy && <span>Buyer: {dispute.openedBy.name}</span>}
          {dispute.seller && <span>Seller: {dispute.seller.shopName}</span>}
        </div>
      </dl>

      {!active && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-slate-900">
            {humanize(dispute.resolution)}
            {dispute.refundAmount ? ` — ${formatLkr(dispute.refundAmount)}` : ''}
          </p>
          {dispute.resolutionNote && <p className="mt-1 whitespace-pre-wrap text-slate-700">{dispute.resolutionNote}</p>}
          <p className="mt-1 text-xs text-slate-500">
            {dispute.resolvedBy?.name ? `By ${dispute.resolvedBy.name} · ` : ''}
            {formatDateTime(dispute.resolvedAt)}
          </p>
        </div>
      )}

      {dispute.history.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold text-slate-700">Timeline</summary>
          <ol className="mt-2 space-y-2 border-l border-slate-200 pl-4">
            {[...dispute.history].reverse().map((entry) => (
              <li key={entry.id} className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{humanize(entry.event)}</span> · {entry.by} ·{' '}
                {formatDateTime(entry.createdAt)}
                {entry.note && <span className="block">{entry.note}</span>}
              </li>
            ))}
          </ol>
        </details>
      )}

      {active && !resolving && (
        <div className="mt-4 flex flex-wrap gap-2">
          {dispute.status === 'open' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus('under_review')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Start review
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus('open')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Move back to open
            </button>
          )}
          <button
            type="button"
            onClick={() => setResolving(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-3 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <Gavel className="h-4 w-4" aria-hidden="true" /> Resolve…
          </button>
        </div>
      )}

      {active && resolving && (
        <ResolveForm
          order={order}
          dispute={dispute}
          onOrderChange={onOrderChange}
          onCancel={() => setResolving(false)}
        />
      )}
    </article>
  )
}

/**
 * Dispute resolution interface for a single order.
 */
export default function DisputePanel({ order, onOrderChange }) {
  const hasActive = order.disputes.some((d) => ACTIVE.includes(d.status))

  return (
    <div className="space-y-4">
      {order.disputes.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No disputes have been raised on this order.</p>
      )}

      {order.disputes.map((dispute) => (
        <DisputeCard key={dispute.id} order={order} dispute={dispute} onOrderChange={onOrderChange} />
      ))}

      {!hasActive && <OpenDisputeForm order={order} onOrderChange={onOrderChange} />}
    </div>
  )
}