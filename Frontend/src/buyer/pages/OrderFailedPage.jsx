import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, RefreshCw } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import { getPaymentMethod } from '../data/checkoutData'
import { formatLkr } from '../../components/category/categoryData'
import { getOrderById } from '../utils/orderStorage'

export default function OrderFailedPage() {
  const { id } = useParams()
  const order = useMemo(() => getOrderById(id), [id])
  const paymentLabel = getPaymentMethod(order?.paymentMethod)?.label ?? 'Payment'

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Payment failed', to: null },
  ]

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-16">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mx-auto mt-8 max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-9 w-9 text-red-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment failed</h1>
          <p className="mt-2 text-slate-600">
            We could not confirm your {paymentLabel} payment
            {order ? (
              <>
                {' '}
                for order <span className="font-semibold">{order.id}</span>
              </>
            ) : null}
            . Your order was not confirmed and no confirmation email was sent.
          </p>

          {order && (
            <p className="mt-4 text-sm text-slate-500">
              Amount: <span className="font-semibold text-slate-800">{formatLkr(order.total)}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
