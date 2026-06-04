import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById, getOrderProgress, updateOrderStatus } from '../../buyer'
import { formatLkr } from '../../components/category/categoryData'

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(() => getOrderById(id || ''))
  const [disputeNote, setDisputeNote] = useState(() => order?.dispute?.note || '')

  if (!order) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">Order details</h1>
        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <p className="text-sm text-slate-600">Order not found.</p>
          <Link to="/admin/orders" className="mt-4 inline-flex text-sm font-semibold text-dcc-primary hover:underline">
            Back to order management
          </Link>
        </section>
      </div>
    )
  }

  const progress = getOrderProgress(order)

  const updateDispute = (status) => {
    const next = updateOrderStatus(order.id, order.status, {
      dispute: {
        status,
        note: disputeNote.trim(),
        updatedAt: new Date().toISOString(),
      },
    })
    if (next) setOrder(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order {order.id}</h1>
          <p className="mt-1 text-sm text-slate-600">Admin order tracking and quick summary.</p>
        </div>
        <Link to="/admin/orders" className="text-sm font-semibold text-dcc-primary hover:underline">
          Back to orders
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{order.status}</p>
        </div>
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-xs uppercase tracking-wide text-slate-500">Tracking</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{order.trackingStatus || '-'}</p>
        </div>
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-xs uppercase tracking-wide text-slate-500">Items</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{order.items?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-dcc-primary/20 bg-white p-5 shadow-sm shadow-dcc-primary/10">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{formatLkr(order.total || 0)}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Tracking timeline</h2>
        <ol className="mt-4 space-y-3">
          {progress.map((step) => (
            <li key={step.key} className="flex items-start gap-3">
              <span
                className={`mt-0.5 h-3 w-3 rounded-full ${step.complete ? 'bg-dcc-primary' : 'bg-slate-300'}`}
              />
              <div>
                <p className={`text-sm font-semibold ${step.current ? 'text-dcc-primary' : 'text-slate-900'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Dispute handling</h2>
        <p className="mt-1 text-sm text-slate-600">
          Step in to resolve issues between buyer and seller for this order.
        </p>
        <div className="mt-4 space-y-3">
          <div className="text-sm">
            <span className="font-semibold text-slate-700">Current dispute status: </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                order.dispute?.status === 'open'
                  ? 'bg-amber-50 text-amber-700'
                  : order.dispute?.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {order.dispute?.status ?? 'none'}
            </span>
          </div>
          <textarea
            value={disputeNote}
            onChange={(e) => setDisputeNote(e.target.value)}
            rows={4}
            placeholder="Add admin note about dispute investigation or resolution..."
            className="w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateDispute('open')}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            >
              Mark as open
            </button>
            <button
              type="button"
              onClick={() => updateDispute('resolved')}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Mark as resolved
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

