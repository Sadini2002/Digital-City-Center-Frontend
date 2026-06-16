import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import ProductReviewForm from '../components/reviews/ProductReviewForm'
import { getOrderById, isOrderDelivered, ORDER_STATUS } from '../utils/orderStorage'
import { getReviewForOrderProduct, hasReviewed } from '../utils/reviewStorage'

export default function OrderReviewsPage() {
  const { id } = useParams()
  const [, setRefresh] = useState(0)
  const order = getOrderById(id)

  if (!order) {
    return (
      <PageContainer className="py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Order not found</h1>
        <Link to="/account" className="mt-4 inline-block text-sm font-semibold text-dcc-primary hover:underline">
          Back to account
        </Link>
      </PageContainer>
    )
  }

  if (order.status !== ORDER_STATUS.CONFIRMED && order.status !== 'confirmed') {
    return <Navigate to={`/order/${id}`} replace />
  }

  if (!isOrderDelivered(order)) {
    return (
      <PageContainer className="pb-12">
        <h1 className="text-xl font-bold text-slate-900">Reviews not available yet</h1>
        <p className="mt-2 text-sm text-slate-600">
          You can review products after your order has been delivered.
        </p>
        <Link
          to={`/order/${id}`}
          className="mt-6 inline-block text-sm font-semibold text-dcc-primary hover:underline"
        >
          Track order
        </Link>
      </PageContainer>
    )
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'My account', to: '/account' },
    { label: order.id, to: `/order/${order.id}` },
    { label: 'Reviews', to: null },
  ]

  const items = order.items ?? []

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Rate your products</h1>
        <p className="mt-1 text-sm text-slate-600">
          Order {order.id} · One review per product · Shown publicly on each product page
        </p>

        <ul className="mt-8 space-y-6">
          {items.map((item) => {
            const reviewed = hasReviewed(order.id, item.id)
            const existing = getReviewForOrderProduct(order.id, item.id)

            return (
              <li
                key={item.id}
                id={`product-${item.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-500">Sold by {item.seller}</p>
                  </div>
                  {reviewed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Review submitted
                    </span>
                  )}
                </div>

                {reviewed && existing ? (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">
                      {existing.rating} / 5 stars
                    </p>
                    <p className="mt-1">{existing.body}</p>
                    <Link
                      to={`/product/${item.id}`}
                      className="mt-2 inline-block text-xs font-semibold text-dcc-primary hover:underline"
                    >
                      View on product page
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4">
                    <ProductReviewForm
                      orderId={order.id}
                      productId={item.id}
                      productName={item.name}
                      sellerName={item.seller}
                      onSubmitted={() => setRefresh((n) => n + 1)}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <Link
          to={`/order/${order.id}`}
          className="mt-8 inline-block text-sm font-semibold text-dcc-primary hover:underline"
        >
          Back to order tracking
        </Link>
      </PageContainer>
    </div>
  )
}
