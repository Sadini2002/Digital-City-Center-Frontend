import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANT_CLASSES = {
  primary: 'bg-dcc-primary text-white hover:bg-dcc-primary-hover focus-visible:outline-dcc-primary',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
}

/**
 * Generic confirmation dialog with an optional required/optional reason box.
 * Render it only while an action is pending so its state resets each time.
 *
 * Props:
 *  title, description (node), confirmLabel, variant ('primary' | 'danger')
 *  reasonLabel     - when set, a textarea is shown
 *  reasonRequired  - blocks confirm until text is entered
 *  busy, onConfirm(reason), onCancel()
 */
export default function ConfirmActionDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'primary',
  reasonLabel,
  reasonRequired = false,
  reasonHelp,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const firstFieldRef = useRef(null)

  const showReason = Boolean(reasonLabel)
  const reasonMissing = reasonRequired && !reason.trim()

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
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-action-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        {description && <div className="mt-2 text-sm text-slate-600">{description}</div>}

        <form onSubmit={submit} noValidate>
          {showReason && (
            <div className="mt-4">
              <label htmlFor="confirm-action-reason" className="block text-sm font-semibold text-slate-800">
                {reasonLabel}
                {!reasonRequired && <span className="font-normal text-slate-500"> (optional)</span>}
              </label>
              <textarea
                id="confirm-action-reason"
                ref={firstFieldRef}
                rows={3}
                maxLength={1000}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                aria-invalid={touched && reasonMissing}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-dcc-primary/30 ${
                  touched && reasonMissing ? 'border-rose-400' : 'border-slate-300 focus:border-dcc-primary'
                }`}
              />
              {reasonHelp && <p className="mt-1 text-xs text-slate-500">{reasonHelp}</p>}
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
              ref={showReason ? null : firstFieldRef}
              disabled={busy}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary
              }`}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {busy ? 'Working...' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}