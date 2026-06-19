import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SellerProfile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [status, setStatus] = useState('APPROVED')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const savedSettings = JSON.parse(localStorage.getItem('dcc_shop_settings') || '{}')

    setName(user.fullName || user.name || 'Demo Seller')
    setEmail(user.email || 'seller@demo.local')
    setPhone(savedSettings.phone || '+94 77 123 4567')
    setBusinessName(savedSettings.shopName || 'Tech World LK')
    setBusinessType('Electronics & Gadgets')
    setRegNumber('BR-123456')
    setStatus(user.verified ? 'APPROVED' : 'PENDING APPROVAL')
  }, [])

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    // Update local storage user name
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    user.fullName = name
    user.email = email
    localStorage.setItem('user', JSON.stringify(user))

    toast.success('Seller profile updated successfully!')
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header Profile Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-dcc-primary font-bold text-2xl uppercase">
            {name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-500">{email}</p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle className="h-3 w-3" />
                {status}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                Role: Seller/Merchant
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Details Form */}
        <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-dcc-primary" />
            Personal Account Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
            >
              Update Account Info
            </button>
          </div>
        </form>

        {/* Business details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-dcc-primary" />
            Business Verification Info
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Registered Business Name</span>
              <p className="mt-1 font-semibold text-slate-800 bg-slate-50 rounded-lg p-2.5 border border-slate-200">{businessName}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Business Category</span>
              <p className="mt-1 font-semibold text-slate-800 bg-slate-50 rounded-lg p-2.5 border border-slate-200">{businessType}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block flex items-center gap-1">
                <FileText className="h-3 w-3 text-slate-400" /> BRN / NIC Number
              </span>
              <p className="mt-1 font-semibold text-slate-800 bg-slate-50 rounded-lg p-2.5 border border-slate-200">{regNumber}</p>
            </div>

            <div className="rounded-xl bg-violet-50/50 border border-violet-100 p-4 text-xs text-slate-600">
              💡 <strong>Verification Note:</strong> Your business verification details are verified by DCC administrators. If you need to update registration files or request role changes, please contact support.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
