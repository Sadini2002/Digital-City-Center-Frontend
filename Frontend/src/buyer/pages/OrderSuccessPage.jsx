import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, Mail, Package } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import { deliveryMethods, formatAddressLines, paymentMethods } from '../data/checkoutData'
import { formatLkr } from '../../components/category/categoryData'
import { getOrderById, ORDER_STATUS } from '../utils/orderStorage'

export default function OrderSuccessPage() {
  const { id } = useParams()

  const order = useMemo(() => getOrderById(id), [id])

  const deliveryLabel =
    deliveryMethods.find((m) => m.id === order?.deliveryMethod)?.label ?? 'Delivery'
  const paymentLabel =
    paymentMethods.find((m) => m.id === order?.paymentMethod)?.label ?? 'Payment'

  if (!order) {
    return (
      <PageContainer className="py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Order not found</h1>
        <p className="mt-2 text-sm text-slate-600">We could not find details for order {id}.</p>
        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-dcc-primary hover:underline">
          Back to home
        </Link>
      </PageContainer>
    )
  }

  if (order.status === ORDER_STATUS.PENDING_PAYMENT) {
    return <Navigate to={`/payment/gateway/${order.id}?method=${order.paymentMethod}`} replace />
  }

  if (order.status === ORDER_STATUS.PAYMENT_FAILED) {
    return <Navigate to={`/order/${order.id}/failed`} replace />
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Order confirmed', to: null },
  ]

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-16">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">Thank you for your order!</h1>
            <p className="mt-2 text-slate-600">
              Order <span className="font-semibold text-slate-900">{order.id}</span> has been placed
              successfully.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50/80 p-5">
            <div className="flex gap-3">
              <Mail className="h-6 w-6 shrink-0 text-green-700" />
              <div>
                <p className="font-semibold text-green-900">Confirmation email sent</p>
                <p className="mt-1 text-sm text-green-800">
                  A receipt and order summary were sent immediately to{' '}
                  <span className="font-medium">{order.email}</span>. Please check your inbox and
                  spam folder.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 shrink-0 text-dcc-primary" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivery to
                </p>
                <p className="mt-1 font-medium text-slate-900">{order.address.name}</p>
                {formatAddressLines(order.address).map((line) => (
                  <p key={line} className="text-sm text-slate-600">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <dl className="grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Delivery method</dt>
                <dd className="font-medium text-slate-900">{deliveryLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-medium text-slate-900">{paymentLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Items</dt>
                <dd className="font-medium text-slate-900">{order.items.length} products</dd>
              </div>
              <div>
                <dt className="text-slate-500">Total paid</dt>
                <dd className="font-bold text-dcc-primary">{formatLkr(order.total)}</dd>
              </div>
            </dl>

            <ul className="border-t border-slate-100 pt-4">
              {order.items.map((item) => (
                <li
                  key={item.lineId ?? item.id}
                  className="flex justify-between gap-4 py-2 text-sm"
                >
                  <span className="text-slate-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {formatLkr(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={`/order/${order.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Track order
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
