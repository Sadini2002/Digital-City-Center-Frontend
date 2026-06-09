/** @typedef {{ id: string, name: string, brand: string, price: number, originalPrice?: number | null, image?: string, seller?: string, color?: string, size?: string, lineId?: string }} ShopProductSnapshot */

const LINE_ID_SEPARATOR = '::'

function buildLineId(product) {
  return [product.id, product.color ?? '', product.size ?? ''].join(LINE_ID_SEPARATOR)
}

/**
 * @param {object} product
 * @returns {ShopProductSnapshot}
 */
export function toShopSnapshot(product) {
  return {
    id: product.id,
    lineId: buildLineId(product),
    name: product.name ?? product.title,
    brand: product.brand ?? '',
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    image: product.image ?? product.images?.[0] ?? '',
    seller: product.seller?.name ?? product.seller ?? 'Tech World LK',
    color: product.color,
    size: product.size,
  }
}

/**
 * @param {ShopProductSnapshot} snapshot
 * @param {number} quantity
 */
export function toCartLine(snapshot, quantity = 1) {
  return { ...snapshot, quantity: Math.max(1, quantity) }
}

/**
 * @param {ShopProductSnapshot} snapshot
 * @returns {string}
 */
export function getLineId(snapshot) {
  return snapshot.lineId ?? buildLineId(snapshot)
}
