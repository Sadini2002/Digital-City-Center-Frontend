import React, { useState, useEffect } from 'react'
import { User, Mail, Shield, ShieldAlert, Key, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('SUPER_ADMIN')
  const [lastLogin, setLastLogin] = useState('')

  useEffect(() => {
    // Read admin user details from localStorage
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}')
    
    setName(adminUser.fullName || adminUser.name || 'Admin User')
    setEmail(adminUser.email || 'admin@digitalcity.lk')
    setRole(adminUser.role || 'SUPER_ADMIN')
    
    const now = new Date()
    setLastLogin(now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [])

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}')
    adminUser.fullName = name
    adminUser.email = email
    localStorage.setItem('admin_user', JSON.stringify(adminUser))
    
    toast.success('Admin profile updated successfully!')
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="h-6 w-6 text-dcc-primary" />
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your administrator details and security credentials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-dcc-primary font-bold text-2xl uppercase">
            {name.charAt(0)}
          </div>
          <h2 className="mt-4 font-bold text-slate-900 text-lg">{name}</h2>
          <p className="text-xs text-slate-500">{email}</p>
          <div className="mt-4 w-full pt-4 border-t border-slate-100 space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-dcc-primary border border-violet-200">
              <Shield className="h-3 w-3" />
              {role.replace('_', ' ')}
            </span>
            <div className="text-[10px] text-slate-400 mt-2">
              <Clock className="h-3 w-3 inline mr-1" />
              Last login: {lastLogin}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-dcc-primary" />
              Profile Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Administrator Role</label>
                <input
                  type="text"
                  value={role.replace('_', ' ')}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Permissions List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-dcc-primary" />
          Role Permissions Overview
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Sellers Management
            </h3>
            <p className="text-xs text-slate-500 mt-1">Approve, reject, and view registrations.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Categories & Orders
            </h3>
            <p className="text-xs text-slate-500 mt-1">Create categories and handle system-wide disputes.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Platform Control
            </h3>
            <p className="text-xs text-slate-500 mt-1">Modify commission rates and platform announcements.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
