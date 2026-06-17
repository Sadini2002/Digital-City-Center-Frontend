/** BACKEND: GET /users/me — provider/driver status ACTIVE unlocks /delivery */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ban, Clock, XCircle } from 'lucide-react'
import {
  getDeliveryProfileStatus,
  isDeliveryDriverActive,
  isDeliveryProviderActive,
} from '../utils/deliveryAuth'
import { syncUserApprovalFromAdmin } from '../utils/deliveryApplicationStorage'
import { usersApi } from '../../services/api'
import SiteLayout from '../../layouts/SiteLayout'
import PageContainer from '../../components/layout/PageContainer'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function DeliveryApplicationStatusPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(readUser)
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      try {
        const res = await usersApi.getProfile()
        const profile = res.data?.data ?? res.data
        if (profile) {
          localStorage.setItem('user', JSON.stringify(profile))
          if (!cancelled) setUser(profile)
        }
      } catch {
        const synced = syncUserApprovalFromAdmin()
        if (synced && !cancelled) setUser(synced)
      }
      if (!cancelled) {
        const current = readUser()
        const active =
          current?.role === 'DELIVERY_DRIVER'
            ? isDeliveryDriverActive(current)
            : isDeliveryProviderActive(current)
        if (active) navigate('/delivery', { replace: true })
        setRefreshing(false)
      }
    }
    refresh()
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (refreshing) {
    return (
      <SiteLayout className="bg-slate-50">
        <PageContainer className="flex min-h-[40vh] items-center justify-center py-16 text-sm text-slate-500">
          Checking application status…
        </PageContainer>
      </SiteLayout>
    )
  }

  const provider = user?.deliveryProvider
  const driver = user?.deliveryDriver
  const isProvider = user?.role === 'DELIVERY_PROVIDER'
  const isActive = isProvider ? isDeliveryProviderActive(user) : isDeliveryDriverActive(user)
  const status = getDeliveryProfileStatus(user)

  if (isActive) {
    return (
      <SiteLayout className="bg-slate-50">
      <PageContainer className="mx-auto max-w-lg py-16 text-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Account active</h1>
          <p className="mt-2 text-slate-600">Your delivery portal is ready.</p>
          <Link
            to="/delivery"
            className="mt-6 inline-block rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Go to dashboard
          </Link>
        </div>
      </PageContainer>
      </SiteLayout>
    )
  }

  const statusConfig = {
    PENDING: {
      icon: Clock,
      iconClass: 'text-dcc-primary bg-violet-50',
      title: 'Application under review',
      body: isProvider
        ? 'Thank you for registering as a delivery provider. Our team will review your application shortly.'
        : 'Your driver account is pending approval.',
    },
    REJECTED: {
      icon: XCircle,
      iconClass: 'text-red-600 bg-red-50',
      title: 'Application not approved',
      body: provider?.rejectionReason || 'Please contact support for more information.',
    },
    SUSPENDED: {
      icon: Ban,
      iconClass: 'text-red-600 bg-red-50',
      title: 'Account suspended',
      body: provider?.rejectionReason || 'Contact support for assistance.',
    },
  }

  const config = statusConfig[status] || statusConfig.PENDING
  const Icon = config.icon

  const handleRefresh = () => {
    setRefreshing(true)
    const synced = syncUserApprovalFromAdmin()
    if (synced) setUser(synced)
    setRefreshing(false)
    if (isDeliveryProviderActive(synced || user) || isDeliveryDriverActive(synced || user)) {
      navigate('/delivery', { replace: true })
    }
  }

  return (
    <SiteLayout className="bg-slate-50">
    <PageContainer className="mx-auto max-w-lg py-16">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconClass}`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
        <p className="mt-3 text-slate-600">{config.body}</p>
        {provider?.companyName && (
          <p className="mt-2 text-sm text-slate-500">{provider.companyName}</p>
        )}
        {driver?.fullName && <p className="mt-2 text-sm text-slate-500">{driver.fullName}</p>}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh status
          </button>
          <Link
            to="/"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to marketplace
          </Link>
        </div>
      </div>
    </PageContainer>
    </SiteLayout>
  )
}
