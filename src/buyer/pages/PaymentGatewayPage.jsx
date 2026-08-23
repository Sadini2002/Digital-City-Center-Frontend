import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { formatLkr } from '../../components/category/categoryData'
import { getPaymentMethod } from '../data/checkoutData'
import { getOrderById } from '../utils/orderStorage'
import { processPaymentWebhook } from '../services/paymentService'
import { useShop } from '../hooks/useShop'

export default function PaymentGatewayPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useShop()
  const methodId = searchParams.get('method') || ''
  const method = getPaymentMethod(methodId)

  const order = useMemo(() => getOrderById(orderId), [orderId])
  const [processing, setProcessing] = useState(false)

  if (!order || order.status !== 'pending_payment') {
    if (order?.status === 'confirmed') {
      return <Navigate to={`/order/${orderId}/success`} replace />
    }
    if (order?.status === 'payment_failed') {
      return <Navigate to={`/order/${orderId}/failed`} replace />
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-600">Payment session not found.</p>
        <Link to="/checkout" className="mt-4 text-sm font-semibold text-dcc-primary hover:underline">
          Return to checkout
        </Link>
      </div>
    )
  }

  const accent = method?.accent ?? 'from-slate-700 to-slate-900'
  const gatewayName = method?.label ?? 'Payment Gateway'

  const completePayment = async (success) => {
    setProcessing(true)
    try {
      await processPaymentWebhook(orderId, { success })
      if (success) {
        clearCart()
        navigate(`/order/${orderId}/success`, { replace: true })
      } else {
        navigate(`/order/${orderId}/failed`, { replace: true })
      }
    } catch {
      navigate(`/order/${orderId}/failed`, { replace: true })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="h-4 w-4 text-green-600" />
            <span>Secure payment</span>
          </div>
          <span className="text-xs text-slate-400">SSL encrypted</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-6 text-white shadow-lg`}>
          <p className="text-sm font-medium text-white/80">You are paying via</p>
          <h1 className="mt-1 text-2xl font-bold">{gatewayName}</h1>
          <p className="mt-4 text-3xl font-bold">{formatLkr(order.total)}</p>
          <p className="mt-1 text-sm text-white/80">Order {order.id}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
            <p>
              This is a simulated secure gateway page. In production you would complete payment on{' '}
              {gatewayName}&apos;s site. Our backend receives a webhook when payment succeeds or
              fails.
            </p>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Paying as <span className="font-medium text-slate-800">{order.email}</span>
          </p>

          <button
            type="button"
            disabled={processing}
            onClick={() => completePayment(true)}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-70"
          >
            {processing ? 'Confirming with DCC…' : `Pay ${formatLkr(order.total)}`}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={() => completePayment(false)}
            className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-70"
          >
            Cancel / payment failed
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          You will be returned to Digital City Center after payment.
        </p>
      </main>
    </div>
  )
}
