import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import SiteLayout from '../../layouts/SiteLayout'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import AuthInput from '../../components/auth/AuthInput'
import SellerRegistrationProgress from '../components/SellerRegistrationProgress'
import {
  SELLER_BUSINESS_TYPES,
  SELLER_CATEGORIES,
  SELLER_REGISTER_STEPS,
} from '../data/sellerConstants'
import { saveSellerApplication } from '../utils/sellerApplicationStorage'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Seller Registration', to: null },
]

const emptyForm = {
  shopName: '',
  businessType: SELLER_BUSINESS_TYPES[0],
  category: SELLER_CATEGORIES[0],
  brNumber: '',
  ownerName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  agreed: false,
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500'

export default function SellerRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.shopName.trim() || !form.brNumber.trim()) {
        return 'Enter your business name and NIC / BR number.'
      }
    }
    if (step === 1) {
      if (!form.ownerName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
        return 'Complete all contact fields.'
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return 'Enter a valid email address.'
      }
    }
    if (step === 2 && !form.agreed) {
      return 'Please accept the terms to submit your application.'
    }
    return ''
  }

  const next = async () => {
    const msg = validateStep()
    if (msg) {
      setError(msg)
      return
    }
    setError('')

    if (step < SELLER_REGISTER_STEPS.length - 1) {
      setStep((s) => s + 1)
      return
    }

    setSubmitting(true)
    try {
      const application = saveSellerApplication({
        shopName: form.shopName.trim(),
        businessType: form.businessType,
        category: form.category,
        brNumber: form.brNumber.trim(),
        ownerName: form.ownerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
      })
      navigate('/register/seller/success', {
        replace: true,
        state: { applicationId: application.id },
      })
    } catch {
      setError('Could not submit your application. Please try again.')
      setSubmitting(false)
    }
  }

  const back = () => {
    setError('')
    setStep((s) => Math.max(0, s - 1))
  }

  const continueLabel =
    step === 0
      ? 'Continue to Contact'
      : step === 1
        ? 'Continue to Approval'
        : 'Submit application'

  return (
    <SiteLayout>
      <section className="bg-dcc-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="text-violet-200 [&_a]:text-violet-100 [&_a:hover]:text-white [&_span]:text-violet-200">
            <ProductBreadcrumbs items={breadcrumbs} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem]">
            Start Selling Globally
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100 sm:text-base">
            Join thousands of successful entrepreneurs on Digital City Center. Professional tools,
            global reach, and dedicated support to help your business grow.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          <SellerRegistrationProgress currentStep={step} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Business Foundation</h2>
                <p className="mt-1 text-sm text-slate-500">Tell us about the identity of your venture.</p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="business-name" className={labelClass}>
                      Business name
                    </label>
                    <input
                      id="business-name"
                      type="text"
                      value={form.shopName}
                      onChange={update('shopName')}
                      placeholder="Enter Registered Name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="business-type" className={labelClass}>
                        Business type
                      </label>
                      <select
                        id="business-type"
                        value={form.businessType}
                        onChange={update('businessType')}
                        className={inputClass}
                      >
                        {SELLER_BUSINESS_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="main-category" className={labelClass}>
                        Main category
                      </label>
                      <select
                        id="main-category"
                        value={form.category}
                        onChange={update('category')}
                        className={inputClass}
                      >
                        {SELLER_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="br-number" className={labelClass}>
                      NIC / Business Registration Number (BR)
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="br-number"
                        type="text"
                        value={form.brNumber}
                        onChange={update('brNumber')}
                        placeholder="e.g. 19XXXXXXXXX or PVXXXXXX"
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Format must match official government records for fast verification.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                <p className="mt-1 text-sm text-slate-500">How we reach you about your application and orders.</p>

                <div className="mt-8 space-y-4">
                  <AuthInput id="owner-name" label="Owner / contact name" value={form.ownerName} onChange={update('ownerName')} required />
                  <AuthInput id="seller-email" label="Email address" type="email" value={form.email} onChange={update('email')} placeholder="name@example.com" required />
                  <AuthInput id="seller-phone" label="Phone number" type="tel" value={form.phone} onChange={update('phone')} placeholder="+94 77 000 0000" required />
                  <AuthInput id="street-address" label="Street address" value={form.address} onChange={update('address')} required />
                  <AuthInput id="city" label="City" value={form.city} onChange={update('city')} required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Approval Process</h2>
                <p className="mt-1 text-sm text-slate-500">Review your details and submit for verification.</p>

                <dl className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Business</dt>
                    <dd className="font-medium text-slate-900">{form.shopName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-900">{form.businessType}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">NIC / BR</dt>
                    <dd className="font-medium text-slate-900">{form.brNumber}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-slate-900">{form.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="font-medium text-slate-900">{form.phone}</dd>
                  </div>
                </dl>

                <label className="mt-6 flex cursor-pointer items-start gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={update('agreed')}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  I agree to the Seller Terms, commission policy, and verification process.
                </label>
                <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  Our team will review your application within 24–48 business hours.
                </p>
              </>
            )}

            {error && (
              <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Back
                </button>
              ) : (
                <Link
                  to="/login?portal=seller"
                  className="text-sm font-semibold text-slate-500 hover:text-dcc-primary"
                >
                  Already have an account? Sign in
                </Link>
              )}

              <button
                type="button"
                onClick={next}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-70"
              >
                {submitting ? 'Submitting…' : continueLabel}
                {!submitting && step < 2 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
