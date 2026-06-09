/** BACKEND: PUT /deliveries/:id/status (+ GPS coords in body) */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNextActions,
  isAwaitingAccept,
  isGpsActiveStatus,
  normalizeDeliveryStatus,
} from '../utils/deliveryStatus'

function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

const btnPrimary =
  'rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover disabled:opacity-60'
const btnOutline =
  'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60'

export default function DeliveryStatusActions({ delivery, onUpdate, onAccept }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [failureReason, setFailureReason] = useState('')
  const [showFailForm, setShowFailForm] = useState(false)

  const rawStatus = delivery?.status
  const status = normalizeDeliveryStatus(rawStatus)
  const actions = getNextActions(rawStatus)
  const deliveryId = delivery?.id

  const handleAccept = async () => {
    setLoading('PROCESSING')
    try {
      await onAccept()
    } finally {
      setLoading(null)
    }
  }

  const handleStatus = async (nextStatus) => {
    if (nextStatus === 'CANCELLED') {
      setShowFailForm(true)
      return
    }
    setLoading(nextStatus)
    try {
      const coords = await getCurrentPosition()
      await onUpdate({ status: nextStatus, ...coords })
      if (deliveryId && isGpsActiveStatus(nextStatus)) {
        navigate(`/delivery/deliveries/${deliveryId}/tracking`, {
          state: {
            startGps: true,
            message:
              nextStatus === 'DISPATCHED'
                ? 'GPS tracking is active. Keep this page open while driving.'
                : undefined,
          },
        })
      }
    } finally {
      setLoading(null)
    }
  }

  const submitFailure = async () => {
    if (!failureReason.trim()) return
    setLoading('CANCELLED')
    try {
      const coords = await getCurrentPosition()
      await onUpdate({
        status: 'CANCELLED',
        reason: failureReason.trim(),
        failureReason: failureReason.trim(),
        ...coords,
      })
      setShowFailForm(false)
      setFailureReason('')
    } finally {
      setLoading(null)
    }
  }

  if (isAwaitingAccept(rawStatus) && onAccept) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-violet-50 px-4 py-3 text-sm leading-relaxed text-violet-900">
          Accept this job to assign it to you. GPS tracking starts after you mark{' '}
          <strong>Picked up</strong>.
        </p>
        <button
          type="button"
          className={btnPrimary}
          disabled={loading === 'PROCESSING'}
          onClick={handleAccept}
        >
          {loading === 'PROCESSING' ? 'Accepting…' : 'Accept delivery'}
        </button>
      </div>
    )
  }

  if (!actions.length) return null

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {status === 'PROCESSING' && (
          <>
            Go to the seller, collect the package, then tap <strong>Mark picked up</strong> — live GPS
            will start automatically.
          </>
        )}
        {status === 'DISPATCHED' && (
          <>Tap <strong>On the way</strong> when you leave for the customer.</>
        )}
        {status === 'OUT_FOR_DELIVERY' && (
          <>Tap <strong>Mark delivered</strong> when the customer receives the package.</>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {actions
          .filter((a) => a.status !== 'CANCELLED')
          .map((action) => (
            <button
              key={action.status}
              type="button"
              className={btnPrimary}
              disabled={loading === action.status}
              onClick={() => handleStatus(action.status)}
            >
              {loading === action.status ? 'Updating…' : action.label}
            </button>
          ))}
        {actions.some((a) => a.status === 'CANCELLED') && !showFailForm && (
          <button type="button" className={btnOutline} onClick={() => setShowFailForm(true)}>
            Mark failed
          </button>
        )}
      </div>
      {showFailForm && (
        <div className="rounded-xl border border-red-100 bg-red-50/80 p-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Failure reason</label>
          <input
            type="text"
            value={failureReason}
            onChange={(e) => setFailureReason(e.target.value)}
            placeholder="Describe why delivery failed"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="mt-3 flex gap-2">
            <button type="button" className={btnOutline} onClick={() => setShowFailForm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className={btnPrimary}
              disabled={loading === 'CANCELLED'}
              onClick={submitFailure}
            >
              {loading === 'CANCELLED' ? 'Saving…' : 'Confirm failure'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
