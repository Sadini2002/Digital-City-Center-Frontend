import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getActionClasses } from '../../utils/Sellerstatus'

const MAX_REASON_LENGTH = 1000

/**
 * Confirmation dialog for a seller status change.
 * Render it only while an action is pending so its state resets each time.
 *
 * Props:
 *  action    - entry from SELLER_ACTIONS
 *  seller    - the seller being changed
 *  busy      - request in flight
 *  onConfirm - (reason: string) => void
 *  onCancel  - () => void
 */
export default function ConfirmDialog({ action, seller, busy, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const firstFieldRef = useRef(null)

  const hasReasonField = Boolean(action.needsReason || action.reasonOptional)
  const reasonMissing = action.needsReason && !reason.trim()

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [busy, onCancel])

  const submit = (event) => {
    event.preventDefault()
    setTouched(true)
    if (reasonMissing || busy) return
    onConfirm(reason.trim())
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-lg font-bold text-slate-900">
          {action.confirmTitle}
        </h2>
        <p id="confirm-description" className="mt-2 text-sm text-slate-600">
          {action.confirmDescription(seller.shopName)}
        </p>

        <form onSubmit={submit} noValidate>
          {hasReasonField && (
            <div className="mt-4">
              <label
                htmlFor="status-reason"
                className="block text-sm font-semibold text-slate-800"
              >
                {action.reasonLabel}
              </label>
              <textarea
                id="status-reason"
                ref={firstFieldRef}
                rows={3}
                maxLength={MAX_REASON_LENGTH}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                aria-invalid={touched && reasonMissing}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-dcc-primary/30 ${
                  touched && reasonMissing
                    ? 'border-rose-400'
                    : 'border-slate-300 focus:border-dcc-primary'
                }`}
              />
              <p className="mt-1 text-xs text-slate-500">{action.reasonHelp}</p>
              {touched && reasonMissing && (
                <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
                  Enter a reason to continue.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              ref={hasReasonField ? null : firstFieldRef}
              disabled={busy}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${getActionClasses(action.variant)}`}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {busy ? 'Working...' : action.confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}