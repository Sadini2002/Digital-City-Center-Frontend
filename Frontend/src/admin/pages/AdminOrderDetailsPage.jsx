import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getOrderById, getOrderProgress, updateOrderStatus } from '../../buyer'
import { formatLkr } from '../../components/category/categoryData'
import { getDeliveryProviders } from '../utils/adminStorage'

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(() => getOrderById(id || ''))
  const [disputeNote, setDisputeNote] = useState(() => order?.dispute?.note || '')

  const [providers] = useState(() => getDeliveryProviders().filter(p => p.status === 'approved'))
  const [selectedProviderId, setSelectedProviderId] = useState('')
  
  // Find if there is an existing job for this order
  const getExistingJob = () => {
    try {
      const jobs = JSON.parse(localStorage.getItem('dcc_delivery_jobs') || '[]')
      return jobs.find(j => j.order?.orderNumber === order?.id || j.order?.id === order?.id)
    } catch {
      return null
    }
  }
  
  const [assignedJob, setAssignedJob] = useState(() => getExistingJob())

  const handleAssignProvider = () => {
    if (!selectedProviderId) {
      toast.error('Please select a delivery provider.')
      return
    }
    const selectedProvider = providers.find(p => p.id === selectedProviderId)
    if (!selectedProvider) return
    
    try {
      const jobs = JSON.parse(localStorage.getItem('dcc_delivery_jobs') || '[]')
      
      // Check if already assigned
      const exists = jobs.find(j => j.order?.orderNumber === order.id || j.order?.id === order.id)
      if (exists) {
        toast.error('This order is already assigned to a delivery provider.')
        return
      }

      const newJob = {
        id: `del-${Date.now()}`,
        trackingCode: `DCC-DLV-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'CONFIRMED',
        pickupAddress: 'Digital City Center Warehouse, Colombo 03',
        deliveryAddress: order.shippingAddress 
          ? `${order.shippingAddress.fullName || 'Customer'}, ${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}`
          : 'Colombo, Sri Lanka',
        feeAmount: 450,
        order: { orderNumber: order.id, id: order.id },
        assignedDriverId: null,
        deliveryProviderId: selectedProvider.id,
        deliveryProviderName: selectedProvider.name,
        createdAt: new Date().toISOString(),
        statusHistory: [
          { 
            id: `h-${Date.now()}`, 
            status: 'CONFIRMED', 
            note: `Delivery assigned to ${selectedProvider.name} by Admin`, 
            createdAt: new Date().toISOString() 
          }
        ],
      }
      
      jobs.push(newJob)
      localStorage.setItem('dcc_delivery_jobs', JSON.stringify(jobs))
      setAssignedJob(newJob)
      
      // Update order status/trackingStatus in order storage
      const next = updateOrderStatus(order.id, order.status, {
        trackingStatus: 'assigned',
        deliveryProviderId: selectedProvider.id,
        deliveryProviderName: selectedProvider.name,
      })
      if (next) setOrder(next)
      
      toast.success(`Order assigned to ${selectedProvider.name} successfully!`)
    } catch (e) {
      toast.error('Failed to assign provider: ' + e.message)
    }
  }

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
        <h2 className="text-lg font-bold text-slate-900">Delivery Assignment</h2>
        <p className="mt-1 text-sm text-slate-600">
          Assign this order to an approved third-party courier or platform delivery provider.
        </p>

        {assignedJob ? (
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-teal-800">Assigned Successfully</span>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200">
                {assignedJob.status}
              </span>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2 pt-2">
              <div>
                <span className="font-semibold text-slate-700">Provider:</span>{' '}
                <span className="text-slate-900">{assignedJob.deliveryProviderName}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Tracking Code:</span>{' '}
                <span className="text-slate-900">{assignedJob.trackingCode}</span>
              </div>
              {assignedJob.assignedDriverId && (
                <div>
                  <span className="font-semibold text-slate-700">Driver ID:</span>{' '}
                  <span className="text-slate-900">{assignedJob.assignedDriverId}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-slate-700">Fee:</span>{' '}
                <span className="text-slate-900">LKR {assignedJob.feeAmount}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {providers.length === 0 ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-800">
                No active/approved delivery providers available. Go to the <strong>Delivery</strong> tab to approve one first.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="flex-1 rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                >
                  <option value="">Select a Delivery Provider...</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssignProvider}
                  className="rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
                >
                  Assign Provider
                </button>
              </div>
            )}
          </div>
        )}
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

