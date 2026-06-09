import { useState } from 'react'
import { Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getDeliveryProviders, updateDeliveryProviderStatus } from '../utils/adminStorage'

function pill(status) {
  if (status === 'approved') return 'bg-dcc-primary/10 text-dcc-primary border border-dcc-primary/20'
  if (status === 'rejected') return 'bg-rose-50 text-rose-600 border border-rose-200'
  return 'bg-amber-50 text-amber-700 border border-amber-200'
}

// Inline rejection reason modal
function RejectModal({ provider, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-dcc-primary/10">
        <h3 className="text-lg font-bold text-slate-900">Reject Delivery Provider</h3>
        <p className="mt-1 text-sm text-slate-600">
          You are rejecting <strong>{provider.name}</strong>. Please provide a reason.
        </p>
        <textarea
          autoFocus
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="mt-4 w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-dcc-primary/25 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryProvidersPage() {
  const [providers, setProviders] = useState(() => getDeliveryProviders())
  const [rejectTarget, setRejectTarget] = useState(null)

  const approve = (id) => {
    updateDeliveryProviderStatus(id, 'approved')
    setProviders(getDeliveryProviders())
    toast.success('Delivery provider approved successfully!')
  }

  const openRejectModal = (provider) => {
    setRejectTarget(provider)
  }

  const confirmReject = (reason) => {
    if (!reason) {
      toast.error('Please provide a rejection reason.')
      return
    }
    updateDeliveryProviderStatus(rejectTarget.id, 'rejected', reason)
    setProviders(getDeliveryProviders())
    setRejectTarget(null)
    toast.success('Delivery provider rejected.')
  }

  return (
    <>
      {rejectTarget && (
        <RejectModal
          provider={rejectTarget}
          onConfirm={confirmReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery provider management</h1>
          <p className="mt-1 text-sm text-slate-600">Approve or reject delivery company registrations.</p>
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
                  <th className="pb-3 font-semibold">Rejection Reason</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.id} className="border-b border-dcc-primary/10">
                    <td className="py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="py-3 text-slate-600">{p.email}</td>
                    <td className="py-3 text-slate-600">{p.submittedAt}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-rose-500 italic max-w-[200px]">
                      {p.status === 'rejected' && p.rejectionReason ? p.rejectionReason : '—'}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => approve(p.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
