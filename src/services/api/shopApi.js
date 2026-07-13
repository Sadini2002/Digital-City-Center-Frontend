import { api } from './client'

/**
 * Backend routes (src/routes/shopRoutes.js):
 *   GET  /shops                      -> getAllShops
 *   GET  /shops/url/:shopUrl         -> getShopByUrl
 *   GET  /shops/url/:shopUrl/products-> getShopProductsBySlug
 *   GET  /shops/:id                  -> getShopById
 */
export const shopApi = {
  getAll: (params) => api.get('/shops', { params }),
  getByUrl: (shopUrl) => api.get(`/shops/url/${encodeURIComponent(shopUrl)}`),
  getProductsByUrl: (shopUrl) => api.get(`/shops/url/${encodeURIComponent(shopUrl)}/products`),
  getById: (id) => api.get(`/shops/${id}`),
}

/**
 * The backend serves uploaded images from an absolute or root-relative path
 * (see src/utils/media.js). This resolves a root-relative "/uploads/..." path
 * against the API's origin so <img> tags work regardless of environment.
 */
export function resolveMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path

  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'
  const origin = base.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Maps a raw `Seller` record from the backend into the shape the shop UI
 * components expect (previously supplied by the static src/data/shopsData.js).
 */
export function normalizeShop(seller) {
  if (!seller) return null

  const productsCount = seller._count?.listings ?? seller.listings?.length ?? 0

  return {
    id: seller.id,
    slug: seller.shopUrl || String(seller.id),
    name: seller.shopName,
    businessType: seller.businessType,
    description: seller.user?.bio || `${seller.shopName} on Digital City Center.`,
    logo: (seller.shopName || '?').slice(0, 2).toUpperCase(),
    image: resolveMediaUrl(seller.bannerImage || seller.image),
    verified: seller.status === 'ACTIVE' || seller.status === 'active',
    status: seller.status,
    // Computed server-side from the shop's listings' reviews (Review model).
    // null when the shop has no reviews yet - render conditionally.
    rating: seller.rating ?? null,
    reviewCount: seller.reviewCount ?? 0,
    productsLabel: `${productsCount}+ products`,
    productsCount,
    hue: 'from-violet-200 to-violet-300',
    memberSince: seller.createdAt ? new Date(seller.createdAt).getFullYear() : undefined,
  }
}

/**
 * Maps a raw `Listing` record (with `variants.images` and `reviews` included,
 * see getShopProductsBySlug) into the shape CategoryProductCard expects.
 */
export function normalizeListing(listing) {
  if (!listing) return null

  const variant = listing.variants?.[0]
  const mainImage =
    variant?.images?.find((img) => img.isMain)?.url ?? variant?.images?.[0]?.url ?? ''

  const reviews = listing.reviews ?? []
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
    : 0

  return {
    id: listing.id,
    name: listing.title,
    image: resolveMediaUrl(mainImage),
    price: variant?.price ?? 0,
    originalPrice: null,
    rating: avgRating,
    reviews: reviews.length,
    badge: null,
    categoryLabel: undefined,
  }
}