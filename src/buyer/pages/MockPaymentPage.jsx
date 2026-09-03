import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Lock, XCircle } from 'lucide-react'
import { getPaymentMethod } from '../data/checkoutData'
import { completeMockPayment } from '../services/paymentService'
import { useShop } from '../hooks/useShop'

export default function MockPaymentPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useShop()

  const methodId = searchParams.get('method')?.toLowerCase()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const isSupportedMethod = ['koko', 'onepay'].includes(methodId)

  const method = getPaymentMethod(methodId) ?? {
    label: methodId === 'onepay' ? 'OnePay' : 'KOKO',
    accent: 'from-violet-600 to-purple-700',
  }

  if (!isSupportedMethod) {
    return <Navigate to="/checkout" replace />
  }

const handleOutcome = async (outcome) => {
  setError('')
  setProcessing(true)

  try {
    const result = await completeMockPayment(orderId, outcome)

    if (outcome === 'success') {
      if (result.paymentStatus !== 'paid') {
        throw new Error('Mock payment was not marked as paid.')
      }

      await clearCart()
      navigate(`/order/${orderId}/success`, { replace: true })
      return
    }

    if (result.paymentStatus !== 'failed') {
      throw new Error('Mock payment was not marked as failed.')
    }

    navigate(`/order/${orderId}/failed`, { replace: true })
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        err?.message ||
        'Unable to complete mock payment.',
    )
    setProcessing(false)
  }
}

  const accent = method.accent ?? 'from-violet-600 to-purple-700'

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="h-4 w-4 text-amber-600" />
            <span>Mock payment environment</span>
          </div>

          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
            Test mode
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8">
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-6 text-white shadow-lg`}>
          <p className="text-sm font-medium text-white/70">Testing payment via</p>
          <h1 className="mt-1 text-3xl font-bold">{method.label}</h1>
          <p className="mt-3 text-xs text-white/70">Order #{orderId}</p>
        </div>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-amber-900">Test payment only</h2>
              <p className="mt-1 text-sm text-amber-800">
                No real payment is processed. Do not enter real card or account details.
              </p>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">
            Select a test outcome
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            This updates your local database exactly as a successful or failed gateway
            callback would.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={() => handleOutcome('success')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 className="h-5 w-5" />
            {processing ? 'Processing…' : 'Simulate successful payment'}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={() => handleOutcome('failed')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle className="h-5 w-5" />
            Simulate failed payment
          </button>

          <Link
            to="/checkout"
            className="mt-4 flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            Return to checkout
          </Link>
        </section>
      </main>
    </div>
  )
}