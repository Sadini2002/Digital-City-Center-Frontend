import { useState } from 'react'
import toast from 'react-hot-toast'
import { saveCommissionSettings, getCommissionSettings, getAdminCategories } from '../utils/adminStorage'

function seedCategories() {
  return [
    { slug: 'electronics', title: 'Electronics & Gadgets' },
    { slug: 'fashion', title: 'Fashion' },
    { slug: 'groceries', title: 'Groceries' },
    { slug: 'home', title: 'Home & Living' },
    { slug: 'beauty', title: 'Beauty' },
    { slug: 'sports', title: 'Sports' },
    { slug: 'kids', title: 'Kids & Toys' },
  ].map((c) => ({ ...c, enabled: true }))
}

export default function CommissionSettingsPage() {
  const [categories] = useState(() => getAdminCategories(seedCategories()))
  const [settings, setSettings] = useState(() => getCommissionSettings())

  const update = (slug) => (e) => {
    setSettings((prev) => ({ ...prev, [slug]: e.target.value }))
  }

  const save = () => {
    for (const c of categories.filter((cat) => cat.enabled)) {
      const val = settings[c.slug]
      
      // If setting is defined but is empty or invalid
      if (val === '') {
        toast.error(`Please enter a commission rate for ${c.title}`)
        return
      }
      
      const num = Number(val ?? 8)
      if (isNaN(num) || num < 0 || num > 100) {
        toast.error(`Commission rate for ${c.title} must be a number between 0 and 100`)
        return
      }
    }

    saveCommissionSettings(settings)
    toast.success('Commission settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Commission settings</h1>
        <p className="mt-1 text-sm text-slate-600">Set commission percentage per category.</p>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-dcc-primary/15 text-slate-500">
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Commission (%)</th>
              </tr>
            </thead>
            <tbody>
              {categories.filter((c) => c.enabled).map((c) => (
                <tr key={c.slug} className="border-b border-dcc-primary/10">
                  <td className="py-3 font-medium text-slate-900">{c.title}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={settings[c.slug] ?? 8}
                        onChange={update(c.slug)}
                        className="w-28 rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={save}
          className="mt-6 rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
        >
          Save settings
        </button>
      </section>
    </div>
  )
}

