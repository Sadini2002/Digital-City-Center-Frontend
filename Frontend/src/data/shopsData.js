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
  return getCategoryProducts(shop.categorySlug)
}

export function getAllShops() {
  return shopsCatalog
}
