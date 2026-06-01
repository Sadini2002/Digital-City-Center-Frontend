import { forwardRef } from 'react'
import { Pencil, Star } from 'lucide-react'

const ProductReviewsSection = forwardRef(function ProductReviewsSection({ reviews }, ref) {
  return (
    <section ref={ref} className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-dcc-primary hover:underline"
        >
          <Pencil className="h-4 w-4" />
          Write a Review
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-dcc-primary">
                {review.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{review.author}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
})

export default ProductReviewsSection
