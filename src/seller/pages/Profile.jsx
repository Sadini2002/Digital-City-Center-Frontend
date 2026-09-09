import React, { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { sellerApi } from '../services/sellerApi'

export default function SellerProfile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [regNumber, setRegNumber] = useState('')

  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Load seller profile directly from backend
  const loadSellerProfile = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const response = await sellerApi.getMe()

      const data = response.data || {}

      console.log('Seller profile response:', data)

      /*
       * Depending on your backend response structure,
       * seller may be inside data.seller or directly in data.
       */
      const seller = data.seller || data
      const owner = seller.owner || seller.user || data.user || {}

      // Personal information
      setName(
        owner.name ||
        owner.fullName ||
        data.name ||
        'Seller'
      )

      setEmail(
        owner.email ||
        data.email ||
        ''
      )

      setPhone(
        owner.phone ||
        data.phone ||
        seller.phone ||
        ''
      )

      // Business information
      setBusinessName(
        seller.shopName ||
        seller.businessName ||
        ''
      )

      setBusinessType(
        seller.businessType ||
        ''
      )

      setRegNumber(
        seller.registrationNumber ||
        seller.regNumber ||
        seller.brn ||
        seller.nicNumber ||
        ''
      )

      // IMPORTANT:
      // Seller approval comes from Seller.status
      const sellerStatus = String(
        seller.status ||
        data.status ||
        'pending'
      ).toUpperCase()

      setStatus(sellerStatus)

      // Keep localStorage user information updated
      const storedUser = JSON.parse(
        localStorage.getItem('user') || '{}'
      )

      const updatedUser = {
        ...storedUser,
        name: owner.name || storedUser.name,
        fullName: owner.name || storedUser.fullName,
        email: owner.email || storedUser.email,
        phone: owner.phone || storedUser.phone,
        sellerStatus: sellerStatus,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    } catch (error) {
      console.error('Failed to load seller profile:', error)

      const message =
        error.response?.data?.message ||
        'Failed to load seller profile.'

      toast.error(message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadSellerProfile()
  }, [])

  const handleRefresh = async () => {
    await loadSellerProfile({ showLoader: false })
    toast.success('Seller status refreshed.')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      /*
       * At the moment your backend may not have a seller profile
       * update endpoint.
       *
       * Therefore we update the local user information here.
       *
       * If you create a backend update endpoint later,
       * replace this section with sellerApi.updateProfile(...)
       */

      const user = JSON.parse(
        localStorage.getItem('user') || '{}'
      )

      const updatedUser = {
        ...user,
        name,
        fullName: name,
        email,
        phone,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      toast.success('Seller profile updated successfully!')

      // Reload latest backend information
      await loadSellerProfile({ showLoader: false })
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile.')
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'APPROVED',
          icon: CheckCircle,
          container:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconColor: 'text-emerald-600',
        }

      case 'REJECTED':
        return {
          label: 'REJECTED',
          icon: XCircle,
          container:
            'bg-red-50 text-red-700 border-red-200',
          iconColor: 'text-red-600',
        }

      case 'PENDING':
      case 'PENDING APPROVAL':
      default:
        return {
          label: 'PENDING APPROVAL',
          icon: Clock,
          container:
            'bg-amber-50 text-amber-700 border-amber-200',
          iconColor: 'text-amber-600',
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-dcc-primary" />
          <p className="text-sm text-slate-500">
            Loading seller profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">

      {/* =========================
          PROFILE HEADER
      ========================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row">

          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold uppercase text-dcc-primary">
            {name?.charAt(0) || 'S'}
          </div>

          {/* Profile information */}
          <div className="flex-1 text-center sm:text-left">

            <h1 className="text-xl font-bold text-slate-900">
              {name || 'Seller'}
            </h1>

            <p className="text-sm text-slate-500">
              {email || 'No email available'}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">

              {/* Status */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.container}`}
              >
                <StatusIcon
                  className={`h-3 w-3 ${statusConfig.iconColor}`}
                />

                {statusConfig.label}
              </span>

              {/* Role */}
              <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Role: Seller/Merchant
              </span>

            </div>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />

            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>

        </div>
      </div>

      {/* =========================
          PENDING MESSAGE
      ========================== */}
      {status === 'PENDING' ||
      status === 'PENDING APPROVAL' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <h3 className="font-semibold text-amber-900">
                Seller approval is pending
              </h3>

              <p className="mt-1 text-sm text-amber-800">
                Your seller application is currently waiting
                for administrator approval. Once approved,
                you will be able to access the seller dashboard
                and seller management features.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================
          REJECTED MESSAGE
      ========================== */}
      {status === 'REJECTED' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <h3 className="font-semibold text-red-900">
                Seller application rejected
              </h3>

              <p className="mt-1 text-sm text-red-800">
                Your seller application has been rejected.
                Please contact the DCC administration team for
                more information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* =========================
            PERSONAL DETAILS
        ========================== */}
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
            <User className="h-5 w-5 text-dcc-primary" />
            Personal Account Information
          </h2>

          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm transition focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm transition focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Contact Phone
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm transition focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
                  required
                />
              </div>
            </div>

            {/* Update */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover"
            >
              Update Account Info
            </button>

          </div>
        </form>

        {/* =========================
            BUSINESS DETAILS
        ========================== */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
            <Shield className="h-5 w-5 text-dcc-primary" />
            Business Verification Info
          </h2>

          <div className="space-y-4 text-sm">

            {/* Business Name */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                Registered Business Name
              </span>

              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800">
                {businessName || 'Not provided'}
              </p>
            </div>

            {/* Business Type */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                Business Category
              </span>

              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800">
                {businessType || 'Not provided'}
              </p>
            </div>

            {/* Registration number */}
            <div>
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                <FileText className="h-3 w-3" />
                BRN / NIC Number
              </span>

              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800">
                {regNumber || 'Not provided'}
              </p>
            </div>

            {/* Verification note */}
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-xs text-slate-600">
              <strong>Verification Note:</strong>{' '}
              Your seller verification status is retrieved
              directly from the DCC server. If an administrator
              approves your seller account, click{' '}
              <strong>Refresh Status</strong> to load the latest
              status.
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}