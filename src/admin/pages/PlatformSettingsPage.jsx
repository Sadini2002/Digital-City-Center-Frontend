import { useEffect, useRef, useState } from 'react'
import { AlertCircle, MapPin, Plus, Save, Settings, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPlatformSettings, savePlatformSettings } from '../utils/adminStorage'
import { validatePlatformSettings } from '../utils/platformSettingsValidation'
import { DISTRICTS } from '../../delivery/data/constants'

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState(() => getPlatformSettings())
  const [errors, setErrors] = useState({})
  const [newCoverageArea, setNewCoverageArea] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (window.location.hash === '#coverage-area-management') {
      document.getElementById('coverage-area-management')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const addCoverageArea = (area) => {
    const trimmed = area.trim()
    if (!trimmed) return
    const current = settings.coverageAreas || []
    if (current.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Area is already in the coverage list.')
      return
    }
    handleChange('coverageAreas', [...current, trimmed])
    setNewCoverageArea('')
  }

  const removeCoverageArea = (area) => {
    handleChange(
      'coverageAreas',
      (settings.coverageAreas || []).filter((a) => a !== area),
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    const errs = validatePlatformSettings(settings)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the validation errors before saving.')
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setErrors({})
    const saved = savePlatformSettings(settings)
    setSettings(saved)
    toast.success(
      `Settings saved. ${(saved.coverageAreas || []).length} coverage area(s) active at checkout.`,
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-dcc-primary" />
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure platform-wide delivery pricing, coverage areas, and checkout rules for buyers.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSave} className="space-y-6">
        {Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <div className="flex items-start gap-2 font-semibold">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Validation failed — please correct the following:</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-9">
              {Object.values(errors).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">General</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-platform-name">
                Platform Name
              </label>
              <input
                id="ps-platform-name"
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.platformName
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.platformName && (
                <p className="text-xs text-rose-500">{errors.platformName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-contact-email">
                Contact Email
              </label>
              <input
                id="ps-contact-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.contactEmail
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.contactEmail && (
                <p className="text-xs text-rose-500">{errors.contactEmail}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Delivery Pricing Configuration</h2>
          <p className="mt-1 text-sm text-slate-500">
            These settings control how delivery fees are calculated at buyer checkout.
          </p>

          <div className="mt-4 flex rounded-xl bg-slate-100 p-1 max-w-md">
            <button
              type="button"
              onClick={() => handleChange('pricingModel', 'distance')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                settings.pricingModel === 'distance'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Distance Based
            </button>
            <button
              type="button"
              onClick={() => handleChange('pricingModel', 'flat')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                settings.pricingModel === 'flat'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flat Fee
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {settings.pricingModel === 'distance' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="ps-base-fee">
                    Base Delivery Fee (LKR)
                  </label>
                  <input
                    id="ps-base-fee"
                    type="number"
                    min="0"
                    step="1"
                    value={settings.baseFee}
                    onChange={(e) => handleChange('baseFee', e.target.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.baseFee
                        ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                        : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                    }`}
                  />
                  {errors.baseFee && <p className="text-xs text-rose-500">{errors.baseFee}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="ps-per-km">
                    Rate Per Km (LKR)
                  </label>
                  <input
                    id="ps-per-km"
                    type="number"
                    min="0"
                    step="1"
                    value={settings.perKmFee}
                    onChange={(e) => handleChange('perKmFee', e.target.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.perKmFee
                        ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                        : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                    }`}
                  />
                  {errors.perKmFee && <p className="text-xs text-rose-500">{errors.perKmFee}</p>}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5 sm:col-span-2 sm:max-w-sm">
                <label className="text-sm font-semibold text-slate-700" htmlFor="ps-flat-fee">
                  Flat Delivery Fee (LKR)
                </label>
                <input
                  id="ps-flat-fee"
                  type="number"
                  min="0"
                  step="1"
                  value={settings.flatFee}
                  onChange={(e) => handleChange('flatFee', e.target.value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.flatFee
                      ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                      : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                  }`}
                />
                {errors.flatFee && <p className="text-xs text-rose-500">{errors.flatFee}</p>}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-surcharge">
                Out-of-Colombo Surcharge (LKR)
              </label>
              <input
                id="ps-surcharge"
                type="number"
                min="0"
                step="1"
                value={settings.outOfColomboFee}
                onChange={(e) => handleChange('outOfColomboFee', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.outOfColomboFee
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.outOfColomboFee && (
                <p className="text-xs text-rose-500">{errors.outOfColomboFee}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-free-threshold">
                Free Delivery Threshold (LKR)
              </label>
              <input
                id="ps-free-threshold"
                type="number"
                min="0"
                step="1"
                value={settings.freeThreshold}
                onChange={(e) => handleChange('freeThreshold', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.freeThreshold
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.freeThreshold && (
                <p className="text-xs text-rose-500">{errors.freeThreshold}</p>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {settings.pricingModel === 'distance'
              ? 'Fee = Base Fee + (Distance × Per-Km Rate) + out-of-Colombo surcharge when applicable.'
              : 'All deliveries within coverage areas use the flat fee.'}
          </p>
        </section>

        <section
          id="coverage-area-management"
          className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10"
        >
          <h2 className="text-lg font-bold text-slate-900">Coverage Area Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add or remove districts where platform delivery is available. Changes apply at buyer
            checkout after buyers refresh coverage data.
          </p>
          {(settings.coverageAreas || []).length > 0 && (
            <p className="mt-2 text-xs font-medium text-dcc-primary">
              Active coverage: {(settings.coverageAreas || []).join(' · ')}
            </p>
          )}
          {errors.coverageAreas && (
            <p className="mt-2 text-xs text-rose-500">{errors.coverageAreas}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <select
              value={newCoverageArea}
              onChange={(e) => setNewCoverageArea(e.target.value)}
              className="flex-1 min-w-[180px] rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            >
              <option value="">Add district…</option>
              {DISTRICTS.filter(
                (d) => !(settings.coverageAreas || []).some((a) => a.toLowerCase() === d.toLowerCase()),
              ).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => addCoverageArea(newCoverageArea)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Add Area
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {(settings.coverageAreas || []).length === 0 ? (
              <p className="p-4 text-sm text-slate-500 italic">No coverage areas configured.</p>
            ) : (
              (settings.coverageAreas || []).map((area) => (
                <div key={area} className="flex items-center justify-between px-4 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-dcc-primary" />
                    <span className="text-sm font-semibold text-slate-800">{area}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoverageArea(area)}
                    className="rounded-lg p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                    aria-label={`Remove ${area}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Address Restrictions</h2>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="ps-keywords">
              Disallowed Address Keywords
              <span className="ml-1 text-xs font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              id="ps-keywords"
              type="text"
              value={settings.unsupportedKeywords}
              onChange={(e) => handleChange('unsupportedKeywords', e.target.value)}
              placeholder="e.g. india, bengaluru, mumbai"
              className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
            <p className="text-xs text-slate-500">
              Checkout blocks addresses containing these keywords or districts outside Sri Lanka.
            </p>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            id="save-platform-settings-btn"
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-dcc-primary/30 hover:bg-dcc-primary-hover"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
