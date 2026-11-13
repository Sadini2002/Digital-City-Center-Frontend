
import { useEffect, useState } from 'react'
import { Loader2, Truck, X } from 'lucide-react'
import toast from 'react-hot-toast'
import adminDeliveryApi from '../../../delivery/services/adminDeliveryApi'

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-dcc-primary focus:ring-2 focus:ring-dcc-primary/20'

export default function DeliveryAssignmentModal({
  order,
  onClose,
  onAssigned,
}) {
  const [providers, setProviders] = useState([])
  const [providerId, setProviderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadProviders = async () => {
      try {
        const result = await adminDeliveryApi.listProviders({
          status: 'active',
          limit: 100,
        })

        if (!cancelled) {
          setProviders(result.data || [])
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || 'Could not load providers.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProviders()

    return () => {
      cancelled = true
    }
  }, [])

  const handleAssign = async (event) => {
    event.preventDefault()

    if (!providerId) {
      toast.error('Please select a delivery provider.')
      return
    }

    setSaving(true)

    try {
      const result = await adminDeliveryApi.assignDelivery({
        orderId: order.id,
        providerId: Number(providerId),
      })

      toast.success(
        result.message || 'Delivery assigned successfully.'
      )

      onAssigned()
      onClose()
    } catch (error) {
      toast.error(
        error.message || 'Failed to assign delivery.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2
              id="delivery-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              Assign delivery provider
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manually assign this order to an approved provider.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-5 p-5">
          <div className="rounded-xl bg-violet-50 p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-dcc-primary" />

              <span className="text-sm font-bold text-slate-900">
                Order {order.orderNumber}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Buyer: </span>
                <strong>{order.buyer?.name || '—'}</strong>
              </p>

              <p>
                <span className="text-slate-500">Total: </span>
                <strong>
                  LKR {Number(order.totalAmount || 0).toLocaleString()}
                </strong>
              </p>

              <p>
                <span className="text-slate-500">Delivery address: </span>
                <strong>{order.deliveryAddress}</strong>
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="delivery-provider"
              className="block text-sm font-semibold text-slate-700"
            >
              Select delivery provider
            </label>

            <select
              id="delivery-provider"
              required
              value={providerId}
              onChange={(event) => setProviderId(event.target.value)}
              disabled={loading || saving}
              className={fieldClass}
            >
              <option value="">
                {loading
                  ? 'Loading providers...'
                  : 'Choose an approved provider'}
              </option>

              {providers.map((provider) => (
                <option
                  key={provider.id}
                  value={provider.id}
                >
                  {provider.providerName || provider.name}
                  {' - '}
                  {provider.district || provider.serviceArea}
                </option>
              ))}
            </select>

            {!loading && providers.length === 0 && (
              <p className="mt-2 text-xs text-rose-600">
                No approved delivery providers are available.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loading || !providerId}
              className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {saving ? 'Assigning...' : 'Confirm assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
