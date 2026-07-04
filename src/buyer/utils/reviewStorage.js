const REVIEWS_KEY = 'dcc_product_reviews'

export function getBuyerId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.email || user.id || 'guest-buyer'
  } catch {
    return 'guest-buyer'
  }
}

export function getBuyerDisplayName() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.name || user.email?.split('@')[0] || 'Buyer'
  } catch {
    return 'Buyer'
  }
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatReviewDate(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getAllStoredReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export function hasReviewed(orderId, productId, buyerId = getBuyerId()) {
  return getAllStoredReviews().some(
    (r) => r.orderId === orderId && r.productId === productId && r.buyerId === buyerId,
  )
}

export function getReviewForOrderProduct(orderId, productId, buyerId = getBuyerId()) {
  return getAllStoredReviews().find(
    (r) => r.orderId === orderId && r.productId === productId && r.buyerId === buyerId,
  )
}

/**
 * One review per product per order per buyer.
 */
export function submitProductReview({
  orderId,
  productId,
  productName,
  rating,
  body,
  sellerName = 'Seller',
}) {
  const buyerId = getBuyerId()
  if (hasReviewed(orderId, productId, buyerId)) {
    throw new Error('You have already reviewed this product for this order.')
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Please select a rating from 1 to 5 stars.')
  }
  if (!body?.trim()) {
    throw new Error('Please write your review.')
  }

  const author = getBuyerDisplayName()
  const createdAt = new Date().toISOString()
  const review = {
    id: `rev-${orderId}-${productId}-${Date.now()}`,
    orderId,
    productId,
    productName,
    buyerId,
    author,
    initials: getInitials(author),
    rating,
    body: body.trim(),
    date: formatReviewDate(createdAt),
    createdAt,
    verifiedPurchase: true,
    sellerName,
    sellerReply: null,
    sellerReplyAt: null,
  }

  saveAll([review, ...getAllStoredReviews()])
  return review
}

export function addSellerReply(reviewId, replyBody, sellerName) {
  const trimmed = replyBody?.trim()
  if (!trimmed) {
    throw new Error('Reply cannot be empty.')
  }

  const list = getAllStoredReviews()
  const index = list.findIndex((r) => r.id === reviewId)
  if (index < 0) throw new Error('Review not found.')
  if (list[index].sellerReply) {
    throw new Error('Seller has already replied to this review.')
  }

  const updated = {
    ...list[index],
    sellerReply: trimmed,
    sellerReplyAt: new Date().toISOString(),
    sellerName: sellerName || list[index].sellerName,
  }
  list[index] = updated
  saveAll(list)
  return updated
}

export function getReviewsForProduct(productId) {
  return getAllStoredReviews()
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getReviewsForOrder(orderId) {
  return getAllStoredReviews().filter((r) => r.orderId === orderId)
}

export function mergeProductReviews(catalogReviews = [], productId) {
  const stored = getReviewsForProduct(productId)
  return [...stored, ...catalogReviews]
}
