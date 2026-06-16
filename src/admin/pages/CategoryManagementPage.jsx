import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(() => getAdminCategories(seedCategories()))
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')

  const [editingSlug, setEditingSlug] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')

  const persist = (next) => {
    saveAdminCategories(next)
    setCategories(next)
  }

  const toggle = (slug) => {
    persist(categories.map((c) => (c.slug === slug ? { ...c, enabled: !c.enabled } : c)))
  }

  const remove = (slug) => {
    persist(categories.filter((c) => c.slug !== slug))
  }

  const add = (e) => {
    e.preventDefault()
    const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const title = newTitle.trim()
    
    if (!title) {
      toast.error('Category title is required.')
      return
    }
    if (!slug) {
      toast.error('Category slug is required.')
      return
    }
    if (categories.some((c) => c.slug === slug || c.title.toLowerCase() === title.toLowerCase())) {
      toast.error('A category with this name or slug already exists.')
      return
    }
    
    persist([{ slug, title, enabled: true }, ...categories])
    toast.success('Category added successfully!')
    setNewSlug('')
    setNewTitle('')
  }

  const startEdit = (c) => {
    setEditingSlug(c.slug)
    setEditTitle(c.title)
    setEditSlug(c.slug)
  }

  const cancelEdit = () => {
    setEditingSlug(null)
  }

  const saveUpdate = (e) => {
    e.preventDefault()
    const updatedSlug = editSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const updatedTitle = editTitle.trim()

    if (!updatedTitle) {
      toast.error('Category title is required.')
      return
    }
    if (!updatedSlug) {
      toast.error('Category slug is required.')
      return
    }
    if (categories.some((c) => c.slug !== editingSlug && (c.slug === updatedSlug || c.title.toLowerCase() === updatedTitle.toLowerCase()))) {
      toast.error('A category with this name or slug already exists.')
      return
    }

    persist(categories.map((c) => c.slug === editingSlug ? { ...c, slug: updatedSlug, title: updatedTitle } : c))
    toast.success('Category updated successfully!')
    setEditingSlug(null)
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
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Category title"
            className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          />
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="slug (e.g. electronics)"
            className="rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          />
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
              {categories.map((c) => {
                const isEditing = editingSlug === c.slug
                return (
                  <tr key={c.slug} className="border-b border-dcc-primary/10">
                    <td className="py-3 font-medium text-slate-900">
                      {isEditing ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-dcc-primary focus:outline-none"
                        />
                      ) : (
                        c.title
                      )}
                    </td>
                    <td className="py-3 text-slate-600">
                      {isEditing ? (
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-dcc-primary focus:outline-none"
                        />
                      ) : (
                        c.slug
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggle(c.slug)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.enabled ? 'bg-dcc-primary/10 text-dcc-primary' : 'bg-slate-100 text-slate-600'
                        }`}
                        disabled={isEditing}
                      >
                        {c.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      {isEditing ? (
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={saveUpdate}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(c.slug)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-dcc-primary/25 px-3 py-2 text-xs font-semibold text-dcc-primary hover:bg-dcc-primary/5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

