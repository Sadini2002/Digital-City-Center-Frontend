import { forwardRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import ReviewCard from './ReviewCard'
import { mergeProductReviews, hasReviewed } from '../../utils/reviewStorage'
import { getOrders, isOrderDelivered, ORDER_STATUS } from '../../utils/orderStorage'

const ProductReviewsSection = forwardRef(function ProductReviewsSection(
  { productId, reviews: catalogReviews = [], reviewCount },
  ref,
) {
  const allReviews = useMemo(
    () => mergeProductReviews(catalogReviews, productId),
    [catalogReviews, productId],
  )

  const reviewableOrder = useMemo(() => {
    return getOrders().find(
      (o) =>
        (o.status === ORDER_STATUS.CONFIRMED || o.status === 'confirmed') &&
        isOrderDelivered(o) &&
        o.items?.some((item) => item.id === productId) &&
        !hasReviewed(o.id, productId),
    )
  }, [productId])

  const totalCount = (reviewCount ?? catalogReviews.length) + (allReviews.length - catalogReviews.length)

  return (
    <section ref={ref} className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          Customer Reviews ({totalCount})
        </h2>
        {reviewableOrder ? (
          <Link
            to={`/order/${reviewableOrder.id}/reviews#product-${productId}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-dcc-primary hover:underline"
          >
            <Pencil className="h-4 w-4" />
            Write a Review
          </Link>
        ) : (
          <span className="text-xs text-slate-500">
            Reviews available after a delivered purchase
          </span>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {allReviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        ) : (
          allReviews.map((review) => (
            <ReviewCard key={review.id} review={review} allowSellerReply={Boolean(review.orderId)} />
          ))
        )}
      </div>
    </section>
  )
})

export default ProductReviewsSection
