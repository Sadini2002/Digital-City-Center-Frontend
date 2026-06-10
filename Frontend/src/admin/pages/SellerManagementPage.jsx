import { useState } from 'react'
import { Check, X, Ban, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSellerApplications, updateSellerApplicationStatus } from '../utils/adminStorage'

function StatusPill({ status }) {
  let styles = 'bg-slate-100 text-slate-600'
  let label = 'Pending'

  if (status === 'approved') {
    styles = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    label = 'Approved'
  } else if (status === 'rejected') {
    styles = 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    label = 'Rejected'
  } else if (status === 'suspended') {
    styles = 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    label = 'Suspended'
  }

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{label}</span>
}

export default function SellerManagementPage() {
  const [applications, setApplications] = useState(() => getSellerApplications())

  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  const act = (id, status) => {
    let reason = ''
    if (status === 'rejected') {
      const inputReason = window.prompt('Please enter the reason for rejection:')
      if (inputReason === null) return // User cancelled the prompt
      if (!inputReason.trim()) {
        toast.error('Rejection reason is required.')
        return
      }
      reason = inputReason.trim()
    }
    
    updateSellerApplicationStatus(id, status, reason)
    setApplications(getSellerApplications())
    toast.success(`Seller application ${status} successfully.`)
  }

  const toggleSuspend = (id, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'approved' : 'suspended'
    updateSellerApplicationStatus(id, nextStatus)
    setApplications(getSellerApplications())
    toast.success(`Seller account ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Seller management</h1>
        <p className="mt-1 text-sm text-slate-600">
          View pending seller applications, approve/reject them (demo storage).
        </p>
      </div>
      <div className="rounded-xl border border-dcc-primary/20 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-dcc-primary/10">
        Review KYC/business details before approving seller access or toggling account suspension.
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
                    onClick={() => act(a.id, 'approved')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => act(a.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 bg-dcc-primary/5 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/10"
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
        <h2 className="text-lg font-bold text-slate-900">Reviewed & Registered Sellers</h2>
        {reviewed.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No reviewed applications yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-dcc-primary/10">
            {reviewed.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{a.shopName}</p>
                  <p className="text-slate-500 text-xs">{a.email}</p>
                  {a.rejectionReason && (
                    <p className="mt-1 text-xs text-rose-500 italic">Reason: {a.rejectionReason}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={a.status} />
                  {(a.status === 'approved' || a.status === 'suspended') && (
                    <button
                      type="button"
                      onClick={() => toggleSuspend(a.id, a.status)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        a.status === 'suspended'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {a.status === 'suspended' ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Reactivate
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5" />
                          Suspend
                        </>
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
