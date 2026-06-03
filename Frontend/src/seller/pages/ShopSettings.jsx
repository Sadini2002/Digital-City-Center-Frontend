import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Store, ShieldAlert, Truck, Mail, Phone, MapPin, Save } from 'lucide-react'

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
  }, [])

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
    }

    localStorage.setItem('dcc_shop_settings', JSON.stringify(settings))
    
    // If shopName changed, optionally update user object shop name too
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name) {
      user.name = shopName
      localStorage.setItem('user', JSON.stringify(user))
    }

    toast.success('Shop settings updated successfully!')
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Section 1: Shop Identity */}
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

      {/* Section 2: Contact Support Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Mail className="h-5 w-5 text-dcc-primary" />
          <h2 className="font-bold text-slate-900">Customer Support Contacts</h2>
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

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" /> Warehouse Address
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

      {/* Section 3: Shipping & Delivery policy */}
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
