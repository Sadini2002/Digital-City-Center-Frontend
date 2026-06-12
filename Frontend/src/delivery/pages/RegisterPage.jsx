/** BACKEND: POST /delivery-providers/register — then redirect to application status */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, Truck } from 'lucide-react'
import AuthPageLayout from '../../components/auth/AuthPageLayout'
import AuthFormCard from '../../components/auth/AuthFormCard'
import AuthInput from '../../components/auth/AuthInput'
import { DISTRICTS, PROVINCES } from '../data/constants'
import { saveDeliveryApplication } from '../utils/deliveryApplicationStorage'
import { authApi } from '../../services/api'
import { getDeliveryProviders } from '../../admin/utils/adminStorage'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

function DeliveryRegisterHero() {
  const features = [
    {
      title: 'Reliable Order Flow',
      description: 'Receive continuous delivery dispatch requests from local vendors.',
      icon: Truck,
      cardBg: 'bg-violet-50/90',
      iconWrap: 'bg-violet-100',
      iconColor: 'text-dcc-primary',
    },
    {
      title: 'Full Pricing Control',
      description: 'Define your own coverage zones and custom mileage/flat rates.',
      icon: TrendingUp,
      cardBg: 'bg-emerald-50/90',
      iconWrap: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Flexible Operations',
      description: 'Organize your active driver fleet and log runs with live GPS tracking.',
      icon: MapPin,
      cardBg: 'bg-sky-50/90',
      iconWrap: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
  ]

  return (
    <div className="flex w-full min-w-0 flex-col justify-center py-2 sm:py-4 lg:py-8 lg:pr-6">
      <h1 className="text-2xl font-bold leading-tight text-dcc-primary xs:text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
        Grow Your Delivery Business
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
        Partner with Digital City Center as a corporate delivery provider. Access our platform-wide delivery pool, assign drivers, and expand your reach.
      </p>
      <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`flex gap-4 rounded-xl p-4 sm:p-5 ${feature.cardBg}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 ${feature.iconWrap}`}
            >
              <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{feature.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DeliveryRegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    companyName: '',
    businessRegNo: '',
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
    
    // Phone validation
    const phoneRegex = /^\+?[0-9]{9,15}$/
    if (!phoneRegex.test(form.contactNumber.trim().replace(/[\s-]/g, ''))) {
      setError('Invalid contact number. Please enter a valid phone number (9-15 digits).')
      return
    }

    setIsSubmitting(true)
    try {
      // Duplicate email check
      const providers = getDeliveryProviders()
      const emailExists = providers.some(
        (p) => p.email.toLowerCase() === form.email.trim().toLowerCase()
      )
      if (emailExists) {
        setError('An account with this email already exists.')
        setIsSubmitting(false)
        return
      }

      // API registration request
      await authApi.registerDeliveryProvider({
        companyName: form.companyName,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.contactNumber,
        businessRegNo: form.businessRegNo,
        district: form.district,
        serviceAreas: form.serviceAreas,
      })

      // Local storage synchronization
      saveDeliveryApplication({
        ...form,
        phone: form.contactNumber,
      })

      navigate('/delivery/application-status', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageLayout variant="register">
      {/* Hero illustration / features list */}
      <div className="w-full min-w-0 lg:w-1/2">
        <DeliveryRegisterHero />
      </div>

      {/* Form content */}
      <div className="flex w-full min-w-0 justify-center lg:w-1/2 lg:justify-end">
        <div className="w-full min-w-0 max-w-xl">
          <AuthFormCard
            title="Register as delivery provider"
            subtitle="Join DCC's delivery network. Your company account will be reviewed before activation."
          >
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthInput
                id="companyName"
                label="Company Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
                variant="auth"
              />
              <AuthInput
                id="fullName"
                label="Representative Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                variant="auth"
              />
              <AuthInput
                id="email"
                label="Business Email"
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
                id="contactNumber"
                label="Contact Number"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                required
                variant="auth"
              />
              <AuthInput
                id="businessRegNo"
                label="Business Registration Number (BRN)"
                value={form.businessRegNo}
                onChange={(e) => setForm({ ...form, businessRegNo: e.target.value })}
                required
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
                <p className="mb-2 text-sm font-medium text-slate-700">Service areas (Select Coverage Areas)</p>
                <div className="space-y-4 max-h-72 overflow-y-auto rounded-xl border border-slate-200 p-4">
                  {Object.entries(PROVINCES).map(([province, districts]) => (
                    <div key={province} className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{province}</h4>
                      <div className="flex flex-wrap gap-2 pb-2">
                        {districts.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleArea(area)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                              form.serviceAreas.includes(area)
                                ? 'bg-dcc-primary text-white shadow-sm'
                                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
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
      </div>
    </AuthPageLayout>
  )
}
