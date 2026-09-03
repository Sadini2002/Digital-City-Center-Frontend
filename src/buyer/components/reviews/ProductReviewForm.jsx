import { useState } from 'react'
import StarRatingInput from './StarRatingInput'
import { submitProductReview } from '../../utils/reviewStorage'

export default function ProductReviewForm({
  orderId,
  productId,
  productName,
  sellerName,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const review = submitProductReview({
        orderId,
        productId,
        productName,
        rating,
        body,
        sellerName,
      })
      onSubmitted?.(review)
      setBody('')
      setRating(0)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <StarRatingInput value={rating} onChange={setRating} />
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">Your review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product…"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          required
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="mt-4 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
