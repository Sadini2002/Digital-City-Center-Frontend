import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
    Check,
    Clock3,
    Image,
    LoaderCircle,
    MapPin,
    Save,
    Store,
    Trash2,
    Upload,
} from 'lucide-react'
import { sellerApi } from '../services/sellerApi'
import { validateUploadFile } from '../../utils/fileUploadValidation'

const DAYS = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
]

const EMPTY_HOURS = DAYS.reduce((hours, day) => {
    hours[day.key] = { open: '09:00', close: '18:00', closed: false }
    return hours
}, {})

const EMPTY_SETTINGS = {
    shopName: '',
    shopUrl: '',
    businessType: '',
    description: '',
    location: '',
    address: '',
    image: null,
    bannerImage: null,
    operatingHours: EMPTY_HOURS,
}

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:5000/api/v1'
).replace(/\/+$/, '')

function getImageUrl(path) {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path

    try {
        const origin = new URL(API_BASE_URL, window.location.origin).origin
        return `${origin}/${String(path).replace(/^\/+/, '')}`
    } catch {
        return `/${String(path).replace(/^\/+/, '')}`
    }
}

function getPayload(response) {
    return response?.data || {}
}

function getSettingsFromResponse(response) {
    const payload = getPayload(response)
    return payload.settings || payload.data?.settings || payload.data || payload
}

function getImageFromResponse(response, field) {
    const payload = getPayload(response)
    const settings = payload.settings || payload.data?.settings || {}

    return (
        settings[field] ||
        payload[field] ||
        payload.data?.[field] ||
        payload.image ||
        payload.imagePath ||
        ''
    )
}

function normalizeHours(hours) {
    return DAYS.reduce((result, day) => {
        const value = hours?.[day.key] || EMPTY_HOURS[day.key]
        const closed = Boolean(value.closed)

        result[day.key] = {
            open: closed ? null : value.open || '09:00',
            close: closed ? null : value.close || '18:00',
            closed,
        }
        return result
    }, {})
}

function normalizeSettings(settings = {}) {
    return {
        ...EMPTY_SETTINGS,
        ...settings,
        shopName: settings.shopName || '',
        shopUrl: settings.shopUrl || '',
        businessType: settings.businessType || '',
        description: settings.description || '',
        location: settings.location || '',
        address: settings.address || '',
        image: settings.image || null,
        bannerImage: settings.bannerImage || null,
        operatingHours: normalizeHours(settings.operatingHours),
    }
}

function getErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.message || fallback
}

function SettingsSkeleton() {
    return (
        <div className="space-y-5" aria-label="Loading shop settings">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white"
                />
            ))}
        </div>
    )
}

function SectionHeader({ icon: Icon, title, description }) {
    return (
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-dcc-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
        </div>
    )
}

function FieldLabel({ children, htmlFor, optional = false }) {
    return (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
            {children}
            {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
        </label>
    )
}

const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-dcc-primary focus:ring-2 focus:ring-dcc-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50'

export default function ShopSettings() {
    const [settings, setSettings] = useState(EMPTY_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pageError, setPageError] = useState('')
    const [validationErrors, setValidationErrors] = useState({})
    const [logoPreview, setLogoPreview] = useState('')
    const [bannerPreview, setBannerPreview] = useState('')
    const [mediaLoading, setMediaLoading] = useState({ logo: '', banner: '' })

    const logoUrl = useMemo(
        () => logoPreview || getImageUrl(settings.image),
        [logoPreview, settings.image],
    )
    const bannerUrl = useMemo(
        () => bannerPreview || getImageUrl(settings.bannerImage),
        [bannerPreview, settings.bannerImage],
    )

    useEffect(() => {
        let mounted = true

        async function loadSettings() {
            try {
                setLoading(true)
                setPageError('')
                const response = await sellerApi.getShopSettings()
                if (mounted) setSettings(normalizeSettings(getSettingsFromResponse(response)))
            } catch (error) {
                if (mounted) setPageError(getErrorMessage(error, 'Unable to load shop settings.'))
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadSettings()

        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => () => {
        if (logoPreview) URL.revokeObjectURL(logoPreview)
    }, [logoPreview])

    useEffect(() => () => {
        if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    }, [bannerPreview])

    const updateField = (field, value) => {
        setSettings((current) => ({ ...current, [field]: value }))
        setValidationErrors((current) => ({ ...current, [field]: '' }))
    }

    const updateDay = (dayKey, field, value) => {
        setSettings((current) => ({
            ...current,
            operatingHours: {
                ...current.operatingHours,
                [dayKey]: { ...current.operatingHours[dayKey], [field]: value },
            },
        }))
        setValidationErrors((current) => ({ ...current, operatingHours: '' }))
    }

    const toggleDay = (dayKey) => {
        const day = settings.operatingHours[dayKey]
        const closed = !day.closed
        setSettings((current) => ({
            ...current,
            operatingHours: {
                ...current.operatingHours,
                [dayKey]: {
                    open: closed ? null : day.open || '09:00',
                    close: closed ? null : day.close || '18:00',
                    closed,
                },
            },
        }))
        setValidationErrors((current) => ({ ...current, operatingHours: '' }))
    }

    const validateSettings = () => {
        const errors = {}
        const shopName = settings.shopName.trim()
        const description = settings.description.trim()

        if (!shopName) errors.shopName = 'Shop name is required.'
        if (shopName.length > 120) errors.shopName = 'Shop name must be 120 characters or fewer.'
        if (description.length < 10) errors.description = 'Description must be at least 10 characters.'
        if (description.length > 1000) errors.description = 'Description must be 1000 characters or fewer.'

        for (const day of DAYS) {
            const hours = settings.operatingHours[day.key]
            if (hours.closed) continue
            if (!hours.open || !hours.close) {
                errors.operatingHours = `${day.label} needs an opening and closing time.`
                break
            }
            if (hours.open >= hours.close) {
                errors.operatingHours = `${day.label} closing time must be later than opening time.`
                break
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSave = async (event) => {
        event.preventDefault()
        if (!validateSettings()) return

        try {
            setSaving(true)
            const response = await sellerApi.updateShopSettings({
                shopName: settings.shopName.trim(),
                description: settings.description.trim(),
                location: settings.location.trim(),
                address: settings.address.trim(),
                operatingHours: DAYS.reduce((hours, day) => {
                    const value = settings.operatingHours[day.key]
                    hours[day.key] = value.closed
                        ? { open: null, close: null, closed: true }
                        : { open: value.open, close: value.close, closed: false }
                    return hours
                }, {}),
            })

            setSettings(normalizeSettings(getSettingsFromResponse(response)))
            setValidationErrors({})
            toast.success('Shop settings saved successfully.')
        } catch (error) {
            toast.error(getErrorMessage(error, 'Unable to save shop settings.'))
        } finally {
            setSaving(false)
        }
    }

    const handleMediaUpload = async (type, event) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        const label = type === 'logo' ? 'Logo' : 'Banner'
        const validation = validateUploadFile(file, { label })
        if (!validation.valid) {
            toast.error(validation.error)
            return
        }

        const previewUrl = URL.createObjectURL(file)
        if (type === 'logo') setLogoPreview(previewUrl)
        if (type === 'banner') setBannerPreview(previewUrl)
        setMediaLoading((current) => ({ ...current, [type]: 'uploading' }))

        try {
            const response = type === 'logo'
                ? await sellerApi.uploadShopLogo(file)
                : await sellerApi.uploadShopBanner(file)
            const field = type === 'logo' ? 'image' : 'bannerImage'
            let uploadedPath = getImageFromResponse(response, field)

            if (!uploadedPath) {
                const settingsResponse = await sellerApi.getShopSettings()
                uploadedPath = getSettingsFromResponse(settingsResponse)[field]
            }

            setSettings((current) => ({ ...current, [field]: uploadedPath || current[field] }))
            if (type === 'logo') setLogoPreview('')
            if (type === 'banner') setBannerPreview('')
            toast.success(`${label} uploaded successfully.`)
        } catch (error) {
            if (type === 'logo') setLogoPreview('')
            if (type === 'banner') setBannerPreview('')
            toast.error(getErrorMessage(error, `Unable to upload ${label.toLowerCase()}.`))
        } finally {
            setMediaLoading((current) => ({ ...current, [type]: '' }))
        }
    }

    const handleMediaRemove = async (type) => {
        const label = type === 'logo' ? 'Logo' : 'Banner'
        setMediaLoading((current) => ({ ...current, [type]: 'deleting' }))

        try {
            if (type === 'logo') await sellerApi.removeShopLogo()
            if (type === 'banner') await sellerApi.removeShopBanner()

            if (type === 'logo') {
                setSettings((current) => ({ ...current, image: null }))
                setLogoPreview('')
            } else {
                setSettings((current) => ({ ...current, bannerImage: null }))
                setBannerPreview('')
            }
            toast.success(`${label} removed successfully.`)
        } catch (error) {
            toast.error(getErrorMessage(error, `Unable to remove ${label.toLowerCase()}.`))
        } finally {
            setMediaLoading((current) => ({ ...current, [type]: '' }))
        }
    }

    const renderMediaSection = (type) => {
        const isLogo = type === 'logo'
        const label = isLogo ? 'Shop logo' : 'Shop banner'
        const imageUrl = isLogo ? logoUrl : bannerUrl
        const loadingState = mediaLoading[type]
        const inputId = `${type}-upload`

        return (
            <div className={isLogo ? '' : 'mt-5'}>
                <div className="mb-2 flex items-center justify-between gap-3">
                    <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                    <span className="text-xs text-slate-400">{isLogo ? 'Square image' : 'Wide image'}</span>
                </div>
                <div className={isLogo
                    ? 'flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center'
                    : 'overflow-hidden rounded-lg border border-dashed border-slate-300'}
                >
                    <div className={isLogo
                        ? 'flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50'
                        : 'flex h-44 items-center justify-center bg-slate-50'}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
                        ) : (
                            <div className="text-center text-slate-400">
                                <Image className="mx-auto h-8 w-8" aria-hidden="true" />
                                <p className="mt-1 text-xs">No {isLogo ? 'logo' : 'banner'} yet</p>
                            </div>
                        )}
                    </div>
                    <div className={isLogo ? 'min-w-0' : 'flex flex-wrap items-center gap-2 p-3'}>
                        <p className="text-sm text-slate-600">
                            {isLogo ? 'Use a clear image that represents your shop.' : 'Use a wide image to introduce your shop.'}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <label
                                htmlFor={inputId}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-dcc-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-dcc-primary-hover has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                            >
                                {loadingState === 'uploading'
                                    ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                                    : <Upload className="h-4 w-4" aria-hidden="true" />}
                                {loadingState === 'uploading' ? 'Uploading...' : imageUrl ? 'Replace' : 'Upload'}
                                <input
                                    id={inputId}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.gif,.avif,image/jpeg,image/png,image/webp,image/gif,image/avif"
                                    onChange={(event) => handleMediaUpload(type, event)}
                                    disabled={Boolean(loadingState)}
                                    className="sr-only"
                                />
                            </label>
                            {imageUrl && (
                                <button
                                    type="button"
                                    onClick={() => handleMediaRemove(type)}
                                    disabled={Boolean(loadingState)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loadingState === 'deleting'
                                        ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                                    {loadingState === 'deleting' ? 'Removing...' : 'Remove'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) return <SettingsSkeleton />

    if (pageError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" role="alert">
                {pageError}
            </div>
        )
    }

    return (
        <form onSubmit={handleSave} className="max-w-4xl space-y-5 pb-12">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader icon={Store} title="Shop profile" description="Keep the public identity of your shop up to date." />
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <FieldLabel htmlFor="shop-name">Shop name</FieldLabel>
                        <input
                            id="shop-name"
                            type="text"
                            value={settings.shopName}
                            onChange={(event) => updateField('shopName', event.target.value)}
                            className={inputClass}
                            aria-invalid={Boolean(validationErrors.shopName)}
                            required
                        />
                        {validationErrors.shopName && <p className="mt-1 text-sm text-red-600">{validationErrors.shopName}</p>}
                    </div>
                    <div>
                        <FieldLabel htmlFor="shop-url">Shop URL / slug</FieldLabel>
                        <input
                            id="shop-url"
                            type="text"
                            value={settings.shopUrl ? `/shop/${settings.shopUrl}` : ''}
                            className={`${inputClass} bg-slate-50 text-slate-500`}
                            readOnly
                            placeholder="Generated after saving"
                        />
                        <p className="mt-1 text-xs text-slate-500">Generated and validated by the backend.</p>
                    </div>
                    <div>
                        <FieldLabel htmlFor="business-type" optional>Business type</FieldLabel>
                        <input
                            id="business-type"
                            type="text"
                            value={settings.businessType}
                            className={`${inputClass} bg-slate-50 text-slate-500`}
                            readOnly
                            placeholder="Not provided"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <FieldLabel htmlFor="description">Shop description</FieldLabel>
                        <textarea
                            id="description"
                            rows={4}
                            value={settings.description}
                            onChange={(event) => updateField('description', event.target.value)}
                            className={`${inputClass} resize-y`}
                            aria-invalid={Boolean(validationErrors.description)}
                            placeholder="Tell customers what makes your shop special."
                            required
                        />
                        <div className="mt-1 flex justify-between gap-3 text-xs text-slate-500">
                            <span>{validationErrors.description || 'Use 10 to 1000 characters.'}</span>
                            <span>{settings.description.length}/1000</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader icon={Image} title="Shop images" description="Use clear images to help customers recognize your shop." />
                <div className="mt-5">{renderMediaSection('logo')}{renderMediaSection('banner')}</div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader icon={MapPin} title="Location" description="Add a physical location if customers need to find your shop." />
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <FieldLabel htmlFor="location" optional>Physical location</FieldLabel>
                        <input
                            id="location"
                            type="text"
                            value={settings.location}
                            onChange={(event) => updateField('location', event.target.value)}
                            className={inputClass}
                            placeholder="e.g. Colombo"
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor="address" optional>Address</FieldLabel>
                        <input
                            id="address"
                            type="text"
                            value={settings.address}
                            onChange={(event) => updateField('address', event.target.value)}
                            className={inputClass}
                            placeholder="Street, city, country"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader icon={Clock3} title="Operating hours" description="Set the times customers can expect your shop to be open." />
                <div className="mt-5 space-y-3">
                    {DAYS.map((day) => {
                        const hours = settings.operatingHours[day.key]
                        return (
                            <div
                                key={day.key}
                                className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-[minmax(8rem,1fr)_auto_minmax(8rem,1fr)_minmax(8rem,1fr)] sm:items-center"
                            >
                                <span className="text-sm font-semibold text-slate-800">{day.label}</span>
                                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={!hours.closed}
                                        onChange={() => toggleDay(day.key)}
                                        className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary"
                                    />
                                    Open
                                </label>
                                <label>
                                    <span className="sr-only">Opening time for {day.label}</span>
                                    <input
                                        type="time"
                                        value={hours.open || ''}
                                        onChange={(event) => updateDay(day.key, 'open', event.target.value)}
                                        disabled={hours.closed}
                                        className={inputClass}
                                    />
                                </label>
                                <label>
                                    <span className="sr-only">Closing time for {day.label}</span>
                                    <input
                                        type="time"
                                        value={hours.close || ''}
                                        onChange={(event) => updateDay(day.key, 'close', event.target.value)}
                                        disabled={hours.closed}
                                        className={inputClass}
                                    />
                                </label>
                            </div>
                        )
                    })}
                </div>
                {validationErrors.operatingHours && (
                    <p className="mt-3 text-sm text-red-600" role="alert">{validationErrors.operatingHours}</p>
                )}
            </section>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving
                        ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                        : <Save className="h-4 w-4" aria-hidden="true" />}
                    {saving ? 'Saving...' : 'Save settings'}
                </button>
            </div>
            <p className="flex items-center justify-end gap-1 text-xs text-slate-400">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Changes apply to your public shop page after saving.
            </p>
        </form>
    )
}