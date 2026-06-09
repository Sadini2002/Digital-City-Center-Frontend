import { useState } from 'react'
import { Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSellerApplications, updateSellerApplicationStatus } from '../utils/adminStorage'

function StatusPill({ status }) {
  const styles =
    status === 'approved'
      ? 'bg-dcc-primary/10 text-dcc-primary border border-dcc-primary/20'
      : status === 'rejected'
        ? 'bg-rose-50 text-rose-600 border border-rose-200'
        : 'bg-amber-50 text-amber-700 border border-amber-200'
  const label = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending'
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{label}</span>
}

// Inline rejection reason modal
function RejectModal({ seller, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-dcc-primary/10">
        <h3 className="text-lg font-bold text-slate-900">Reject Application</h3>
        <p className="mt-1 text-sm text-slate-600">
          You are rejecting <strong>{seller.shopName}</strong>. Please provide a reason.
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
            onClick={() => onConfirm(reason.trim())}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SellerManagementPage() {
  const [applications, setApplications] = useState(() => getSellerApplications())
  const [rejectTarget, setRejectTarget] = useState(null)

  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  const approve = (id) => {
    updateSellerApplicationStatus(id, 'approved')
    setApplications(getSellerApplications())
    toast.success('Seller application approved successfully!')
  }

  const openRejectModal = (seller) => {
    setRejectTarget(seller)
  }

  const confirmReject = (reason) => {
    if (!reason) {
      toast.error('Please provide a rejection reason.')
      return
    }
    updateSellerApplicationStatus(rejectTarget.id, 'rejected', reason)
    setApplications(getSellerApplications())
    setRejectTarget(null)
    toast.success('Seller application rejected.')
  }

  return (
    <>
      {rejectTarget && (
        <RejectModal
          seller={rejectTarget}
          onConfirm={confirmReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller management</h1>
          <p className="mt-1 text-sm text-slate-600">
            View pending seller applications, approve/reject them (demo storage).
          </p>
        </div>
        <div className="rounded-xl border border-dcc-primary/20 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-dcc-primary/10">
          Review KYC/business details before approving seller access.
        </div>

        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Pending applications</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No pending applications.</p>
          ) : (
            <ul className="mt-4 divide-y divide-dcc-primary/10">
              {pending.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{a.shopName}</p>
                    <p className="text-sm text-slate-500">
                      {a.ownerName} · {a.email}
                    </p>
                    <p className="text-xs text-slate-400">
                      {a.category} · BR: {a.brNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => approve(a.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => openRejectModal(a)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Reviewed</h2>
          {reviewed.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No reviewed applications yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-dcc-primary/10">
              {reviewed.slice(0, 12).map((a) => (
                <li key={a.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{a.shopName}</p>
                    <p className="text-slate-500">{a.email}</p>
                    {a.status === 'rejected' && a.rejectionReason && (
                      <p className="mt-0.5 text-xs text-rose-500 italic">
                        Reason: {a.rejectionReason}
                      </p>
                    )}
                  </div>
                  <StatusPill status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
