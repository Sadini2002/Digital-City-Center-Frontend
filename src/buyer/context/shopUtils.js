/** @typedef {{ id: string, name: string, brand: string, price: number, originalPrice?: number | null, image?: string, seller?: string }} ShopProductSnapshot */

/**
 * @param {object} product
 * @returns {ShopProductSnapshot}
 */
export function toShopSnapshot(product) {
  return {
    id: product.id,
    name: product.name ?? product.title,
    brand: product.brand ?? '',
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    image: product.image ?? product.images?.[0] ?? '',
    seller: product.seller?.name ?? product.seller ?? 'Tech World LK',
  }
}

/**
 * @param {ShopProductSnapshot} snapshot
 * @param {number} quantity
 */
export function toCartLine(snapshot, quantity = 1) {
  return { ...snapshot, quantity: Math.max(1, quantity) }
}
