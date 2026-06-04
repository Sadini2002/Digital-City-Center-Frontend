/** BACKEND: GET/POST/PATCH /delivery/drivers — DELIVERY_PROVIDER only */
import { useEffect, useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import {
  createDriver,
  getDrivers,
  updateDriver,
} from '../utils/deliveryStorage'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryEmptyState from '../components/ui/DeliveryEmptyState'
import DeliveryAlert from '../components/ui/DeliveryAlert'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'
import { ROLES } from '../data/constants'
import { readDeliveryUser } from '../utils/readDeliveryUser'

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  licenseNo: '',
  vehiclePlate: '',
  vehicleType: '',
}

const FIELD_LABELS = {
  fullName: 'Full name',
  phone: 'Phone number',
  email: 'Email address',
  password: 'Temporary password',
  licenseNo: 'License number',
  vehiclePlate: 'Vehicle plate',
  vehicleType: 'Vehicle type',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

export default function DeliveryDriversPage() {
  const user = readDeliveryUser()
  const isProvider = user?.role === ROLES.DELIVERY_PROVIDER
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setDrivers(getDrivers())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      createDriver(form)
      setForm(emptyForm)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleAvailability = async (driver) => {
    updateDriver(driver.id, { isAvailable: !driver.isAvailable })
    load()
  }

  return (
    <div className="space-y-5">
      {isProvider && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-dcc-primary-hover"
          >
            <UserPlus className="h-4 w-4" />
            {showForm ? 'Close form' : 'Add driver'}
          </button>
        </div>
      )}

      {showForm && (
        <DeliveryPanel title="New driver account" subtitle="Riders log in with the email and password you set">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {Object.keys(FIELD_LABELS).map((field) => (
              <div key={field} className={field === 'vehicleType' ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {FIELD_LABELS[field]}
                </label>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className={inputClass}
                  required={['fullName', 'phone', 'email', 'password'].includes(field)}
                  autoComplete={field === 'password' ? 'new-password' : undefined}
                />
              </div>
            ))}
            {error && (
              <div className="sm:col-span-2">
                <DeliveryAlert variant="error">{error}</DeliveryAlert>
              </div>
            )}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Creating…' : 'Create driver'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </DeliveryPanel>
      )}

      {loading ? (
        <DeliveryBlockSkeleton className="h-64" />
      ) : !drivers.length ? (
        <DeliveryPanel>
          <DeliveryEmptyState
            icon={Users}
            title="No drivers in your fleet yet"
            description="Add rider accounts so they can log in, accept pool jobs, and update delivery status."
            action={
              isProvider && (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
                >
                  Add your first driver
                </button>
              )
            }
          />
        </DeliveryPanel>
      ) : (
        <DeliveryPanel title="Fleet roster" subtitle={`${drivers.length} driver${drivers.length === 1 ? '' : 's'}`}>
          <div className="overflow-x-auto -mx-4 sm:-mx-5">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 sm:px-5">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-right sm:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drivers.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{r.fullName}</td>
                    <td className="px-4 py-3.5 text-slate-600">{r.phone}</td>
                    <td className="px-4 py-3.5 text-slate-600">{r.vehicleType || '—'}</td>
                    <td className="px-4 py-3.5 tabular-nums">{r.totalDeliveries ?? 0}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          r.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(r)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {r.isAvailable ? 'Mark busy' : 'Mark available'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DeliveryPanel>
      )}
    </div>
  )
}
