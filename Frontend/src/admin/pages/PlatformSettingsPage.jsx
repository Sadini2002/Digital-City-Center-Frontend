import { useState } from 'react'
import { Save, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPlatformSettings, savePlatformSettings } from '../utils/adminStorage'

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState(() => getPlatformSettings())
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!settings.platformName?.trim()) errs.platformName = 'Platform name is required.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!settings.contactEmail?.trim()) {
      errs.contactEmail = 'Contact email is required.'
    } else if (!emailRegex.test(settings.contactEmail.trim())) {
      errs.contactEmail = 'Please enter a valid email address.'
    }

    const baseFee = Number(settings.baseDeliveryFee)
    if (isNaN(baseFee) || baseFee < 0) errs.baseDeliveryFee = 'Base delivery fee must be a non-negative number.'

    const surcharge = Number(settings.outOfColomboSurcharge)
    if (isNaN(surcharge) || surcharge < 0) errs.outOfColomboSurcharge = 'Surcharge must be a non-negative number.'

    return errs
  }

  const handleSave = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the highlighted errors.')
      return
    }
    savePlatformSettings({
      platformName: settings.platformName.trim(),
      contactEmail: settings.contactEmail.trim(),
      baseDeliveryFee: Number(settings.baseDeliveryFee),
      outOfColomboSurcharge: Number(settings.outOfColomboSurcharge),
      disallowedKeywords: settings.disallowedKeywords,
    })
    toast.success('Platform settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-dcc-primary" />
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure platform-wide parameters. Changes are saved to browser storage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
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

        {/* Delivery Settings */}
        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Delivery Fees</h2>
          <p className="mt-1 text-sm text-slate-500">
            These fees will be reflected at checkout based on the delivery address.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-base-fee">
                Base Delivery Fee (LKR)
              </label>
              <input
                id="ps-base-fee"
                type="number"
                min="0"
                step="1"
                value={settings.baseDeliveryFee}
                onChange={(e) => handleChange('baseDeliveryFee', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.baseDeliveryFee
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.baseDeliveryFee && (
                <p className="text-xs text-rose-500">{errors.baseDeliveryFee}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ps-surcharge">
                Out-of-Colombo Surcharge (LKR)
              </label>
              <input
                id="ps-surcharge"
                type="number"
                min="0"
                step="1"
                value={settings.outOfColomboSurcharge}
                onChange={(e) => handleChange('outOfColomboSurcharge', e.target.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.outOfColomboSurcharge
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
                }`}
              />
              {errors.outOfColomboSurcharge && (
                <p className="text-xs text-rose-500">{errors.outOfColomboSurcharge}</p>
              )}
            </div>
          </div>
        </section>

        {/* Content Moderation */}
        <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
          <h2 className="text-lg font-bold text-slate-900">Content Moderation</h2>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="ps-keywords">
              Disallowed Address Keywords
              <span className="ml-1 text-xs font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              id="ps-keywords"
              type="text"
              value={settings.disallowedKeywords}
              onChange={(e) => handleChange('disallowedKeywords', e.target.value)}
              placeholder="e.g. india, bangalore, mumbai"
              className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
            <p className="text-xs text-slate-500">
              If a delivery address contains any of these keywords, it will be flagged during checkout.
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
