import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { adminDeliveryApi } from '../../delivery/services/adminDeliveryApi'

function pill(status) {
  if (status === 'approved') return 'bg-dcc-primary/10 text-dcc-primary'
  if (status === 'rejected') return 'bg-dcc-accent/10 text-cyan-700'
  return 'bg-dcc-accent/10 text-cyan-700'
}

export default function DeliveryProvidersPage() {
  const [providers, setProviders] = useState([])
  const [rejectingId, setRejectingId] = useState(null)
  const [reasonInput, setReasonInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actingId, setActingId] = useState(null)

  const loadProviders = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminDeliveryApi.listProviders({ limit: 100 })
      setProviders(result?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load providers')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProviders()
  }, [])

  const act = async (id, status) => {
    if (status === 'rejected') {
      setRejectingId(id)
      setReasonInput('')
      return
    }
    setActingId(id)
    try {
      await adminDeliveryApi.approveProvider(id, {})
      await loadProviders()
    } catch (err) {
      alert(err.message || 'Failed to approve provider')
    } finally {
      setActingId(null)
    }
  }

  const handleConfirmRejection = async () => {
    if (!reasonInput.trim()) {
      alert('Rejection reason is required.')
      return
    }
    setActingId(rejectingId)
    try {
      await adminDeliveryApi.rejectProvider(rejectingId, { reason: reasonInput.trim() })
      await loadProviders()
      setRejectingId(null)
      setReasonInput('')
    } catch (err) {
      alert(err.message || 'Failed to reject provider')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Delivery provider management</h1>
        <p className="mt-1 text-sm text-slate-600">Approve or reject delivery company registrations.</p>
        {error && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Loading delivery providers...
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No delivery providers registered yet.
        </div>
      ) : null}

      {!loading && providers.length > 0 && (
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
                  <td className="py-3 font-medium text-slate-900">
                    <div>{p.name}</div>
                    {p.rejectionReason && (
                      <div className="text-xs text-rose-500 italic mt-0.5" id={`rejection-reason-display-${p.id}`}>
                        Reason: {p.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-slate-600">{p.email}</td>
                  <td className="py-3 text-slate-600">{p.submittedAt}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        disabled={actingId === p.id || p.status === 'approved'}
                        onClick={() => act(p.id, 'approved')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" />
                        {actingId === p.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        disabled={actingId === p.id}
                        onClick={() => act(p.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 bg-dcc-primary/5 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/10 disabled:opacity-60"
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
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Rejection Reason Required</h3>
            <p className="mt-1 text-sm text-slate-500">
              Please provide a reason for rejecting this delivery provider registration.
            </p>
            <div className="mt-4">
              <label htmlFor="rejection-reason" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Rejection Reason
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                required
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null)
                  setReasonInput('')
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

