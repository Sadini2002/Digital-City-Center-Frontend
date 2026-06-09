import { useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAdminCategories, saveAdminCategories } from '../utils/adminStorage'
import { getCategoryMeta } from '../../components/category/categoryData'

function seedCategories() {
  const slugs = ['electronics', 'fashion', 'groceries', 'home', 'beauty', 'sports', 'kids']
  return slugs.map((slug) => {
    const meta = getCategoryMeta(slug)
    return { slug, title: meta.title, enabled: true }
  })
}

const slugRegex = /^[a-z0-9-]+$/

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(() => getAdminCategories(seedCategories()))
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [formErrors, setFormErrors] = useState({ title: '', slug: '' })
  // editingId tracks which category is in edit mode
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editErrors, setEditErrors] = useState({ title: '', slug: '' })

  const persist = (next) => {
    saveAdminCategories(next)
    setCategories(next)
  }

  const toggle = (slug) => {
    const next = categories.map((c) => (c.slug === slug ? { ...c, enabled: !c.enabled } : c))
    persist(next)
    const target = next.find((c) => c.slug === slug)
    if (target) {
      toast.success(`Category "${target.title}" is now ${target.enabled ? 'enabled' : 'disabled'}.`)
    }
  }

  const remove = (slug) => {
    const target = categories.find((c) => c.slug === slug)
    persist(categories.filter((c) => c.slug !== slug))
    if (target) {
      toast.success(`Category "${target.title}" removed successfully!`)
    }
  }

  const add = (e) => {
    e.preventDefault()
    const title = newTitle.trim()
    const slugRaw = newSlug.trim()
    const errors = { title: '', slug: '' }
    let hasError = false

    if (!title) { errors.title = 'Category title is required'; hasError = true }
    if (!slugRaw) { errors.slug = 'Category slug is required'; hasError = true }
    else if (!slugRegex.test(slugRaw)) {
      errors.slug = 'Slug: only lowercase letters, numbers, hyphens allowed'
      hasError = true
    } else if (categories.some((c) => c.slug === slugRaw)) {
      errors.slug = 'A category with this slug already exists'
      hasError = true
    }
    if (title && categories.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
      errors.title = 'A category with this title already exists'
      hasError = true
    }

    setFormErrors(errors)
    if (hasError) return

    persist([{ slug: slugRaw, title, enabled: true }, ...categories])
    setNewSlug('')
    setNewTitle('')
    setFormErrors({ title: '', slug: '' })
    toast.success('Category added successfully!')
  }

  const startEdit = (cat) => {
    setEditingId(cat.slug)
    setEditTitle(cat.title)
    setEditSlug(cat.slug)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditSlug('')
    setEditErrors({ title: '', slug: '' })
  }

  const saveEdit = (originalSlug) => {
    const title = editTitle.trim()
    const slug = editSlug.trim()
    const errors = { title: '', slug: '' }
    let hasError = false

    if (!title) { errors.title = 'Category title cannot be empty'; hasError = true }
    if (!slug) { errors.slug = 'Category slug cannot be empty'; hasError = true }
    else if (!slugRegex.test(slug)) {
      errors.slug = 'Slug: only lowercase letters, numbers, hyphens allowed'
      hasError = true
    } else if (categories.some((c) => c.slug !== originalSlug && c.slug === slug)) {
      errors.slug = 'A category with this slug already exists'
      hasError = true
    }
    if (title && categories.some((c) => c.slug !== originalSlug && c.title.toLowerCase() === title.toLowerCase())) {
      errors.title = 'A category with this title already exists'
      hasError = true
    }

    setEditErrors(errors)
    if (hasError) return

    const next = categories.map((c) =>
      c.slug === originalSlug ? { ...c, title, slug } : c
    )
    persist(next)
    setEditingId(null)
    setEditErrors({ title: '', slug: '' })
    toast.success('Category updated successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Category management</h1>
        <p className="mt-1 text-sm text-slate-600">Add, edit, and disable any category.</p>
      </div>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">Add category</h2>
        <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <input
              value={newTitle}
              onChange={(e) => { setNewTitle(e.target.value); setFormErrors((prev) => ({ ...prev, title: '' })) }}
              placeholder="Category title"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                formErrors.title
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                  : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
              }`}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs font-semibold text-red-600">{formErrors.title}</p>
            )}
          </div>
          <div>
            <input
              value={newSlug}
              onChange={(e) => { setNewSlug(e.target.value); setFormErrors((prev) => ({ ...prev, slug: '' })) }}
              placeholder="slug (e.g. electronics)"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                formErrors.slug
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                  : 'border-dcc-primary/20 bg-dcc-auth focus:border-dcc-primary focus:ring-dcc-primary/15'
              }`}
            />
            {formErrors.slug && (
              <p className="mt-1 text-xs font-semibold text-red-600">{formErrors.slug}</p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-dcc-primary/20 bg-white p-6 shadow-sm shadow-dcc-primary/10">
        <h2 className="text-lg font-bold text-slate-900">All categories</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-dcc-primary/15 text-slate-500">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) =>
                editingId === c.slug ? (
                  // ── Inline edit row ──
                  <tr key={c.slug} className="border-b border-dcc-primary/10 bg-dcc-auth/40">
                    <td className="py-2">
                      <input
                        value={editTitle}
                        onChange={(e) => { setEditTitle(e.target.value); setEditErrors((prev) => ({ ...prev, title: '' })) }}
                        className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none ${
                          editErrors.title ? 'border-red-400 bg-red-50' : 'border-dcc-primary/30 bg-white focus:border-dcc-primary'
                        }`}
                      />
                      {editErrors.title && <p className="mt-0.5 text-[10px] font-semibold text-red-600">{editErrors.title}</p>}
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        value={editSlug}
                        onChange={(e) => { setEditSlug(e.target.value); setEditErrors((prev) => ({ ...prev, slug: '' })) }}
                        className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none ${
                          editErrors.slug ? 'border-red-400 bg-red-50' : 'border-dcc-primary/30 bg-white focus:border-dcc-primary'
                        }`}
                      />
                      {editErrors.slug && <p className="mt-0.5 text-[10px] font-semibold text-red-600">{editErrors.slug}</p>}
                    </td>
                    <td className="py-2 text-slate-400 text-xs italic">editing…</td>
                    <td className="py-2 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveEdit(c.slug)}
                          className="inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                        >
                          <Save className="h-3.5 w-3.5" />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg border border-dcc-primary/25 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // ── View row ──
                  <tr key={c.slug} className="border-b border-dcc-primary/10">
                    <td className="py-3 font-medium text-slate-900">{c.title}</td>
                    <td className="py-3 text-slate-600">{c.slug}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggle(c.slug)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.enabled ? 'bg-dcc-primary/10 text-dcc-primary' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(c.slug)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
