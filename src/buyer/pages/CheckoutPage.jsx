import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MapPin, Truck } from 'lucide-react'
import axios from 'axios'

import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'

import CheckoutSection from '../components/checkout/CheckoutSection'
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary'

import { useShop } from '../hooks/useShop'

import {
  deliveryMethods,
  formatAddressLines,
  isOnlinePayment,
  paymentMethods,
} from '../data/checkoutData'

import { getSavedAddresses, saveAddress } from '../utils/addressStorage'

import { placeOrder } from '../services/paymentService'
import { formatLkr } from '../../components/category/categoryData'
import { getPlatformSettings } from '../../admin/utils/adminStorage'
import { addBuyerNotification } from '../../utils/notificationStorage'


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
    const user =
      JSON.parse(
        localStorage.getItem('user') || '{}',
      )

    return user.email || ''
  } catch {
    return ''
  }
}


export default function CheckoutPage() {
  const navigate = useNavigate()

  const {
    cart,
    clearCart,
  } = useShop()


  // =====================================================
  // ADDRESS STATE
  // =====================================================

  const [savedAddressesList, setSavedAddressesList] = useState(getSavedAddresses)

  const defaultAddress =
    savedAddressesList.find(
      (address) => address.isDefault,
    )?.id ??
    savedAddressesList[0]?.id

  const [
    addressMode,
    setAddressMode,
  ] = useState(
    defaultAddress
      ? 'saved'
      : 'new',
  )

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(
    defaultAddress || '',
  )

  const [
    newAddress,
    setNewAddress,
  ] = useState(
    emptyAddress,
  )

  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const handleSaveNewAddress = async () => {
    if (!newAddress.name?.trim() || !newAddress.phone?.trim() || !newAddress.line1?.trim() || !newAddress.city?.trim()) {
      setError('Please complete all required fields (Full name, Phone, Address line 1, City).')
      return
    }

    setError('')
    setIsSavingAddress(true)

    try {
      const { createdAddress, updatedList } = saveAddress(newAddress)

      try {
        await axios.post('/api/addresses', {
          label: createdAddress.label || 'Home',
          addressLine: `${createdAddress.line1}${createdAddress.line2 ? ', ' + createdAddress.line2 : ''}`,
          city: createdAddress.city,
          phone: createdAddress.phone,
        })
      } catch (err) {
        console.warn('Backend API /api/addresses unavailable, address saved locally:', err)
      }

      setSavedAddressesList(updatedList)
      setSelectedAddressId(createdAddress.id)
      setAddressMode('saved')
      setNewAddress(emptyAddress)
    } catch (err) {
      console.error('Failed to save address:', err)
      setError('Failed to save address. Please try again.')
    } finally {
      setIsSavingAddress(false)
    }
  }


  // =====================================================
  // CHECKOUT STATE
  // =====================================================

  const [
    deliveryMethod,
    setDeliveryMethod,
  ] = useState('platform')


  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState('cod')


  const [
    email,
    setEmail,
  ] = useState(
    getBuyerEmail,
  )


  const [
    error,
    setError,
  ] = useState('')


  const [
    submitting,
    setSubmitting,
  ] = useState(false)


  // =====================================================
  // CART TOTAL
  // =====================================================

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
          Number(item.quantity || 0),

        0,
      ),

    [cart],
  )


  /*
   * Do not redirect while an order is
   * being submitted because clearCart()
   * temporarily makes cart.length = 0.
   */
  if (
    cart.length === 0 &&
    !submitting
  ) {
    return (
      <Navigate
        to="/cart"
        replace
      />
    )
  }


  // =====================================================
  // ADDRESS
  // =====================================================

  const selectedSaved =
    savedAddressesList.find(
      (address) =>
        address.id ===
        selectedAddressId,
    )


  const resolveAddress = () => {
    if (
      addressMode === 'saved' &&
      selectedSaved
    ) {
      return selectedSaved
    }

    return {
      id: 'new',
      label: 'Delivery',
      ...newAddress,
    }
  }


  // =====================================================
  // DELIVERY PRICING
  //
  // IMPORTANT:
  // Keep these values synchronized with
  // backend orderControllers.js
  // =====================================================

  const getCalculatedFee = (
    methodId,
  ) => {
    // Seller pickup is always free
    if (
      methodId === 'pickup'
    ) {
      return 0
    }

    // Free delivery threshold
    if (
      subtotal >= 10000
    ) {
      return 0
    }

    // Third-party courier
    if (
      methodId === 'courier'
    ) {
      return 550
    }

    // Platform delivery
    return 350
  }


  const deliveryFee =
    getCalculatedFee(
      deliveryMethod,
    )


  const total =
    subtotal +
    deliveryFee


  // =====================================================
  // REAL-TIME ADDRESS WARNING
  // =====================================================

  const getValidationWarning =
    () => {

      const addr =
        resolveAddress()


      if (
        !addr.line1?.trim() &&
        !addr.city?.trim() &&
        !addr.district?.trim()
      ) {
        return ''
      }


      const settings =
        getPlatformSettings()


      // ---------------------------------
      // Restricted keywords
      // ---------------------------------

      const keywords =
        (
          settings
            .unsupportedKeywords ||
          ''
        )
          .split(',')
          .map(
            (keyword) =>
              keyword
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean)


      const addressString =
        `
        ${addr.line1 || ''}
        ${addr.line2 || ''}
        ${addr.city || ''}
        ${addr.district || ''}
        ${addr.postalCode || ''}
        `.toLowerCase()


      for (
        const keyword of keywords
      ) {
        if (
          addressString.includes(
            keyword,
          )
        ) {
          return (
            `Delivery is not supported for the specified address ` +
            `(matched restricted keyword: "${keyword}").`
          )
        }
      }


      // ---------------------------------
      // Delivery coverage
      // ---------------------------------

      const coverage =
        settings.coverageAreas ||
        []


      if (
        coverage.length > 0 &&
        deliveryMethod !==
        'pickup'
      ) {

        const district =
          (
            addr.district ||
            addr.city ||
            ''
          )
            .trim()
            .toLowerCase()


        const isCovered =
          coverage.some(
            (area) =>
              area
                .trim()
                .toLowerCase() ===
              district,
          )


        if (!isCovered) {
          return (
            `Delivery is not supported in ` +
            `${addr.district || addr.city || 'your area'}. ` +
            `We only deliver to: ${coverage.join(', ')}.`
          )
        }
      }


      return ''
    }


  // =====================================================
  // CHECKOUT VALIDATION
  // =====================================================

  const validate = () => {

    // ---------------------------------
    // Email
    // ---------------------------------

    if (
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      return (
        'Enter a valid email for your order confirmation.'
      )
    }


    // ---------------------------------
    // Address
    // ---------------------------------

    const addr =
      resolveAddress()


    if (
      !addr.name?.trim() ||
      !addr.phone?.trim() ||
      !addr.line1?.trim() ||
      !addr.city?.trim()
    ) {
      return (
        'Please complete your delivery address.'
      )
    }


    const settings =
      getPlatformSettings()


    // ---------------------------------
    // Restricted keywords
    // ---------------------------------

    const keywords =
      (
        settings
          .unsupportedKeywords ||
        ''
      )
        .split(',')
        .map(
          (keyword) =>
            keyword
              .trim()
              .toLowerCase(),
        )
        .filter(Boolean)


    const addressString =
      `
      ${addr.line1}
      ${addr.line2 || ''}
      ${addr.city}
      ${addr.district || ''}
      ${addr.postalCode || ''}
      `.toLowerCase()


    for (
      const keyword of keywords
    ) {

      if (
        addressString.includes(
          keyword,
        )
      ) {
        return (
          `Delivery is not supported for the specified address ` +
          `(matched restricted keyword: "${keyword}").`
        )
      }
    }


    // ---------------------------------
    // Coverage area
    // ---------------------------------

    const coverage =
      settings.coverageAreas ||
      []


    if (
      coverage.length > 0 &&
      deliveryMethod !==
      'pickup'
    ) {

      const district =
        (
          addr.district ||
          addr.city ||
          ''
        )
          .trim()
          .toLowerCase()


      const isCovered =
        coverage.some(
          (area) =>
            area
              .trim()
              .toLowerCase() ===
            district,
        )


      if (!isCovered) {
        return (
          `Delivery is not supported in ` +
          `${addr.district || addr.city || 'your area'}. ` +
          `We only deliver to: ${coverage.join(', ')}.`
        )
      }
    }


    return ''
  }


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder =
    async (event) => {

      event.preventDefault()


      const validationError =
        validate()


      if (validationError) {

        setError(
          validationError,
        )

        return
      }


      // ---------------------------------
      // Supported payment methods
      // ---------------------------------

      if (
        paymentMethod !==
        'cod' &&
        paymentMethod !==
        'payhere'
      ) {

        setError(
          'This payment method is not available yet. Please choose Cash on Delivery or PayHere.',
        )

        return
      }


      setError('')
      setSubmitting(true)


      try {

        const order = {

          email:
            email.trim(),

          address:
            resolveAddress(),

          deliveryMethod,

          paymentMethod,

          items:
            [...cart],

          subtotal,

          deliveryFee,

          total,

          placedAt:
            new Date()
              .toISOString(),

        }


        // ---------------------------------
        // REAL BACKEND CHECKOUT
        // ---------------------------------

        const result =
          await placeOrder(
            order,
          )


        const realOrderId =
          result.orderId ||
          result.order
            ?.backendOrderId ||
          result.order
            ?.id


        // ---------------------------------
        // Notification
        // ---------------------------------

        addBuyerNotification(

          'Order Confirmed',

          `Your order ${result.order
            ?.orderNumber ||
          realOrderId
          } has been placed successfully.`,

          'success',

        )


        // ---------------------------------
        // Online payment
        // ---------------------------------

        if (
          result.requiresGateway
        ) {

          setSubmitting(false)

          navigate(
            `${result.gatewayUrl}?method=${paymentMethod}`,
            {
              replace: true,
            },
          )

          return
        }


        // ---------------------------------
        // COD
        // ---------------------------------

        await clearCart()


        /*
         * Do NOT set submitting to false
         * before navigation.
         *
         * Otherwise the empty cart redirect
         * sends the user to /cart.
         */
        navigate(
          `/order/${realOrderId}/success`,
          {
            replace: true,
          },
        )


      } catch (err) {

        console.error(
          'Checkout error:',
          err,
        )


        setError(

          err?.response
            ?.data
            ?.message ||

          err?.message ||

          'Could not place your order. Please try again.',

        )


        setSubmitting(false)
      }
    }


  // =====================================================
  // ADDRESS FIELD UPDATE
  // =====================================================

  const updateNewAddress =
    (field) =>
      (event) => {

        setNewAddress(
          (previous) => ({
            ...previous,
            [field]:
              event.target.value,
          }),
        )

      }


  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-w-0 bg-slate-50/50">

      <PageContainer className="pb-12">

        <ProductBreadcrumbs
          items={breadcrumbs}
        />


        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Checkout
        </h1>


        <p className="mt-1 text-sm text-slate-600">
          Review your order and complete payment.
        </p>


        <form
          onSubmit={
            handlePlaceOrder
          }
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6">


            {/* ===============================================
                DELIVERY ADDRESS
            =============================================== */}

            <CheckoutSection
              title="Delivery address"
              step={1}
            >

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setAddressMode(
                      'saved',
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${addressMode ===
                    'saved'
                    ? 'bg-dcc-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Saved addresses
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setAddressMode(
                      'new',
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${addressMode ===
                    'new'
                    ? 'bg-dcc-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  New address
                </button>

              </div>


              {addressMode ===
                'saved' ? (

                <ul className="mt-4 space-y-3">

                  {savedAddressesList.map(
                    (addr) => (

                      <li
                        key={
                          addr.id
                        }
                      >

                        <label
                          className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${selectedAddressId ===
                            addr.id

                            ? 'border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'

                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >

                          <input
                            type="radio"
                            name="address"
                            checked={
                              selectedAddressId ===
                              addr.id
                            }
                            onChange={() =>
                              setSelectedAddressId(
                                addr.id,
                              )
                            }
                            className="w-4 h-4 mt-1 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                          />


                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <MapPin className="w-4 h-4 text-dcc-primary" />


                              <span className="font-semibold text-slate-900">
                                {
                                  addr.label
                                }
                              </span>


                              {addr.isDefault && (

                                <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-dcc-primary">
                                  Default
                                </span>

                              )}

                            </div>


                            <p className="mt-1 text-sm text-slate-600">

                              {
                                addr.name
                              }{' '}
                              ·{' '}
                              {
                                addr.phone
                              }

                            </p>


                            {formatAddressLines(
                              addr,
                            ).map(
                              (
                                line,
                              ) => (

                                <p
                                  key={
                                    line
                                  }
                                  className="text-sm text-slate-600"
                                >
                                  {
                                    line
                                  }
                                </p>

                              ),
                            )}

                          </div>

                        </label>

                      </li>

                    ),
                  )}

                </ul>

              ) : (

                <div className="grid gap-3 mt-4 sm:grid-cols-2">


                  <div className="sm:col-span-2">

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      Full name
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.name
                      }
                      onChange={
                        updateNewAddress(
                          'name',
                        )
                      }
                      className={
                        inputClass
                      }
                      required
                    />

                  </div>


                  <div>

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={
                        newAddress.phone
                      }
                      onChange={
                        updateNewAddress(
                          'phone',
                        )
                      }
                      className={
                        inputClass
                      }
                      placeholder="+94 77 000 0000"
                      required
                    />

                  </div>


                  <div>

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      Postal code
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.postalCode
                      }
                      onChange={
                        updateNewAddress(
                          'postalCode',
                        )
                      }
                      className={
                        inputClass
                      }
                    />

                  </div>


                  <div className="sm:col-span-2">

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      Address line 1
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.line1
                      }
                      onChange={
                        updateNewAddress(
                          'line1',
                        )
                      }
                      className={
                        inputClass
                      }
                      required
                    />

                  </div>


                  <div className="sm:col-span-2">

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      Address line 2
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.line2
                      }
                      onChange={
                        updateNewAddress(
                          'line2',
                        )
                      }
                      className={
                        inputClass
                      }
                    />

                  </div>


                  <div>

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      City
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.city
                      }
                      onChange={
                        updateNewAddress(
                          'city',
                        )
                      }
                      className={
                        inputClass
                      }
                      required
                    />

                  </div>


                  <div>

                    <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                      District
                    </label>

                    <input
                      type="text"
                      value={
                        newAddress.district
                      }
                      onChange={
                        updateNewAddress(
                          'district',
                        )
                      }
                      className={
                        inputClass
                      }
                      required
                    />

                  </div>

                  {/* SAVE ADDRESS BUTTON */}
                  <div className="sm:col-span-2 flex justify-end gap-3 mt-3 pt-3 border-t border-slate-200">
                    {savedAddressesList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setAddressMode('saved')}
                        className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isSavingAddress}
                      onClick={handleSaveNewAddress}
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-dcc-primary text-white hover:bg-dcc-primary-hover disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
                    >
                      {isSavingAddress ? 'Saving address…' : '💾 Save Address'}
                    </button>
                  </div>

                </div>

              )}

            </CheckoutSection>


            {/* ===============================================
                DELIVERY METHOD
            =============================================== */}

            <CheckoutSection
              title="Delivery method"
              step={2}
            >

              <ul className="space-y-3">

                {deliveryMethods.map(
                  (method) => (

                    <li
                      key={
                        method.id
                      }
                    >

                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${deliveryMethod ===
                          method.id

                          ? 'border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'

                          : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >

                        <input
                          type="radio"
                          name="delivery"
                          checked={
                            deliveryMethod ===
                            method.id
                          }
                          onChange={() =>
                            setDeliveryMethod(
                              method.id,
                            )
                          }
                          className="w-4 h-4 mt-1 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                        />


                        <div className="flex flex-wrap items-start justify-between flex-1 min-w-0 gap-2">

                          <div>

                            <div className="flex items-center gap-2">

                              <Truck className="w-4 h-4 text-dcc-primary" />

                              <span className="font-semibold text-slate-900">
                                {
                                  method.label
                                }
                              </span>

                            </div>


                            <p className="mt-1 text-sm text-slate-600">
                              {
                                method.description
                              }
                            </p>


                            <p className="mt-1 text-xs text-slate-500">
                              {
                                method.eta
                              }
                            </p>

                          </div>


                          <span className="text-sm font-bold text-dcc-primary">

                            {getCalculatedFee(
                              method.id,
                            ) === 0

                              ? 'Free'

                              : `LKR ${getCalculatedFee(
                                method.id,
                              ).toLocaleString(
                                'en-LK',
                              )}`}

                          </span>

                        </div>

                      </label>

                    </li>

                  ),
                )}

              </ul>

            </CheckoutSection>


            {/* ===============================================
                PAYMENT
            =============================================== */}

            <CheckoutSection
              title="Payment method"
              step={3}
            >

              <p className="mb-4 text-sm text-slate-600">
                Choose how you would like to pay.
              </p>


              <ul className="space-y-3">

                {paymentMethods.map(
                  (method) => {

                    const paymentAvailable =
                      method.id ===
                      'cod' ||
                      method.id ===
                      'payhere'


                    return (

                      <li
                        key={
                          method.id
                        }
                      >

                        <label
                          className={`flex gap-3 rounded-xl border p-4 transition ${!paymentAvailable

                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-50'

                            : paymentMethod ===
                              method.id

                              ? 'cursor-pointer border-dcc-primary bg-violet-50/50 ring-1 ring-dcc-primary/20'

                              : 'cursor-pointer border-slate-200 hover:border-slate-300'
                            }`}
                        >

                          <input
                            type="radio"
                            name="payment"
                            checked={
                              paymentMethod ===
                              method.id
                            }
                            disabled={
                              !paymentAvailable
                            }
                            onChange={() =>
                              setPaymentMethod(
                                method.id,
                              )
                            }
                            className="w-4 h-4 mt-1 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30 disabled:cursor-not-allowed"
                          />


                          <div className="flex-1 min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={`rounded-md bg-gradient-to-r px-2 py-0.5 text-xs font-bold text-white ${method.accent}`}
                              >
                                {
                                  method.label
                                }
                              </span>


                              {!paymentAvailable && (

                                <span className="text-[10px] font-semibold uppercase text-amber-600">
                                  Coming soon
                                </span>

                              )}


                              {paymentAvailable &&
                                !method.online && (

                                  <span className="text-[10px] font-semibold uppercase text-slate-500">
                                    No online payment
                                  </span>

                                )}

                            </div>


                            <p className="mt-1 text-sm text-slate-600">
                              {
                                method.description
                              }
                            </p>

                          </div>

                        </label>

                      </li>

                    )
                  },
                )}

              </ul>


              <div className="mt-4">

                <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">
                  Confirmation email
                </label>


                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={
                    (
                      event,
                    ) =>
                      setEmail(
                        event.target
                          .value,
                      )
                  }
                  className={
                    inputClass
                  }
                  placeholder="you@example.com"
                  required
                />


                <p className="mt-1 text-xs text-slate-500">

                  {isOnlinePayment(
                    paymentMethod,
                  )

                    ? 'Sent after your online payment is confirmed.'

                    : 'Used for your order confirmation.'}

                </p>

              </div>

            </CheckoutSection>


            {/* ===============================================
                ADDRESS WARNING
            =============================================== */}

            {getValidationWarning() && (

              <div
                id="realtime-address-warning"
                className="flex flex-col gap-1 px-4 py-3 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700"
              >

                <span className="font-bold">
                  Unsupported Delivery Address
                </span>

                <span>
                  {
                    getValidationWarning()
                  }
                </span>

              </div>

            )}


            {/* ===============================================
                ERROR
            =============================================== */}

            {error && (

              <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>

            )}

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="lg:sticky lg:top-28 lg:self-start">


            <CheckoutOrderSummary

              cart={
                cart
              }

              subtotal={
                subtotal
              }

              deliveryFee={
                deliveryFee
              }

            />


            <button

              type="submit"

              disabled={
                submitting ||
                Boolean(
                  getValidationWarning(),
                )
              }

              className="mt-4 flex w-full items-center justify-center rounded-xl bg-dcc-primary py-3.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"

            >

              {submitting

                ? 'Placing order…'

                : `Place Order · ${formatLkr(
                  total,
                )}`}

            </button>


            <Link

              to="/cart"

              className="flex items-center justify-center w-full py-3 mt-3 text-sm font-semibold bg-white border rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"

            >

              Back to cart

            </Link>

          </div>

        </form>

      </PageContainer>

    </div>

  )
}