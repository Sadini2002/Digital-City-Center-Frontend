import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Circle, Star } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import { deliveryMethods, formatAddressLines } from '../data/checkoutData'
import { formatLkr } from '../../components/category/categoryData'
import {
  getOrderById,
  getOrderProgress,
  isOrderDelivered,
  markOrderDelivered,
  ORDER_STATUS,
} from '../utils/orderStorage'
import OrderLiveTrackingBlock from '../../delivery/components/OrderLiveTrackingBlock'

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(() => getOrderById(id))

  useEffect(() => {
    setOrder(getOrderById(id))
  }, [id])

  const steps = useMemo(() => (order ? getOrderProgress(order) : []), [order])
  const delivered = order ? isOrderDelivered(order) : false

  const deliveryLabel =
    deliveryMethods.find((m) => m.id === order?.deliveryMethod)?.label ?? 'Delivery'

  const canMarkDelivered =
    order &&
    (order.status === ORDER_STATUS.CONFIRMED || order.status === 'confirmed') &&
    !delivered

  const handleMarkDelivered = () => {
    const updated = markOrderDelivered(id)
    if (updated) setOrder(updated)
  }

  if (!order) {
    return (
      <PageContainer className="py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Order not found</h1>
        <p className="mt-2 text-sm text-slate-600">We could not find order {id}.</p>
        <Link to="/account" className="mt-6 inline-block text-sm font-semibold text-dcc-primary hover:underline">
          View account
        </Link>
      </PageContainer>
    )
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'My account', to: '/account' },
    { label: order.id, to: null },
  ]

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Track order</h1>
            <p className="mt-1 text-sm text-slate-600">
              Order <span className="font-semibold text-slate-900">{order.id}</span> · Placed{' '}
              {new Date(order.placedAt).toLocaleString('en-LK')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {delivered && (
              <Link
                to={`/order/${order.id}/reviews`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                <Star className="h-4 w-4" />
                Write reviews
              </Link>
            )}
            <Link
              to={`/order/${order.id}/success`}
              className="text-sm font-semibold text-dcc-primary hover:underline"
            >
              View confirmation
            </Link>
          </div>
        </div>

        {canMarkDelivered && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-medium">Demo:</span> Mark this order as delivered to unlock product
            reviews.{' '}
            <button
              type="button"
              onClick={handleMarkDelivered}
              className="font-semibold text-dcc-primary hover:underline"
            >
              Mark as delivered
            </button>
          </div>
        )}

        {/* BACKEND: Live map via GET /tracking/order/:orderId — see OrderLiveTrackingBlock */}
        <OrderLiveTrackingBlock orderId={order.id} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Live status</h2>
            <ol className="mt-6 space-y-0">
              {steps.map((step, index) => (
                <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < steps.length - 1 && (
                    <span
                      className={`absolute left-[15px] top-8 h-full w-0.5 ${
                        step.complete ? 'bg-dcc-primary' : 'bg-slate-200'
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.complete
                        ? 'bg-dcc-primary text-white'
                        : step.current
                          ? 'border-2 border-dcc-primary bg-white text-dcc-primary'
                          : 'border border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {step.complete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </span>
                  <div>
                    <p
                      className={`font-semibold ${
                        step.current || step.complete ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                      {step.current && (
                        <span className="ml-2 rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-dcc-primary">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">Delivery</h3>
              <p className="mt-2 text-sm text-slate-600">{deliveryLabel}</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{order.address?.name}</p>
              {order.address &&
                formatAddressLines(order.address).map((line) => (
                  <p key={line} className="text-sm text-slate-600">
                    {line}
                  </p>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">Summary</h3>
              <p className="mt-2 text-sm text-slate-600">{order.items?.length ?? 0} items</p>
              <p className="mt-2 text-lg font-bold text-dcc-primary">{formatLkr(order.total)}</p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  )
}
