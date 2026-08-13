
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Package,
  Heart,
  Bell,
  LogOut,
  Edit3,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

import { usersApi } from '../../services/api'
import { getAuthToken, clearAuthToken, } from '../../utils/authStorage'

export default function AccountPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const token = getAuthToken()

      /*
       * If there is no authentication token,
       * the user is not logged in.
       */
      if (!token) {
        navigate('/login', {
          replace: true,
        })
        return
      }

      /*
       * Get the real user from the backend.
       */
      const response = await usersApi.getProfile()

      const profile =
        response?.data?.user ||
        response?.data?.data ||
        response?.data

      if (!profile) {
        throw new Error(
          'Unable to load your account.'
        )
      }

      setUser(profile)

      /*
       * Keep localStorage synchronized.
       */
      localStorage.setItem(
        'user',
        JSON.stringify(profile)
      )
    } catch (err) {
      console.error(
        'Account profile error:',
        err
      )

      /*
       * If authentication has expired,
       * send the user back to login.
       */
      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        clearAuthToken()
        localStorage.removeItem('user')

        navigate('/login', {
          replace: true,
        })

        return
      }

      /*
       * Fallback to locally stored user.
       */
      try {
        const savedUser =
          localStorage.getItem('user')

        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load your account.'
          )
        }
      } catch {
        setError(
          'Unable to load your account.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem('user')

    navigate('/login', {
      replace: true,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />

          <p className="text-sm text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            Unable to load account
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="mt-5 rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName =
    user.name || 'User'

  const displayEmail =
    user.email || 'No email available'

  const displayPhone =
    user.phone || 'Not added'

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page heading */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information,
            orders and account settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* =================================================
              LEFT SIDEBAR
          ================================================== */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* User summary */}

            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-dcc-primary text-lg font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-900">
                    {displayName}
                  </h2>

                  <p className="truncate text-sm text-slate-500">
                    {displayEmail}
                  </p>
                </div>

              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <ShieldCheck className="h-3.5 w-3.5" />

                {user.verified
                  ? 'Verified account'
                  : 'Email not verified'}
              </div>
            </div>

            {/* Navigation */}

            <nav className="p-3">

              <Link
                to="/account"
                className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-dcc-primary"
              >
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4" />
                  Profile
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/order"
                className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  My Orders
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/wishlist"
                className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/notifications"
                className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <Bell className="h-4 w-4" />
                  Notifications
                </span>

                <ChevronRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <span className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>

                <ChevronRight className="h-4 w-4" />
              </button>

            </nav>
          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================== */}

          <main className="space-y-6">

            {/* Profile card */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your account details.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>

              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">

                {/* Name */}

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {displayName}
                  </p>
                </div>

                {/* Email */}

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                    Email Address
                  </div>

                  <p className="break-all text-sm font-medium text-slate-900">
                    {displayEmail}
                  </p>
                </div>

                {/* Phone */}

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {displayPhone}
                  </p>
                </div>

                {/* Account type */}

                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Account Type
                  </div>

                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {String(
                      user.role || 'buyer'
                    ).toLowerCase()}
                  </span>
                </div>

              </div>
            </section>

            {/* Quick actions */}

            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Quick Access
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <Link
                  to="/orders"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Package className="h-5 w-5" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-slate-500" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    My Orders
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    View your purchases and order status.
                  </p>
                </Link>

                <Link
                  to="/wishlist"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                      <Heart className="h-5 w-5" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-slate-500" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    Wishlist
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    View products you saved.
                  </p>
                </Link>

                <Link
                  to="/notifications"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Bell className="h-5 w-5" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-slate-500" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Check your latest notifications.
                  </p>
                </Link>

              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}

