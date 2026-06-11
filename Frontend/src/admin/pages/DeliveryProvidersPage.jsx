import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Settings, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getDeliveryProviders, updateDeliveryProviderStatus } from '../utils/adminStorage'
import { adminDeliveryApi } from '../../delivery/services/adminDeliveryApi'
import { tryApi } from '../../delivery/utils/deliveryApiHelpers'

function pill(status) {
  if (status === 'approved') return 'bg-dcc-primary/10 text-dcc-primary'
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
  return 'bg-dcc-accent/10 text-cyan-700'
}

function statusLabel(status) {
  if (status === 'approved') return 'Approved'
  if (status === 'rejected') return 'Rejected'
  return 'Pending'
}

function RejectModal({ provider, reason, onReasonChange, onCancel, onConfirm, submitting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-provider-title"
      >
        <h2 id="reject-provider-title" className="text-lg font-bold text-slate-900">
          Reject application
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Please provide a reason for rejecting <strong>{provider.name}</strong>.
        </p>
        <label htmlFor="rejection-reason" className="mt-4 block text-sm font-medium text-slate-700">
          Rejection reason <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="rejection-reason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
          placeholder="e.g. Incomplete business registration documents"
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !reason.trim()}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit rejection'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryProvidersPage() {
  const [providers, setProviders] = useState(() => getDeliveryProviders())
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const refreshProviders = () => setProviders(getDeliveryProviders())

  const approveProvider = async (id) => {
    setSubmitting(true)
    try {
      await tryApi(() => adminDeliveryApi.approveProvider(id, {}), () => null)
      updateDeliveryProviderStatus(id, 'approved')
      refreshProviders()
      toast.success('Delivery provider approved.')
    } catch {
      toast.error('Failed to approve provider.')
    } finally {
      setSubmitting(false)
    }
  }

  const openRejectModal = (provider) => {
    setRejectTarget(provider)
    setRejectReason('')
  }

  const closeRejectModal = () => {
    if (submitting) return
    setRejectTarget(null)
    setRejectReason('')
  }

  const submitRejection = async () => {
    const reason = rejectReason.trim()
    if (!rejectTarget || !reason) {
      toast.error('Rejection reason is required.')
      return
    }

    setSubmitting(true)
    try {
      await tryApi(
        () => adminDeliveryApi.rejectProvider(rejectTarget.id, { rejectionReason: reason }),
        () => null,
      )
      updateDeliveryProviderStatus(rejectTarget.id, 'rejected', reason)
      refreshProviders()
      toast.success(`${rejectTarget.name} rejected.`)
      setRejectTarget(null)
      setRejectReason('')
    } catch {
      toast.error('Failed to reject provider.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery provider management</h1>
          <p className="mt-1 text-sm text-slate-600">Approve or reject delivery company registrations.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-dcc-primary/25 bg-dcc-primary/5 px-4 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-dcc-primary/10"
          >
            <Settings className="h-4 w-4" />
            Delivery pricing
          </Link>
          <Link
            to="/admin/settings#coverage-area-management"
            className="inline-flex items-center gap-2 rounded-xl border border-dcc-primary/25 bg-dcc-primary/5 px-4 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-dcc-primary/10"
          >
            Coverage areas
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-dcc-primary/15 text-slate-500">
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Submitted</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-dcc-primary/10">
                  <td className="py-3">
                    <p className="font-medium text-slate-900">{p.name}</p>
                    {p.rejectionReason && (
                      <p className="mt-1 text-xs italic text-rose-500">Reason: {p.rejectionReason}</p>
                    )}
                  </td>
                  <td className="py-3 text-slate-600">{p.email}</td>
                  <td className="py-3 text-slate-600">{p.submittedAt}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill(p.status)}`}>
                      {statusLabel(p.status)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {p.status === 'pending' ? (
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => approveProvider(p.id)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(p)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 bg-dcc-primary/5 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/10 disabled:opacity-60"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {rejectTarget && (
        <RejectModal
          provider={rejectTarget}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          onCancel={closeRejectModal}
          onConfirm={submitRejection}
          submitting={submitting}
        />
      )}
    </div>
  )
}
