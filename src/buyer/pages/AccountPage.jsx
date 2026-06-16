import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Package, User } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import { savedAddresses } from '../data/checkoutData'
import { formatLkr } from '../../components/category/categoryData'
import { getOrders, isOrderDelivered, ORDER_STATUS } from '../utils/orderStorage'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'Order history', icon: Package },
]

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const user = useMemo(() => readUser(), [])
  const orders = useMemo(() => getOrders(), [])

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'My account', to: null },
  ]

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">My account</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your profile, addresses, and orders.</p>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <nav className="flex gap-2 lg:w-52 lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  activeTab === tab.id
                    ? 'bg-dcc-primary text-white'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900">Profile</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Name</dt>
                    <dd className="font-medium text-slate-900">{user.name || 'Buyer'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-slate-900">{user.email || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Role</dt>
                    <dd className="font-medium text-slate-900">{user.role || 'BUYER'}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900">Saved addresses</h2>
                <ul className="mt-4 space-y-3">
                  {savedAddresses.map((addr) => (
                    <li
                      key={addr.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-dcc-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {addr.name} · {addr.phone}
                      </p>
                      <p className="text-sm text-slate-600">
                        {addr.line1}, {addr.line2}, {addr.city}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900">Order history</h2>
                {orders.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">
                    No orders yet.{' '}
                    <Link to="/" className="font-semibold text-dcc-primary hover:underline">
                      Start shopping
                    </Link>
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-slate-100">
                    {orders.map((order) => (
                      <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{order.id}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(order.placedAt).toLocaleDateString('en-LK')} ·{' '}
                            {order.items?.length ?? 0} items
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-bold text-dcc-primary">
                            {formatLkr(order.total)}
                          </span>
                          <Link
                            to={`/order/${order.id}`}
                            className="text-sm font-semibold text-dcc-primary hover:underline"
                          >
                            Track
                          </Link>
                          {(order.status === ORDER_STATUS.CONFIRMED ||
                            order.status === 'confirmed') &&
                            isOrderDelivered(order) && (
                              <Link
                                to={`/order/${order.id}/reviews`}
                                className="text-sm font-semibold text-green-700 hover:underline"
                              >
                                Review products
                              </Link>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
