import { getAllCategoryListings } from '../components/category/categoryData'
import { shopsCatalog } from './shopsData'

export const SEARCH_CATEGORY_SLUGS = {
  'All Categories': '',
  Electronics: 'electronics',
  Fashion: 'fashion',
  Groceries: 'groceries',
  'Home & Living': 'home',
}

const SELLER_LOCATIONS = ['colombo', 'gampaha', 'kandy', 'galle']

function enrichProduct(product, index) {
  return {
    ...product,
    image: product.image || '',
    reviews: product.reviews ?? product.sales ?? 0,
    sellerLocation: product.sellerLocation ?? SELLER_LOCATIONS[index % SELLER_LOCATIONS.length],
    freeDelivery: product.freeDelivery ?? index % 2 === 0,
    islandwideDelivery: product.islandwideDelivery ?? true,
  }
}

function getFullCatalog() {
  const byId = new Map()
  let index = 0
  const add = (product) => {
    byId.set(product.id, enrichProduct(product, index))
    index += 1
  }
  getAllCategoryListings().forEach(add)

  try {
    const local = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
    local.forEach((p) => {
      const id = p.productId || p._id || p.id
      const enriched = enrichProduct({
        id,
        brand: p.brand || 'Local',
        name: p.name,
        categorySlug: p.itemType || 'electronics',
        price: Number(p.price || 0),
        originalPrice: p.labelPrice ? Number(p.labelPrice) : null,
        rating: p.rating || 5,
        image: Array.isArray(p.image) ? p.image[0] : p.image,
        seller: p.shopId || 'Tech World LK',
        sellerLocation: p.sellerLocation || 'colombo',
        ...p
      }, index)
      byId.set(id, enriched)
      index += 1
    })
  } catch (e) {}

  return [...byId.values()]
}

function relevanceScore(product, query) {
  const q = query.toLowerCase()
  const name = product.name.toLowerCase()
  const brand = product.brand.toLowerCase()
  let score = 0
  if (name === q || `${brand} ${name}` === q) score += 100
  if (name.startsWith(q)) score += 50
  if (name.includes(q)) score += 30
  if (brand.includes(q)) score += 20
  q.split(/\s+/).forEach((term) => {
    if (term.length < 2) return
    if (name.includes(term)) score += 10
    if (brand.includes(term)) score += 5
  })
  return score + product.rating
}

/**
 * @param {string} query
 * @param {{ categorySlug?: string }} [options]
 */
export function searchProducts(query, options = {}) {
  const trimmed = query.trim()
  let list = getFullCatalog()

  if (options.categorySlug) {
    list = list.filter((p) => p.categorySlug === options.categorySlug)
  }

  if (!trimmed) {
    return [...list].sort((a, b) => b.rating - a.rating)
  }

  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

  return list
    .filter((product) => {
      const haystack = `${product.brand} ${product.name} ${product.categorySlug || ''}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
    .sort((a, b) => relevanceScore(b, trimmed) - relevanceScore(a, trimmed))
}

/**
 * @param {ReturnType<typeof buildCatalog>} products
 * @param {{
 *   categorySlugs?: string[],
 *   priceMin?: string | number,
 *   priceMax?: string | number,
 *   locations?: string[],
 *   minRating?: number,
 *   delivery?: string[],
 * }} filters
 */
export function applySearchFilters(products, filters) {
  let list = [...products]

  if (filters.categorySlugs?.length) {
    list = list.filter((p) => filters.categorySlugs.includes(p.categorySlug))
  }

  if (filters.priceMin !== '' && filters.priceMin != null) {
    const min = Number(filters.priceMin)
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min)
  }

  if (filters.priceMax !== '' && filters.priceMax != null) {
    const max = Number(filters.priceMax)
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max)
  }

  if (filters.locations?.length) {
    list = list.filter((p) => filters.locations.includes(p.sellerLocation))
  }

  if (filters.minRating && filters.minRating > 0) {
    list = list.filter((p) => p.rating >= filters.minRating)
  }

  if (filters.delivery?.includes('free')) {
    list = list.filter((p) => p.freeDelivery)
  }

  if (filters.delivery?.includes('islandwide')) {
    list = list.filter((p) => p.islandwideDelivery)
  }

  return list
}

export function toBestMatch(product) {
  if (!product) return null
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null

  const shopId = product.shopId
  const shop = shopsCatalog.find((s) => s.id === shopId || s.slug === shopId)
  const sellerName = shop ? shop.name : 'Tech World LK'

  return {
    id: product.id,
    title: `${product.brand} ${product.name}`,
    price: product.price,
    originalPrice: product.originalPrice,
    discount,
    rating: product.rating,
    reviews: product.reviews ?? product.sales ?? 0,
    seller: sellerName,
    location: product.sellerLocation
      ? product.sellerLocation.charAt(0).toUpperCase() + product.sellerLocation.slice(1)
      : 'Colombo',
    image: product.image || '',
  }
}
