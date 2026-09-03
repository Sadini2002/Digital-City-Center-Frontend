import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { validateUploadFile } from '../../utils/fileUploadValidation'
import { Store, ShieldAlert, Truck, Mail, Phone, MapPin, Save, Clock, Image, Globe } from 'lucide-react'

export default function ShopSettings() {
  const [shopName, setShopName] = useState('')
  const [tagline, setTagline] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [flatShipping, setFlatShipping] = useState(350)
  const [expressShipping, setExpressShipping] = useState(600)
  const [leadTime, setLeadTime] = useState(3)
  const [returnPolicy, setReturnPolicy] = useState('7-day return policy for unused products in original packaging.')

  // Operating Hours and Shop media properties
  const [operatingHours, setOperatingHours] = useState('9:00 AM - 6:00 PM (Monday - Saturday)')
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1516876437184-593fda40c7cf?w=150&auto=format&fit=crop&q=60')
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    // Read user details from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Read settings from local storage
    const saved = JSON.parse(localStorage.getItem('dcc_shop_settings') || '{}')
    
    setShopName(saved.shopName || user.name || 'Tech World LK')
    setTagline(saved.tagline || 'Leading premium gadgets & computer accessories importer in Sri Lanka.')
    setEmail(saved.email || user.email || 'support@techworld.lk')
    setPhone(saved.phone || '+94 77 123 4567')
    setAddress(saved.address || '123, Galle Road, Colombo 03')
    setCity(saved.city || 'Colombo')
    setFlatShipping(saved.flatShipping ?? 350)
    setExpressShipping(saved.expressShipping ?? 600)
    setLeadTime(saved.leadTime ?? 3)
    setReturnPolicy(saved.returnPolicy || '7-day return policy for unused products in original packaging.')
    
    setOperatingHours(saved.operatingHours || '9:00 AM - 6:00 PM (Monday - Saturday)')
    setLogo(saved.logo || 'https://images.unsplash.com/photo-1516876437184-593fda40c7cf?w=150&auto=format&fit=crop&q=60')
    setBanner(saved.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60')
  }, [])

  const handleMediaUpload = (type) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateUploadFile(file, {
      label: type === 'logo' ? 'Logo' : 'Banner',
    })
    if (!validation.valid) {
      setUploadError(validation.error)
      toast.error(validation.error)
      e.target.value = ''
      return
    }

    setUploadError('')
    const url = URL.createObjectURL(file)
    if (type === 'logo') setLogo(url)
    if (type === 'banner') setBanner(url)
    toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`)
    e.target.value = ''
  }

  const handleSave = (e) => {
    e.preventDefault()

    const settings = {
      shopName,
      tagline,
      email,
      phone,
      address,
      city,
      flatShipping: Number(flatShipping),
      expressShipping: Number(expressShipping),
      leadTime: Number(leadTime),
      returnPolicy,
      operatingHours,
      logo,
      banner,
    }

    localStorage.setItem('dcc_shop_settings', JSON.stringify(settings))
    
    // If shopName changed, update user object shop name too
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name) {
      user.name = shopName
      localStorage.setItem('user', JSON.stringify(user))
    }

    toast.success('Shop settings updated successfully!')
  }

  // Generate unique shop slug
  const shopSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-12">
      {/* Section 0: Unique Shop Page URL preview */}
      <div className="rounded-xl border border-dcc-primary/20 bg-violet-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Globe className="h-4 w-4 text-dcc-primary shrink-0" />
          <span>Your unique digital shop page is active at:</span>
        </div>
        <span className="font-semibold text-dcc-primary text-xs bg-white px-3 py-1 rounded-md border border-slate-200 truncate">
          digitalcity.lk/shop/{shopSlug}
        </span>
      </div>

      {/* Section 1: Shop Logo & Banner Images */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Image className="h-5 w-5 text-dcc-primary" />
          <h2 className="font-bold text-slate-900">Shop Brand Assets</h2>
        </div>

        {uploadError && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {uploadError}
          </p>
        )}

        <div className="space-y-5">
          {/* Banner Asset */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Shop Banner</label>
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <img src={banner} alt="Shop Banner" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <label className="cursor-pointer rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-white transition shadow">
                  Change Banner
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" onChange={handleMediaUpload('banner')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Logo Asset */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow bg-slate-50 group shrink-0">
              <img src={logo} alt="Shop Logo" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <label className="cursor-pointer text-[10px] text-white font-semibold underline text-center">
                  Edit
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" onChange={handleMediaUpload('logo')} className="hidden" />
                </label>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-slate-900 text-sm">Shop Logo</h3>
              <p className="text-xs text-slate-500">Recommended size: 500x500px square image.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Shop Identity */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Store className="h-5 w-5 text-dcc-primary" />
          <h2 className="font-bold text-slate-900">Shop Profile</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shop Display Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shop Tagline / Description</label>
            <textarea
              rows="3"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>
        </div>
      </section>

      {/* Section 3: Contact, Hours & Physical Location */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Mail className="h-5 w-5 text-dcc-primary" />
          <h2 className="font-bold text-slate-900">Hours & Physical Location</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-400" /> Support Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Phone className="h-3 w-3 text-slate-400" /> Support Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" /> Operating Hours
            </label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              placeholder="e.g. 9:00 AM - 6:00 PM (Mon-Sat)"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" /> City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" /> Warehouse Address (Physical Location)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>
        </div>
      </section>

      {/* Section 4: Shipping & Delivery policy */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Truck className="h-5 w-5 text-dcc-primary" />
          <h2 className="font-bold text-slate-900">Shipping & Delivery Policies</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Flat Shipping Fee (Rs.)</label>
            <input
              type="number"
              value={flatShipping}
              onChange={(e) => setFlatShipping(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Express Shipping (Rs.)</label>
            <input
              type="number"
              value={expressShipping}
              onChange={(e) => setExpressShipping(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Est. Lead Time (Days)</label>
            <input
              type="number"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-slate-400" /> Return / Refund Policy
            </label>
            <textarea
              rows="2"
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
              required
            />
          </div>
        </div>
      </section>

      {/* Buttons */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </form>
  )
}
