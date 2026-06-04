/** BACKEND: PATCH /delivery/drivers/:id — availability flag */
import { useState } from 'react'
import { Bike, Mail, Phone, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import deliveryApi from '../services/deliveryApi'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryAlert from '../components/ui/DeliveryAlert'
import { readDeliveryUser } from '../utils/readDeliveryUser'

export default function DeliveryDriverProfilePage() {
  const user = readDeliveryUser()
  const driver = user?.deliveryDriver
  const [isAvailable, setIsAvailable] = useState(driver?.isAvailable ?? false)
  const [saving, setSaving] = useState(false)

  const handleAvailability = async () => {
    if (!driver?.id) return
    setSaving(true)
    try {
      await deliveryApi.updateDriver(driver.id, { isAvailable: !isAvailable })
      setIsAvailable((v) => !v)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <DeliveryAlert variant="info">
        When you are <strong>available</strong>, you can accept new jobs from the pool. Mark yourself
        busy while on an active run.
      </DeliveryAlert>

      <DeliveryPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 text-dcc-primary">
              <User className="h-8 w-8" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{driver?.fullName || user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isAvailable ? 'Available for jobs' : 'Busy — not accepting new jobs'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAvailability}
            disabled={saving}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-60 ${
              isAvailable
                ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                : 'bg-dcc-primary text-white hover:bg-dcc-primary-hover'
            }`}
          >
            {saving ? 'Saving…' : isAvailable ? 'Mark as busy' : 'Go available'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-500">Phone</p>
              <p className="font-medium text-slate-900">{driver?.phone || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <Mail className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <Bike className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-500">Vehicle</p>
              <p className="font-medium text-slate-900">
                {[driver?.vehicleType, driver?.vehiclePlate].filter(Boolean).join(' · ') || '—'}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Completed deliveries</p>
            <p className="text-2xl font-bold text-dcc-primary">{driver?.totalDeliveries ?? 0}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Find new work under{' '}
          <Link to="/delivery/deliveries" className="font-semibold text-dcc-primary hover:underline">
            Deliveries → Available pool
          </Link>
          .
        </p>
      </DeliveryPanel>
    </div>
  )
}
