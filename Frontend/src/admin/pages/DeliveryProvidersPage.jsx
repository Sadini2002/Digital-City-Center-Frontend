import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { getDeliveryProviders, updateDeliveryProviderStatus } from '../utils/adminStorage'

function pill(status) {
  if (status === 'approved') return 'bg-dcc-primary/10 text-dcc-primary'
  if (status === 'rejected') return 'bg-dcc-accent/10 text-cyan-700'
  return 'bg-dcc-accent/10 text-cyan-700'
}

export default function DeliveryProvidersPage() {
  const [providers, setProviders] = useState(() => getDeliveryProviders())

  const act = (id, status) => {
    updateDeliveryProviderStatus(id, status)
    setProviders(getDeliveryProviders())
  }

  return (
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
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => act(p.id, 'approved')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => act(p.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 bg-dcc-primary/5 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/10"
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
  )
}

