import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  X,
} from 'lucide-react'

import toast from 'react-hot-toast'
import { adminApi } from '../services/adminApi'

const initialForm = {
  title: '',
  subtitle: '',
  description: '',
  type: 'announcement',
  ctaLabel: 'Shop Now',
  ctaTo: '/deals',
  enabled: true,
  startsAt: '',
  expiresAt: '',
  sortOrder: 0,
}

const inputClass =
  'w-full rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(initialForm)
  const [banner, setBanner] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadAnnouncements = async () => {
    try {
      setLoading(true)

      const response = await adminApi.getAnnouncements()

      setAnnouncements(response.data.data || [])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to load announcements.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const changeField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setBanner(null)
    setEditingId(null)

    const input = document.getElementById('announcement-banner')
    if (input) input.value = ''
  }

  const handleEdit = (item) => {
    setEditingId(item.id)

    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      type: item.type || 'announcement',
      ctaLabel: item.ctaLabel || '',
      ctaTo: item.ctaTo || '',
      enabled: item.enabled,
      startsAt: item.startsAt
        ? item.startsAt.slice(0, 16)
        : '',
      expiresAt: item.expiresAt
        ? item.expiresAt.slice(0, 16)
        : '',
      sortOrder: item.sortOrder || 0,
    })

    setBanner(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      toast.error('Please enter an announcement title.')
      return
    }

    if (form.type !== 'announcement' && !banner && !editingId) {
      toast.error('Please select a banner image.')
      return
    }

    const formData = new FormData()

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value ?? ''))
    })

    if (banner) {
      formData.append('banner', banner)
    }

    try {
      setSaving(true)

      if (editingId) {
        await adminApi.updateAnnouncement(editingId, formData)
        toast.success('Announcement updated successfully.')
      } else {
        await adminApi.createAnnouncement(formData)
        toast.success('Announcement published successfully.')
      }

      resetForm()
      await loadAnnouncements()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to save announcement.'
      )
    } finally {
      setSaving(false)
    }
  }

  const toggleAnnouncement = async (item) => {
    const formData = new FormData()

    formData.append('enabled', String(!item.enabled))

    try {
      await adminApi.updateAnnouncement(item.id, formData)

      toast.success('Announcement status updated.')
      await loadAnnouncements()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to update status.'
      )
    }
  }

  const removeAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return

    try {
      await adminApi.deleteAnnouncement(id)

      toast.success('Announcement deleted.')
      await loadAnnouncements()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unable to delete announcement.'
      )
    }
  }

  const expired = (item) =>
    item.expiresAt && new Date(item.expiresAt) <= new Date()

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Announcement Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage homepage announcements, banners and promotions.
        </p>
      </div>

      {/* Create / Edit Form */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-lg font-bold">
            {editingId ? 'Edit Announcement' : 'Create Announcement'}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-sm text-slate-500"
            >
              <X size={16} />
              Cancel
            </button>
          )}

        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Title *
            </label>

            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => changeField('title', e.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Subtitle
            </label>

            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) => changeField('subtitle', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold">
              Description
            </label>

            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => changeField('description', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Content Type
            </label>

            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => changeField('type', e.target.value)}
            >
              <option value="announcement">Announcement</option>
              <option value="banner">Banner</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Banner Image
            </label>

            <input
              id="announcement-banner"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={inputClass}
              onChange={(e) => setBanner(e.target.files?.[0] || null)}
            />

            <p className="mt-1 text-xs text-slate-400">
              PNG, JPG or WEBP. Maximum 5 MB.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Button Label
            </label>

            <input
              className={inputClass}
              value={form.ctaLabel}
              onChange={(e) => changeField('ctaLabel', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Button Link
            </label>

            <input
              className={inputClass}
              value={form.ctaTo}
              onChange={(e) => changeField('ctaTo', e.target.value)}
              placeholder="/deals"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Start Date
            </label>

            <input
              type="datetime-local"
              className={inputClass}
              value={form.startsAt}
              onChange={(e) => changeField('startsAt', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Expiry Date
            </label>

            <input
              type="datetime-local"
              className={inputClass}
              value={form.expiresAt}
              onChange={(e) => changeField('expiresAt', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Display Order
            </label>

            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.sortOrder}
              onChange={(e) => changeField('sortOrder', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => changeField('enabled', e.target.checked)}
            />

            <label className="text-sm font-medium">
              Publish / Enable
            </label>
          </div>

          <div className="flex flex-wrap gap-3 sm:col-span-2">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Plus size={17} />
              {saving ? 'Saving...' : editingId ? 'Update' : 'Publish'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      {/* Announcement List */}

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold">
          All Announcements
        </h2>

        {loading ? (
          <p className="py-6 text-center text-slate-500">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="py-6 text-center text-slate-500">
            No announcements available.
          </p>
        ) : (

          <div className="mt-4 divide-y">

            {announcements.map((item) => (

              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >

                <div className="flex min-w-0 items-center gap-4">

                  {item.imageUrl ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${item.imageUrl}`}
                      alt={item.title}
                      className="h-16 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100">
                      <ImageIcon className="text-slate-400" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.subtitle}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.type} · {expired(item) ? 'Expired' : item.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() => toggleAnnouncement(item)}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold"
                  >
                    {item.enabled ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold text-dcc-primary"
                  >
                    <Edit size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeAnnouncement(item.id)}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  )
}