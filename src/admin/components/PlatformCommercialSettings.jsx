import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Settings, Percent } from 'lucide-react'
import { adminApi } from '../services/adminApi'

const inputClass =
  'w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

export default function PlatformCommercialSettings() {
  const [settings, setSettings] = useState({
    platformName: '',
    contactEmail: '',
    defaultCommissionRate: 10,
    currency: 'LKR',
    maintenanceMode: false,
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)

      const [settingsResponse, commissionResponse] =
        await Promise.all([
          adminApi.getPlatformSettings(),
          adminApi.getCategoryCommissions(),
        ])

      setSettings(settingsResponse.data.data)

      setCategories(commissionResponse.data.data.map((item) => ({
        ...item,
        editRate: String(
          item.commissionRate ?? item.effectiveRate
        ),
      })))
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to load platform settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSettingChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const saveSettings = async (event) => {
    event.preventDefault()

    if (
      !Number.isFinite(Number(settings.defaultCommissionRate)) ||
      Number(settings.defaultCommissionRate) < 0 ||
      Number(settings.defaultCommissionRate) > 100
    ) {
      toast.error('Commission must be between 0 and 100.')
      return
    }

    try {
      setSaving(true)

      await adminApi.updatePlatformSettings({
        ...settings,
        defaultCommissionRate: Number(
          settings.defaultCommissionRate
        ),
      })

      toast.success('Platform settings saved successfully.')
      await loadData()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to save settings.'
      )
    } finally {
      setSaving(false)
    }
  }

  const saveCategoryRate = async (category) => {
    const rate = Number(category.editRate)

    if (
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 100
    ) {
      toast.error('Enter a commission between 0 and 100.')
      return
    }

    try {
      await adminApi.updateCategoryCommission(
        category.categoryId,
        rate
      )

      toast.success(
        `${category.categoryName} commission updated.`
      )

      await loadData()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to update commission.'
      )
    }
  }

  const resetCategoryRate = async (category) => {
    try {
      await adminApi.deleteCategoryCommission(
        category.categoryId
      )

      toast.success(
        `${category.categoryName} now uses the default rate.`
      )

      await loadData()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to reset commission.'
      )
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center">
        Loading platform configuration...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* General Settings */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Settings className="h-6 w-6 text-dcc-primary" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              General Platform Configuration
            </h2>
            <p className="text-sm text-slate-500">
              Manage platform-wide information.
            </p>
          </div>
        </div>

        <form onSubmit={saveSettings} className="space-y-5">

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Platform Name
              </label>

              <input
                className={inputClass}
                value={settings.platformName}
                onChange={(e) =>
                  handleSettingChange(
                    'platformName',
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Contact Email
              </label>

              <input
                type="email"
                className={inputClass}
                value={settings.contactEmail}
                onChange={(e) =>
                  handleSettingChange(
                    'contactEmail',
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Currency
              </label>

              <select
                className={inputClass}
                value={settings.currency}
                onChange={(e) =>
                  handleSettingChange('currency', e.target.value)
                }
              >
                <option value="LKR">LKR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleSettingChange(
                    'maintenanceMode',
                    e.target.checked
                  )
                }
              />

              <label className="text-sm font-medium">
                Maintenance Mode
              </label>
            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save General Settings'}
          </button>

        </form>
      </section>

      {/* Default Commission */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <Percent className="h-6 w-6 text-dcc-primary" />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Default Commission Rate
            </h2>

            <p className="text-sm text-slate-500">
              Applied to categories without a custom rate.
            </p>
          </div>
        </div>

        <form onSubmit={saveSettings} className="max-w-md">

          <label className="mb-2 block text-sm font-semibold">
            Default Commission (%)
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              className={inputClass}
              value={settings.defaultCommissionRate}
              onChange={(e) =>
                handleSettingChange(
                  'defaultCommissionRate',
                  e.target.value
                )
              }
              required
            />

            <span className="absolute right-4 top-2.5 text-slate-500">
              %
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Save size={17} />
            Save Commission
          </button>

        </form>
      </section>

      {/* Category Commissions */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Category-Specific Commission Rates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set a different commission for each marketplace category.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Commission (%)</th>
                <th className="p-3">Effective Rate</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {categories.map((category) => (

                <tr key={category.categoryId}>

                  <td className="p-3 font-semibold">
                    {category.categoryName}
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={category.editRate}
                      onChange={(e) => {
                        setCategories((previous) =>
                          previous.map((item) =>
                            item.categoryId === category.categoryId
                              ? {
                                  ...item,
                                  editRate: e.target.value,
                                }
                              : item
                          )
                        )
                      }}
                      className="w-28 rounded-lg border px-3 py-2"
                    />
                  </td>

                  <td className="p-3">
                    {category.effectiveRate}%
                    {!category.isCustom && (
                      <span className="ml-2 text-xs text-slate-400">
                        Default
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() => saveCategoryRate(category)}
                        className="rounded-lg bg-dcc-primary px-3 py-2 text-xs font-semibold text-white"
                      >
                        Save
                      </button>

                      {category.isCustom && (
                        <button
                          type="button"
                          onClick={() => resetCategoryRate(category)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-600"
                        >
                          <RefreshCw size={13} />
                          Reset
                        </button>
                      )}

                    </div>
                  </td>

                </tr>

              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    No categories available.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>

      </section>

    </div>
  )
}