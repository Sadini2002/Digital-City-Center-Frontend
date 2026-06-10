import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MapPin, Truck } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import CheckoutSection from '../components/checkout/CheckoutSection'
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary'
import { useShop } from '../hooks/useShop'
import {
  deliveryMethods,
  formatAddressLines,
  generateOrderId,
  getDeliveryFee,
  isOnlinePayment,
  paymentMethods,
  savedAddresses,
} from '../data/checkoutData'
import { placeOrder } from '../services/paymentService'
import { formatLkr } from '../../components/category/categoryData'
import { getPlatformSettings } from '../../admin/utils/adminStorage'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: null },
]

const emptyAddress = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  district: '',
  postalCode: '',
}

function getBuyerEmail() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.email || ''
  } catch {
    return ''
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, clearCart } = useShop()

  const defaultAddress = savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id

  const [addressMode, setAddressMode] = useState(defaultAddress ? 'saved' : 'new')
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress || '')
  const [newAddress, setNewAddress] = useState(emptyAddress)
  const [deliveryMethod, setDeliveryMethod] = useState('platform')
  const [paymentMethod, setPaymentMethod] = useState('onepay')
  const [email, setEmail] = useState(getBuyerEmail)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const selectedSaved = savedAddresses.find((a) => a.id === selectedAddressId)

  const resolveAddress = () => {
    if (addressMode === 'saved' && selectedSaved) {
      return selectedSaved
    }
    return { id: 'new', label: 'Delivery', ...newAddress }
  }

  const getCalculatedFee = (methodId) => {
    if (methodId === 'pickup') return 0

    const settings = getPlatformSettings()
    
    if (settings.freeThreshold && subtotal >= Number(settings.freeThreshold)) {
      return 0
    }

    if (settings.pricingModel === 'flat') {
      return Number(settings.flatFee || 0)
    }

    // Distance-based pricing
    const baseFee = Number(settings.baseFee || 0)
    const perKmFee = Number(settings.perKmFee || 0)
    const outOfColomboFee = Number(settings.outOfColomboFee || 0)

    const addr = resolveAddress()
    const district = (addr.district || addr.city || '').trim().toLowerCase()
    
    let distance = 10 // default
    if (district === 'colombo') {
      distance = 5
    } else if (district === 'gampaha') {
      distance = 25
    } else if (district === 'kalutara') {
      distance = 40
    } else if (district === 'kandy') {
      distance = 115
    } else if (district) {
      let hash = 0
      for (let i = 0; i < district.length; i++) {
        hash += district.charCodeAt(i)
      }
      distance = 15 + (hash % 85)
    }

    const isOutOfColombo = district !== 'colombo'
    const surcharge = isOutOfColombo ? outOfColomboFee : 0

    return baseFee + (distance * perKmFee) + surcharge
  }

  const deliveryFee = getCalculatedFee(deliveryMethod)
  const total = subtotal + deliveryFee

  const validate = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Enter a valid email for your order confirmation.'
    }
    const addr = resolveAddress()
    if (!addr.name?.trim() || !addr.phone?.trim() || !addr.line1?.trim() || !addr.city?.trim()) {
      return 'Please complete your delivery address.'
    }

    const settings = getPlatformSettings()
    
    // Check keywords
    const keywords = (settings.unsupportedKeywords || '')
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean)
      
    const addressString = `${addr.line1} ${addr.line2 || ''} ${addr.city} ${addr.district || ''} ${addr.postalCode || ''}`.toLowerCase()
    
    for (const kw of keywords) {
      if (addressString.includes(kw)) {
        return `Delivery is not supported for the specified address (matched restricted keyword: "${kw}").`
      }
    }

    // Check coverage areas
    const coverage = settings.coverageAreas || []
    if (coverage.length > 0) {
      const districtLower = (addr.district || addr.city || '').trim().toLowerCase()
      const isCovered = coverage.some(area => area.trim().toLowerCase() === districtLower)
      if (!isCovered && deliveryMethod !== 'pickup') {
        return `Delivery is not supported in ${addr.district || addr.city || 'your area'}. We only deliver to: ${coverage.join(', ')}.`
      }
    }

    return ''
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const orderId = generateOrderId()
      const order = {
        id: orderId,
        email: email.trim(),
        address: resolveAddress(),
        deliveryMethod,
        paymentMethod,
        items: [...cart],
        subtotal,
        deliveryFee,
        total,
        placedAt: new Date().toISOString(),
      }

      const result = await placeOrder(order)

      if (result.requiresGateway) {
        setSubmitting(false)
        navigate(`${result.gatewayUrl}?method=${paymentMethod}`, { replace: true })
        return
      }

      clearCart()
      setSubmitting(false)
      navigate(`/order/${orderId}/success`, { replace: true })
    } catch {
      setError('Could not place your order. Please try again.')
      setSubmitting(false)
    }
  }

  const updateNewAddress = (field) => (e) => {
    setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-slate-600">Review your order and complete payment.</p>

        <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <CheckoutSection title="Delivery address" step={1}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddressMode('saved')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    addressMode === 'saved'
                      ? 'bg-dcc-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Saved addresses
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode('new')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    addressMode === 'new'
                      ? 'bg-dcc-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  New address
                </button>
              </div>

              {addressMode === 'saved' ? (
                <ul className="mt-4 space-y-3">
                  {savedAddresses.map((addr) => (
                    <li key={addr.id}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                          selectedAddressId === addr.id
                            ? 'border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-dcc-primary" />
                            <span className="font-semibold text-slate-900">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-dcc-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{addr.name} · {addr.phone}</p>
                          {formatAddressLines(addr).map((line) => (
                            <p key={line} className="text-sm text-slate-600">
                              {line}
                            </p>
                          ))}
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={updateNewAddress('name')}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={updateNewAddress('phone')}
                      className={inputClass}
                      placeholder="+94 77 000 0000"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={updateNewAddress('postalCode')}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Address line 1
                    </label>
                    <input
                      type="text"
                      value={newAddress.line1}
                      onChange={updateNewAddress('line1')}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Address line 2
                    </label>
                    <input
                      type="text"
                      value={newAddress.line2}
                      onChange={updateNewAddress('line2')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={updateNewAddress('city')}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      District
                    </label>
                    <input
                      type="text"
                      value={newAddress.district}
                      onChange={updateNewAddress('district')}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              )}
            </CheckoutSection>

            <CheckoutSection title="Delivery method" step={2}>
              <ul className="space-y-3">
                {deliveryMethods.map((method) => (
                  <li key={method.id}>
                    <label
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                        deliveryMethod === method.id
                          ? 'border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === method.id}
                        onChange={() => setDeliveryMethod(method.id)}
                        className="mt-1 h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                      />
                      <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-dcc-primary" />
                            <span className="font-semibold text-slate-900">{method.label}</span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{method.description}</p>
                          <p className="mt-1 text-xs text-slate-500">{method.eta}</p>
                        </div>
                        <span className="text-sm font-bold text-dcc-primary">
                          {getCalculatedFee(method.id) === 0 ? 'Free' : `LKR ${getCalculatedFee(method.id).toLocaleString('en-LK')}`}
                        </span>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </CheckoutSection>

            <CheckoutSection title="Payment method" step={3}>
              <p className="mb-4 text-sm text-slate-600">
                Choose how you would like to pay. Online methods redirect to a secure gateway page.
              </p>

              <ul className="space-y-3">
                {paymentMethods.map((method) => (
                  <li key={method.id}>
                    <label
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                        paymentMethod === method.id
                          ? 'border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-md bg-gradient-to-r px-2 py-0.5 text-xs font-bold text-white ${method.accent}`}
                          >
                            {method.label}
                          </span>
                          {!method.online && (
                            <span className="text-[10px] font-semibold uppercase text-slate-500">
                              No online payment
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{method.description}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Confirmation email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  {isOnlinePayment(paymentMethod)
                    ? 'Sent automatically after your gateway payment is confirmed.'
                    : 'Sent when you place your Cash on Delivery order.'}
                </p>
              </div>
            </CheckoutSection>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <CheckoutOrderSummary cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} />

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-dcc-primary py-3.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? 'Placing order…'
                : isOnlinePayment(paymentMethod)
                  ? `Place Order · ${formatLkr(total)}`
                  : 'Place Order'}
            </button>

            <Link
              to="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </div>
        </form>
      </PageContainer>
    </div>
  )
}
