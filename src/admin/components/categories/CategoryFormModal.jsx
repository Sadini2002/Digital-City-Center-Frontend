import { useEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { ICON_NAMES } from './categoryIcons'
import { isImageIcon, resolveAssetUrl } from '../../utils/mediaUrl'

const NAME_MIN = 2
const NAME_MAX = 60
const DESCRIPTION_MAX = 300
const MAX_ICON_BYTES = 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/**
 * Add / edit category modal.
 *
 * Props:
 *  mode              'create' | 'edit'
 *  category          category being edited (edit mode)
 *  categories        flat, unfiltered list (used for the parent dropdown)
 *  defaultParentId   preselected parent when adding a subcategory
 *  busy              request in flight
 *  onSubmit(formData)
 *  onClose()
 */
export default function CategoryFormModal({
  mode,
  category,
  categories,
  defaultParentId = '',
  busy,
  onSubmit,
  onClose,
}) {
  const isEdit = mode === 'edit'

  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [parentId, setParentId] = useState(
    isEdit ? String(category?.parentId ?? '') : String(defaultParentId ?? ''),
  )
  const [status, setStatus] = useState(category?.status ?? 'active')
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0))

  // Icon state: named icon, uploaded file, or removed
  const initialIcon = category?.icon ?? ''
  const [iconName, setIconName] = useState(isImageIcon(initialIcon) ? '' : initialIcon)
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState(null)
  const [removeIcon, setRemoveIcon] = useState(false)
  const [iconTab, setIconTab] = useState(isImageIcon(initialIcon) ? 'upload' : 'name')

  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  useEffect(() => () => iconPreview && URL.revokeObjectURL(iconPreview), [iconPreview])

  const hasChildren = Number(category?.childCount ?? 0) > 0

  // Only top-level categories can be parents (max two levels).
  const parentOptions = useMemo(
    () => categories.filter((c) => !c.parentId && c.id !== category?.id),
    [categories, category?.id],
  )

  const chosenParent = parentOptions.find((c) => String(c.id) === parentId)

  const pickFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, icon: 'Icon must be a PNG, JPG or WEBP image.' }))
      return
    }
    if (file.size > MAX_ICON_BYTES) {
      setErrors((prev) => ({ ...prev, icon: 'Icon image must be 1 MB or smaller.' }))
      return
    }

    setErrors((prev) => ({ ...prev, icon: undefined }))
    setIconFile(file)
    setIconPreview(URL.createObjectURL(file))
    setRemoveIcon(false)
  }

  const clearIcon = () => {
    setIconFile(null)
    setIconPreview(null)
    setIconName('')
    setRemoveIcon(Boolean(initialIcon))
  }

  const validate = () => {
    const next = {}
    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
      next.name = `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`
    } else {
      const slug = (value) =>
        value
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      const clash = categories.find((c) => c.id !== category?.id && slug(c.name) === slug(trimmed))
      if (clash) next.name = `A category named "${clash.name}" already exists.`
    }
    if (description.length > DESCRIPTION_MAX) {
      next.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`
    }
    const order = Number(sortOrder)
    if (!Number.isInteger(order) || order < 0 || order > 9999) {
      next.sortOrder = 'Enter a whole number between 0 and 9999.'
    }
    if (!isEdit && chosenParent && chosenParent.status !== 'active' && status === 'active') {
      next.parentId = 'Enable the parent category first, or create this one as disabled.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (busy || !validate()) return

    const form = new FormData()
    form.append('name', name.trim())
    form.append('description', description.trim())
    form.append('parentId', parentId) // '' = top level
    form.append('sortOrder', String(Number(sortOrder)))
    if (!isEdit) form.append('status', status)

    if (iconFile) {
      form.append('iconFile', iconFile)
    } else if (removeIcon) {
      form.append('removeIcon', 'true')
    } else if (iconTab === 'name' && iconName !== (isImageIcon(initialIcon) ? '' : initialIcon)) {
      form.append('icon', iconName)
    }

    onSubmit(form)
  }

  const currentIconValue = iconPreview || (removeIcon ? null : iconName || initialIcon || null)
  const fieldClass = (hasError) =>
    `mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-dcc-primary/30 ${
      hasError ? 'border-rose-400' : 'border-slate-300 focus:border-dcc-primary'
    }`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id="category-form-title" className="text-lg font-bold text-slate-900">
              {isEdit ? 'Edit category' : parentId ? 'Add subcategory' : 'Add category'}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit ? `Update “${category?.name}”.` : 'Create a new marketplace category.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label htmlFor="cat-name" className="block text-sm font-semibold text-slate-800">
                Name
              </label>
              <input
                id="cat-name"
                ref={nameRef}
                value={name}
                maxLength={NAME_MAX}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                placeholder="e.g. Fashion & Goods"
                className={fieldClass(errors.name)}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cat-parent" className="block text-sm font-semibold text-slate-800">
                Parent category
              </label>
              <select
                id="cat-parent"
                value={parentId}
                onChange={(event) => setParentId(event.target.value)}
                disabled={hasChildren}
                className={`${fieldClass(errors.parentId)} bg-white disabled:bg-slate-50 disabled:text-slate-500`}
              >
                <option value="">None (top-level category)</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.status !== 'active' ? ' (disabled)' : ''}
                  </option>
                ))}
              </select>
              {hasChildren ? (
                <p className="mt-1 text-xs text-slate-500">
                  This category has subcategories, so it must stay top-level.
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Categories support one level of subcategories.
                </p>
              )}
              {errors.parentId && (
                <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
                  {errors.parentId}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cat-description" className="block text-sm font-semibold text-slate-800">
                Description <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="cat-description"
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={fieldClass(errors.description)}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="font-semibold text-rose-600">{errors.description}</span>
                <span className="text-slate-400">
                  {description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {!isEdit && (
                <div>
                  <label htmlFor="cat-status" className="block text-sm font-semibold text-slate-800">
                    Status
                  </label>
                  <select
                    id="cat-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className={`${fieldClass(false)} bg-white`}
                  >
                    <option value="active">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="cat-sort" className="block text-sm font-semibold text-slate-800">
                  Display order
                </label>
                <input
                  id="cat-sort"
                  type="number"
                  min={0}
                  max={9999}
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-invalid={Boolean(errors.sortOrder)}
                  className={fieldClass(errors.sortOrder)}
                />
                {errors.sortOrder ? (
                  <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">
                    {errors.sortOrder}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Lower numbers appear first.</p>
                )}
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-slate-800">Icon</legend>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-dcc-primary">
                  <CategoryIcon icon={currentIconValue} name={name} className="h-7 w-7" imageClassName="h-12 w-12 rounded-lg object-cover" />
                </div>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm font-semibold">
                  {[
                    ['name', 'Choose icon'],
                    ['upload', 'Upload image'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIconTab(key)}
                      className={`rounded-md px-3 py-1.5 ${
                        iconTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {(currentIconValue || initialIcon) && !removeIcon && (
                  <button
                    type="button"
                    onClick={clearIcon}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                  </button>
                )}
              </div>

              {iconTab === 'name' ? (
                <div className="mt-3 grid grid-cols-7 gap-2 sm:grid-cols-9" role="radiogroup" aria-label="Icon">
                  {ICON_NAMES.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      role="radio"
                      aria-checked={iconName === icon && !iconFile}
                      aria-label={icon}
                      title={icon}
                      onClick={() => {
                        setIconName(icon)
                        setIconFile(null)
                        setIconPreview(null)
                        setRemoveIcon(false)
                      }}
                      className={`flex h-10 items-center justify-center rounded-lg border text-slate-700 hover:bg-violet-50 ${
                        iconName === icon && !iconFile
                          ? 'border-dcc-primary bg-violet-50 text-dcc-primary'
                          : 'border-slate-200'
                      }`}
                    >
                      <CategoryIcon icon={icon} className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={pickFile}
                    className="sr-only"
                    id="cat-icon-file"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-dcc-primary hover:bg-violet-50"
                  >
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    {iconFile ? iconFile.name : 'Select PNG, JPG or WEBP (max 1 MB)'}
                  </button>
                </div>
              )}
              {errors.icon && (
                <p className="mt-2 text-xs font-semibold text-rose-600" role="alert">
                  {errors.icon}
                </p>
              )}
              {isImageIcon(initialIcon) && !iconFile && !removeIcon && (
                <p className="mt-2 break-all text-xs text-slate-400">Current: {resolveAssetUrl(initialIcon)}</p>
              )}
            </fieldset>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {busy ? 'Saving...' : isEdit ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}