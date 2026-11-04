import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, Pencil, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../services/adminApi'
import CategoryIcon from '../components/categories/CategoryIcon'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import ConfirmActionDialog from '../components/common/ConfirmActionDialog'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
]

function StatusSwitch({ category, disabled, onToggle }) {
  const enabled = category.status === 'active'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${enabled ? 'Disable' : 'Enable'} ${category.name}`}
      disabled={disabled}
      onClick={() => onToggle(category)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dcc-primary disabled:cursor-not-allowed disabled:opacity-50 ${
        enabled ? 'bg-dcc-primary' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function CategoryRow({ category, isChild, expanded, onToggleExpand, busyId, onAddChild, onEdit, onToggleStatus }) {
  const isBusy = busyId === category.id
  const dimmed = category.matchedFilter === false

  return (
    <div
      className={`flex flex-wrap items-center gap-3 px-4 py-3 ${isChild ? 'bg-slate-50/60 pl-6 sm:pl-14' : ''} ${
        dimmed ? 'opacity-60' : ''
      }`}
    >
      {!isChild ? (
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.name}`}
          disabled={!category.children?.length}
          className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:invisible"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-dcc-primary">
        <CategoryIcon icon={category.icon} name={category.name} className="h-5 w-5" imageClassName="h-9 w-9 rounded-lg object-cover" />
      </div>

      <div className="min-w-0 flex-1 basis-48">
        <p className="truncate text-sm font-semibold text-slate-900">{category.name}</p>
        <p className="truncate text-xs text-slate-500">
          /{category.slug}
          {category.description ? ` · ${category.description}` : ''}
        </p>
      </div>

      <div className="hidden w-28 text-right text-xs text-slate-500 md:block">
        {isChild ? (
          <span>{category.listingCount} listings</span>
        ) : (
          <span>
            {category.totalListingCount ?? category.listingCount} listings
            <br />
            {category.childCount} sub
          </span>
        )}
      </div>

      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
          category.status === 'active'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            : 'bg-slate-100 text-slate-600 ring-slate-200'
        }`}
      >
        {category.status === 'active' ? 'Enabled' : 'Disabled'}
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        {!isChild && (
          <button
            type="button"
            onClick={() => onAddChild(category)}
            disabled={isBusy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Subcategory
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(category)}
          disabled={isBusy}
          aria-label={`Edit ${category.name}`}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {isBusy ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-label="Updating" />
        ) : (
          <StatusSwitch category={category} disabled={isBusy} onToggle={onToggleStatus} />
        )}
      </div>
    </div>
  )
}

export default function CategoryManagementPage() {
  const [tree, setTree] = useState([])
  const [flat, setFlat] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const [expanded, setExpanded] = useState(() => new Set())
  const [modal, setModal] = useState(null) // { mode, category?, parentId? }
  const [saving, setSaving] = useState(false)
  const [pendingToggle, setPendingToggle] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const requestRef = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const load = useCallback(async () => {
    const requestId = ++requestRef.current
    setError('')
    try {
      const res = await adminApi.getCategories({ status, ...(search ? { search } : {}) })
      if (requestId !== requestRef.current) return
      setTree(res.data?.data ?? [])
      setFlat(res.data?.flat ?? [])
      setStats(res.data?.stats ?? null)
    } catch (err) {
      if (requestId !== requestRef.current) return
      setError(err.message || 'Failed to load categories.')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [status, search])

  useEffect(() => {
    load()
  }, [load])

  const filtering = status !== 'all' || Boolean(search)
  const isExpanded = (id) => filtering || expanded.has(id)

  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleSubmit = async (formData) => {
    setSaving(true)
    try {
      if (modal.mode === 'edit') {
        await adminApi.updateCategory(modal.category.id, formData)
        toast.success('Category updated.')
      } else {
        await adminApi.createCategory(formData)
        toast.success('Category created.')
        const parent = formData.get('parentId')
        if (parent) setExpanded((prev) => new Set(prev).add(Number(parent)))
      }
      setModal(null)
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not save category.')
    } finally {
      setSaving(false)
    }
  }

  const confirmToggle = async () => {
    const category = pendingToggle
    const next = category.status === 'active' ? 'disabled' : 'active'
    setBusyId(category.id)
    try {
      const res = await adminApi.setCategoryStatus(category.id, next)
      const cascaded = res.data?.cascadedDisabled ?? 0
      toast.success(
        next === 'active'
          ? `${category.name} enabled.`
          : cascaded
            ? `${category.name} and ${cascaded} subcategor${cascaded === 1 ? 'y' : 'ies'} disabled.`
            : `${category.name} disabled.`,
      )
      setPendingToggle(null)
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not change status.')
    } finally {
      setBusyId(null)
    }
  }

  const disabling = pendingToggle?.status === 'active'
  const activeChildren = pendingToggle
    ? flat.filter((c) => c.parentId === pendingToggle.id && c.status === 'active').length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Organise the marketplace into categories and subcategories. Disabled categories are hidden from the storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: 'create' })}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add category
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Total', stats.total],
            ['Top-level', stats.topLevel],
            ['Subcategories', stats.subcategories],
            ['Disabled', stats.disabled],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm font-semibold" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={status === filter.value}
              onClick={() => setStatus(filter.value)}
              className={`rounded-md px-3 py-1.5 ${
                status === filter.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-px" aria-busy="true" aria-label="Loading categories">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                load()
              }}
              className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try again
            </button>
          </div>
        ) : tree.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-900">
              {filtering ? 'No categories match your filters.' : 'No categories yet.'}
            </p>
            {!filtering && (
              <p className="mt-1 text-sm text-slate-500">
                Add Fashion &amp; Goods, Groceries, Small Businesses and Services to get started.
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tree.map((top) => (
              <li key={top.id}>
                <CategoryRow
                  category={top}
                  expanded={isExpanded(top.id)}
                  onToggleExpand={() => toggleExpand(top.id)}
                  busyId={busyId}
                  onAddChild={(c) => setModal({ mode: 'create', parentId: c.id })}
                  onEdit={(c) => setModal({ mode: 'edit', category: c })}
                  onToggleStatus={setPendingToggle}
                />
                {isExpanded(top.id) && top.children?.length > 0 && (
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {top.children.map((child) => (
                      <li key={child.id}>
                        <CategoryRow
                          category={child}
                          isChild
                          busyId={busyId}
                          onEdit={(c) => setModal({ mode: 'edit', category: c })}
                          onToggleStatus={setPendingToggle}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal && (
        <CategoryFormModal
          mode={modal.mode}
          category={modal.category}
          categories={flat}
          defaultParentId={modal.parentId ?? ''}
          busy={saving}
          onSubmit={handleSubmit}
          onClose={() => !saving && setModal(null)}
        />
      )}

      {pendingToggle && (
        <ConfirmActionDialog
          title={disabling ? `Disable “${pendingToggle.name}”?` : `Enable “${pendingToggle.name}”?`}
          variant={disabling ? 'danger' : 'primary'}
          confirmLabel={disabling ? 'Disable category' : 'Enable category'}
          busy={busyId === pendingToggle.id}
          description={
            disabling ? (
              <>
                <p>It will be hidden from the storefront category list.</p>
                {activeChildren > 0 && (
                  <p className="mt-2 font-semibold text-amber-700">
                    {activeChildren} active subcategor{activeChildren === 1 ? 'y' : 'ies'} will be disabled too.
                  </p>
                )}
                {pendingToggle.listingCount > 0 && (
                  <p className="mt-2">
                    {pendingToggle.listingCount} existing listing{pendingToggle.listingCount === 1 ? '' : 's'} stay in this category.
                  </p>
                )}
              </>
            ) : (
              <p>It will appear on the storefront again. Disabled subcategories stay disabled until you enable them.</p>
            )
          }
          onConfirm={confirmToggle}
          onCancel={() => busyId === null && setPendingToggle(null)}
        />
      )}
    </div>
  )
}