import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Package, User } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import {
  formatAddressLines,
  getSavedAddresses,
  removeAddress,
  saveAddress,
} from '../data/checkoutData'
import { formatLkr } from '../../components/category/categoryData'
import { getOrders, isOrderDelivered, ORDER_STATUS } from '../utils/orderStorage'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'Order history', icon: Package },
]

const emptyAddress = {
  id: '',
  label: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  district: '',
  postalCode: '',
  isDefault: false,
}

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
  const [addresses, setAddresses] = useState(() => getSavedAddresses())
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const current = getSavedAddresses()
    return current.find((addr) => addr.isDefault)?.id ?? current[0]?.id ?? ''
  })
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [addressError, setAddressError] = useState('')

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'My account', to: null },
  ]

  const isEditing = Boolean(editingAddressId)

  const resetAddressForm = () => {
    setAddressForm(emptyAddress)
    setEditingAddressId(null)
    setAddressError('')
  }

  const handleAddressChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setAddressForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({ ...address })
    setAddressError('')
  }

  const handleDeleteAddress = (id) => {
    const next = removeAddress(id)
    setAddresses(next)
    if (selectedAddressId === id) {
      setSelectedAddressId(next[0]?.id ?? '')
    }
    if (editingAddressId === id) {
      resetAddressForm()
    }
  }

  const validateAddress = (address) => {
    if (!address.label?.trim()) return 'Please add a label for the address.'
    if (!address.name?.trim()) return 'Please enter the contact name.'
    if (!address.phone?.trim()) return 'Please enter the contact phone number.'
    if (!address.line1?.trim()) return 'Please enter at least Address line 1.'
    if (!address.city?.trim()) return 'Please enter the city.'
    if (!address.district?.trim()) return 'Please enter the district.'
    return ''
  }

  const handleSaveAddress = () => {
    const trimmed = {
      ...addressForm,
      label: (addressForm.label || '').trim(),
      name: (addressForm.name || '').trim(),
      phone: (addressForm.phone || '').trim(),
      line1: (addressForm.line1 || '').trim(),
      line2: (addressForm.line2 || '').trim(),
      city: (addressForm.city || '').trim(),
      district: (addressForm.district || '').trim(),
      postalCode: (addressForm.postalCode || '').trim(),
      isDefault: Boolean(addressForm.isDefault),
    }

    const validationError = validateAddress(trimmed)
    if (validationError) {
      setAddressError(validationError)
      return
    }

    const id = editingAddressId ?? `address-${Date.now()}`
    const next = saveAddress({ ...trimmed, id })
    setAddresses(next)
    setSelectedAddressId(id)
    resetAddressForm()
  }

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Saved addresses</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddressId(null)
                      setAddressForm(emptyAddress)
                      setAddressError('')
                    }}
                    className="inline-flex items-center rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
                  >
                    Add new address
                  </button>
                </div>

                <ul className="mt-4 space-y-3">
                  {addresses.length === 0 ? (
                    <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      No addresses saved yet. Use the button above to add one.
                    </li>
                  ) : (
                    addresses.map((addr) => (
                      <li
                        key={addr.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{addr.label}</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {addr.name} · {addr.phone}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {addr.isDefault && (
                              <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-dcc-primary">
                                Default
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleEditAddress(addr)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:border-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                          {formatAddressLines(addr).map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </li>
                    ))
                  )}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {isEditing ? 'Edit address' : 'Add a new address'}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Use this form to update or add a buyer delivery address.
                      </p>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="text-sm font-semibold text-slate-700 hover:underline"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>

                  {addressError && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {addressError}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Label
                      </label>
                      <input
                        type="text"
                        value={addressForm.label}
                        onChange={handleAddressChange('label')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                        placeholder="Home, Office, Parents"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={handleAddressChange('name')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={handleAddressChange('phone')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Postal code
                      </label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={handleAddressChange('postalCode')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Address line 1
                      </label>
                      <input
                        type="text"
                        value={addressForm.line1}
                        onChange={handleAddressChange('line1')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Address line 2
                      </label>
                      <input
                        type="text"
                        value={addressForm.line2}
                        onChange={handleAddressChange('line2')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={handleAddressChange('city')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        id="default-address"
                        type="checkbox"
                        checked={Boolean(addressForm.isDefault)}
                        onChange={(e) => handleAddressChange('isDefault')(e)}
                        className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                      />
                      <label htmlFor="default-address" className="text-sm font-medium text-slate-700">
                        Set as default address
                      </label>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        District
                      </label>
                      <input
                        type="text"
                        value={addressForm.district}
                        onChange={handleAddressChange('district')}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="inline-flex items-center rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
                    >
                      {isEditing ? 'Save address' : 'Add address'}
                    </button>
                    <button
                      type="button"
                      onClick={resetAddressForm}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
                    >
                      Clear form
                    </button>
                  </div>
                </div>
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
