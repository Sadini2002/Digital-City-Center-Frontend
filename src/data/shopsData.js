import { categoryShopsBySlug, getCategoryProducts } from '../components/category/categoryData'

export function slugifyShopName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function collectShops() {
  const map = new Map()

  Object.entries(categoryShopsBySlug).forEach(([categorySlug, group]) => {
    const addShop = (shop, featured = false) => {
      const slug = shop.id || slugifyShopName(shop.name)
      if (map.has(slug)) return
      map.set(slug, {
        slug,
        id: shop.id || slug,
        name: shop.name,
        rating: shop.rating ?? 4.7,
        verified: shop.verified ?? false,
        description: shop.description ?? `${shop.name} on Digital City Center.`,
        logo: shop.logo ?? shop.name.slice(0, 2).toUpperCase(),
        productsLabel: shop.products ?? '100+ products',
        hue: shop.hue ?? 'from-violet-200 to-violet-300',
        categorySlug,
        featured,
        location: shop.location ?? 'Colombo',
        memberSince: shop.memberSince ?? '2022',
        image: shop.image ?? '',
        operatingHours: shop.operatingHours ?? '9:00 AM - 8:00 PM',
        phone: shop.phone ?? '+94 77 123 4567',
        email: shop.email ?? 'shop@digitalcity.lk',
        totalOrders: shop.totalOrders ?? 0,
        totalProducts: shop.totalProducts ?? 0,
        responseRate: shop.responseRate ?? '98%',
      })
    }

    if (group.featured) addShop(group.featured, true)
    group.standard?.forEach((s) => addShop(s, false))
  })

  return [...map.values()]
}

export const shopsCatalog = collectShops()

export function getShopBySlug(shopname) {
  const normalized = shopname?.toLowerCase()
  return (
    shopsCatalog.find((s) => s.slug === normalized) ??
    shopsCatalog.find((s) => slugifyShopName(s.name) === normalized) ??
    null
  )
}

export function getShopProducts(shop) {
  if (!shop) return []
  
  // 1. Get default mock products for this shop
  const allCategoryProducts = getCategoryProducts(shop.categorySlug)
  const shopProducts = allCategoryProducts.filter((p) => p.shopId === shop.id)
  
  // 2. Add local storage products created by the seller for this shop
  try {
    const localProducts = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
    const sellerProducts = localProducts
      .filter((p) => p.shopId === shop.id || p.shopId === shop.slug)
      .map((p) => {
        const id = p.productId || p._id || p.id
        const discountPercent = p.discount?.percent || (p.labelPrice && p.labelPrice > p.price ? Math.round(((p.labelPrice - p.price) / p.labelPrice) * 100) : 0)
        return {
          ...p,
          id,
          name: p.name,
          price: p.price,
          originalPrice: p.labelPrice || null,
          image: Array.isArray(p.image) ? p.image[0] : p.image,
          rating: p.rating || 4.7,
          reviews: p.reviews || 12,
          badge: discountPercent > 0 ? { label: `-${discountPercent}%`, type: 'sale' } : null,
          categorySlug: p.categorySlug || shop.categorySlug,
          shopId: p.shopId || shop.id
        }
      })
    return [...shopProducts, ...sellerProducts]
  } catch {
    return shopProducts
  }
}

export function getAllShops() {
  return shopsCatalog
}
