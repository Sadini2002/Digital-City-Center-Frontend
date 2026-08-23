import { useState } from 'react'
import { MessageSquare, Star } from 'lucide-react'
import { addSellerReply } from '../../utils/reviewStorage'

export default function ReviewCard({ review, allowSellerReply = true }) {
  const [replyText, setReplyText] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [error, setError] = useState('')
  const [localReview, setLocalReview] = useState(review)

  const handleSellerReply = (e) => {
    e.preventDefault()
    setError('')
    try {
      const updated = addSellerReply(localReview.id, replyText, localReview.sellerName)
      setLocalReview(updated)
      setReplyOpen(false)
      setReplyText('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-dcc-primary">
          {localReview.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{localReview.author}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: localReview.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-400">{localReview.date}</span>
            {localReview.verifiedPurchase && (
              <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                Verified purchase
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{localReview.body}</p>

          {localReview.sellerReply && (
            <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-dcc-primary">
                <MessageSquare className="h-3.5 w-3.5" />
                Reply from {localReview.sellerName || 'Seller'}
              </p>
              <p className="mt-2 text-sm text-slate-700">{localReview.sellerReply}</p>
            </div>
          )}

          {allowSellerReply &&
            localReview.orderId &&
            !localReview.sellerReply &&
            !replyOpen && (
              <button
                type="button"
                onClick={() => setReplyOpen(true)}
                className="mt-3 text-xs font-semibold text-dcc-primary hover:underline"
              >
                Reply as seller
              </button>
            )}

          {replyOpen && (
            <form onSubmit={handleSellerReply} className="mt-4 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder="Public reply visible to all shoppers…"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                required
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover"
                >
                  Post reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </article>
  )
}
