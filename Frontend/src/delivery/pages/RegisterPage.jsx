/** BACKEND: POST /delivery-providers/register — then redirect to application status */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteLayout from '../../layouts/SiteLayout'
import AuthFormCard from '../../components/auth/AuthFormCard'
import AuthInput from '../../components/auth/AuthInput'
import { DISTRICTS } from '../data/constants'
import deliveryApi from '../services/deliveryApi'
import { saveDeliveryApplication } from '../utils/deliveryApplicationStorage'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

export default function DeliveryRegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    vehicleType: 'Motorcycle',
    licenseNo: '',
    district: 'Colombo',
    serviceAreas: ['Colombo'],
  })

  const toggleArea = (area) => {
    setForm((prev) => {
      const areas = prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter((a) => a !== area)
        : [...prev.serviceAreas, area]
      return { ...prev, serviceAreas: areas.length ? areas : [area] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      try {
        const result = await deliveryApi.registerProvider(form)
        const { token, user } = result?.data ?? result ?? {}
        if (token) localStorage.setItem('token', token)
        if (user) localStorage.setItem('user', JSON.stringify(user))
      } catch {
        saveDeliveryApplication(form)
      }
      navigate('/delivery/application-status', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-10">
        <AuthFormCard
          title="Register as delivery provider"
          subtitle="Join DCC's delivery network. Your account will be reviewed before activation."
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              variant="auth"
            />
            <AuthInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              variant="auth"
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              variant="auth"
            />
            <AuthInput
              id="phone"
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              variant="auth"
            />
            <AuthInput
              id="companyName"
              label="Company name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
              variant="auth"
            />
            <AuthInput
              id="vehicleType"
              label="Vehicle type"
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              variant="auth"
            />
            <AuthInput
              id="licenseNo"
              label="License number"
              value={form.licenseNo}
              onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
              variant="auth"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">District</label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className={inputClass}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Service areas</p>
              <div className="flex flex-wrap gap-2">
                {DISTRICTS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      form.serviceAreas.includes(area)
                        ? 'bg-dcc-primary text-white'
                        : 'border border-slate-200 text-slate-600'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-dcc-primary py-3.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login?portal=delivery" className="font-bold text-dcc-primary hover:underline">
              Sign in
            </Link>
          </p>
        </AuthFormCard>
      </div>
    </SiteLayout>
  )
}
