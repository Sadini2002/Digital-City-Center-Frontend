import { useState, useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Lock, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react'
import { formatLkr } from '../../components/category/categoryData'
import { getPaymentMethod } from '../data/checkoutData'
import { getOrderById } from '../utils/orderStorage'
import { processPaymentWebhook } from '../services/paymentService'
import { useShop } from '../hooks/useShop'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCardNumber(raw) {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function detectCardType(number) {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  return null
}

function CardLogo({ type }) {
  if (type === 'visa') {
    return (
      <span className="rounded bg-blue-700 px-2 py-0.5 text-[11px] font-black italic tracking-widest text-white">
        VISA
      </span>
    )
  }
  if (type === 'mastercard') {
    return (
      <span className="flex items-center gap-0.5">
        <span className="h-5 w-5 rounded-full bg-red-500 opacity-90" />
        <span className="-ml-2.5 h-5 w-5 rounded-full bg-yellow-400 opacity-90" />
      </span>
    )
  }
  if (type === 'amex') {
    return (
      <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-black text-white">
        AMEX
      </span>
    )
  }
  return <CreditCard className="h-5 w-5 text-slate-400" />
}

const EMPTY_FORM = { number: '', name: '', expiry: '', cvv: '' }

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentGatewayPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useShop()

  const order = useMemo(() => getOrderById(orderId), [orderId])
  const methodId = searchParams.get('method') || order?.paymentMethod || 'payhere'
  const method = getPaymentMethod(methodId) ?? {
    label: 'PayHere',
    accent: 'from-emerald-600 to-teal-700',
  }

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [stage, setStage] = useState('form') // 'form' | 'processing'

  // ── Guards ──
  if (!order || order.status !== 'pending_payment') {
    if (order?.status === 'confirmed') return <Navigate to={`/order/${orderId}/success`} replace />
    if (order?.status === 'payment_failed') return <Navigate to={`/order/${orderId}/failed`} replace />
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-600">Payment session not found.</p>
        <Link to="/checkout" className="mt-4 text-sm font-semibold text-dcc-primary hover:underline">
          Return to checkout
        </Link>
      </div>
    )
  }

  const cardType = detectCardType(form.number)

  // ── Field handlers ──
  const handleNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setForm((f) => ({ ...f, number: formatted }))
    setErrors((err) => ({ ...err, number: '' }))
  }

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
    setForm((f) => ({ ...f, expiry: val }))
    setErrors((err) => ({ ...err, expiry: '' }))
  }

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3)
    setForm((f) => ({ ...f, cvv: val }))
    setErrors((err) => ({ ...err, cvv: '' }))
  }

  const handleNameChange = (e) => {
    setForm((f) => ({ ...f, name: e.target.value }))
    setErrors((err) => ({ ...err, name: '' }))
  }

  // ── Validation ──
  const validate = () => {
    const e = {}
    const num = form.number.replace(/\s/g, '')

    if (num.length < 13 || num.length > 16) e.number = 'Enter a valid card number.'
    if (!form.name.trim()) e.name = 'Enter the cardholder name.'

    const [mm, yy] = (form.expiry + '/').split('/')
    const month = parseInt(mm, 10)
    const year = parseInt('20' + yy, 10)
    const now = new Date()
    if (
      !mm || !yy ||
      month < 1 || month > 12 ||
      isNaN(year) ||
      new Date(year, month - 1) < new Date(now.getFullYear(), now.getMonth())
    ) {
      e.expiry = 'Enter a valid expiry date.'
    }

    const cvvLen = cardType === 'amex' ? 4 : 3
    if (form.cvv.length < cvvLen) e.cvv = `CVV must be ${cvvLen} digits.`

    return e
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setProcessing(true)
    setStage('processing')

    // Simulate gateway processing delay
    await new Promise((r) => setTimeout(r, 2200))

    try {
      await processPaymentWebhook(orderId, { success: true })
      await clearCart()
      navigate(`/order/${orderId}/success`, { replace: true })
    } catch {
      setProcessing(false)
      setStage('form')
      navigate(`/order/${orderId}/failed`, { replace: true })
    }
  }

  // ── Processing overlay ──
  if (stage === 'processing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">Processing payment…</p>
          <p className="mt-1 text-sm text-slate-500">Please do not close this window.</p>
        </div>
      </div>
    )
  }

  const accent = method.accent ?? 'from-emerald-600 to-teal-700'
  const gatewayName = method.label ?? 'PayHere'

  const inputBase =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
  const inputError = 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
  const labelBase = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500'

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="h-4 w-4 text-green-600" />
            <span>Secure payment</span>
          </div>
          <span className="text-xs text-slate-400">256-bit SSL encrypted</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">

        {/* Gateway header card */}
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Paying via</p>
              <h1 className="mt-0.5 text-2xl font-bold">{gatewayName}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Order total</p>
              <p className="mt-0.5 text-2xl font-bold">{formatLkr(order.total)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/60">Order #{order.orderNumber || order.id}</p>
        </div>

        {/* Card form */}
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          noValidate
        >
          <h2 className="mb-5 text-base font-semibold text-slate-800">Card details</h2>

          {/* Card number */}
          <div className="mb-4">
            <label className={labelBase}>Card number</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={form.number}
                onChange={handleNumberChange}
                className={`${inputBase} pr-12 ${errors.number ? inputError : ''}`}
                autoComplete="cc-number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <CardLogo type={cardType} />
              </span>
            </div>
            {errors.number && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" /> {errors.number}
              </p>
            )}
          </div>

          {/* Cardholder name */}
          <div className="mb-4">
            <label className={labelBase}>Cardholder name</label>
            <input
              type="text"
              placeholder="Name on card"
              value={form.name}
              onChange={handleNameChange}
              className={`${inputBase} ${errors.name ? inputError : ''}`}
              autoComplete="cc-name"
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Expiry date</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleExpiryChange}
                className={`${inputBase} ${errors.expiry ? inputError : ''}`}
                autoComplete="cc-exp"
              />
              {errors.expiry && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" /> {errors.expiry}
                </p>
              )}
            </div>

            <div>
              <label className={labelBase}>CVV / CVC</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder={cardType === 'amex' ? '4 digits' : '3 digits'}
                value={form.cvv}
                onChange={handleCvvChange}
                className={`${inputBase} ${errors.cvv ? inputError : ''}`}
                autoComplete="cc-csc"
              />
              {errors.cvv && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" /> {errors.cvv}
                </p>
              )}
            </div>
          </div>

          {/* Pay button */}
          <button
            type="submit"
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            <Lock className="h-4 w-4" />
            Pay {formatLkr(order.total)}
          </button>

          {/* Cancel */}
          <button
            type="button"
            disabled={processing}
            onClick={() => navigate(`/order/${orderId}/failed`, { replace: true })}
            className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          {/* Security note */}
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <p className="text-xs text-slate-500">
              Your card details are encrypted and never stored on our servers.
              This is a simulated {gatewayName} checkout page.
            </p>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          You will be returned to Digital City Center after payment.
        </p>
      </main>
    </div>
  )
}
