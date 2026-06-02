import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { getSellerApplications, updateSellerApplicationStatus } from '../utils/adminStorage'

function StatusPill({ status }) {
  const styles =
    status === 'approved'
      ? 'bg-dcc-primary/10 text-dcc-primary'
      : status === 'rejected'
        ? 'bg-dcc-accent/10 text-cyan-700'
        : 'bg-dcc-accent/10 text-cyan-700'
  const label = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending'
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{label}</span>
}

export default function SellerManagementPage() {
  const [applications, setApplications] = useState(() => getSellerApplications())

  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  const act = (id, status) => {
    updateSellerApplicationStatus(id, status)
    setApplications(getSellerApplications())
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
        <h2 className="text-lg font-bold text-slate-900">Reviewed</h2>
        {reviewed.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No reviewed applications yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-dcc-primary/10">
            {reviewed.slice(0, 12).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{a.shopName}</p>
                  <p className="text-slate-500">{a.email}</p>
                </div>
                <StatusPill status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

