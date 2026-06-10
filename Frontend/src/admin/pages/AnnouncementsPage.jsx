import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getAnnouncements, saveAnnouncements } from '../utils/adminStorage'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(() => getAnnouncements())

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaLabel, setCtaLabel] = useState('Shop Now')
  const [ctaTo, setCtaTo] = useState('/category/all')
  const [enabled, setEnabled] = useState(true)

  const persist = (next) => {
    saveAnnouncements(next)
    setAnnouncements(next)
  }

  const add = (e) => {
    e.preventDefault()
    if (!title.trim() || !subtitle.trim()) return
    const item = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaLabel: ctaLabel.trim() || 'Shop Now',
      ctaTo: ctaTo.trim() || '/category/all',
      enabled: Boolean(enabled),
      createdAt: new Date().toISOString(),
    }
    persist([item, ...announcements])
    setTitle('')
    setSubtitle('')
  }

  const toggle = (id) => {
    persist(announcements.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }

  const remove = (id) => {
    persist(announcements.filter((a) => a.id !== id))
  }

  const input =
    'w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Announcement management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Post banners and promotions visible to buyers on the homepage.
        </p>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Create announcement</h2>
        <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={input} />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" className={input} />
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="CTA label" className={input} />
          <input value={ctaTo} onChange={(e) => setCtaTo(e.target.value)} placeholder="CTA link (e.g. /deals)" className={input} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Enabled
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Publish
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">All announcements</h2>
        {announcements.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No announcements yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-dcc-primary/10">
            {announcements.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-600">{a.subtitle}</p>
                  <p className="text-xs text-slate-400">
                    CTA: {a.ctaLabel} → {a.ctaTo}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(a.id)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      a.enabled ? 'bg-dcc-primary/10 text-dcc-primary' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

