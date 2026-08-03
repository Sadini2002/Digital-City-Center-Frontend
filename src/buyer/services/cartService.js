import { api } from '../../services/api'

function unwrapCart(response) {
  const data = response?.data ?? {}
  const items = data.items ?? data.cart ?? []
  const summary = data.summary ?? {
    itemCount: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    uniqueItems: items.length,
    subtotal: items.reduce((sum, item) => sum + (item.lineTotal ?? item.price * item.quantity), 0),
    deliveryFee: 0,
    discount: 0,
    total: items.reduce((sum, item) => sum + (item.lineTotal ?? item.price * item.quantity), 0),
    currency: 'LKR',
  }

  return {
    items: items.map(normalizeCartItem),
    summary,
  }
}

export function normalizeCartItem(item) {
  return {
    id: item.productId ?? item.listingId ?? item.id,
    lineId: item.lineId || item.id,
    variantId: item.variantId,
    productId: item.productId ?? item.listingId,
    name: item.name,
    brand: item.brand || '',
    price: Number(item.price ?? item.unitPrice ?? 0),
    unitPrice: Number(item.unitPrice ?? item.price ?? 0),
    originalPrice: item.originalPrice ?? null,
    image: item.image || '',
    seller: item.seller || 'Marketplace Seller',
    color: item.color || '',
    size: item.size || '',
    quantity: Number(item.quantity) || 1,
    lineTotal: Number(item.lineTotal ?? item.subtotal ?? 0),
    stock: item.stock,
    attributes: item.attributes || {},
  }
}

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart')
    return unwrapCart(response)
  },

  addItem: async ({ variantId, productId, listingId, quantity = 1, color = '', size = '' }) => {
    const response = await api.post('/cart/add', {
      variantId,
      productId,
      listingId,
      quantity,
      color,
      size,
    })
    return unwrapCart(response)
  },

  updateQuantity: async (lineId, quantity) => {
    const response = await api.put(`/cart/update/${encodeURIComponent(lineId)}`, { quantity })
    return unwrapCart(response)
  },

  removeItem: async (lineId) => {
    const response = await api.delete(`/cart/${encodeURIComponent(lineId)}`)
    return unwrapCart(response)
  },

  clear: async () => {
    const response = await api.delete('/cart/clear')
    return unwrapCart(response)
  },
}
