import { createContext, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'
import { getAuthToken } from '../../utils/authStorage'
import { cartService } from '../services/cartService'
import { toShopSnapshot } from './shopUtils'

const CART_KEY = 'dcc_cart'
const WISHLIST_KEY = 'dcc_wishlist'

const EMPTY_SUMMARY = {
  itemCount: 0,
  uniqueItems: 0,
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
  currency: 'LKR',
}

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('dcc-shop-update'))
}

let wishlistCache = readStorage(WISHLIST_KEY, [])

function subscribeWishlist(callback) {
  const handler = () => {
    wishlistCache = readStorage(WISHLIST_KEY, [])
    callback()
  }
  window.addEventListener('dcc-shop-update', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('dcc-shop-update', handler)
    window.removeEventListener('storage', handler)
  }
}

function getWishlistSnapshot() {
  return wishlistCache
}

function isAuthenticated() {
  return Boolean(getAuthToken())
}

function resolveProductIds(product) {
  const listingId = product?.listingId ?? product?.productId ?? product?.id
  const variantId =
    product?.variantId ??
    product?.selectedVariantId ??
    product?.variants?.find((v) => v.status !== 'inactive')?.id ??
    product?.variants?.[0]?.id

  return { listingId, variantId }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartSummary, setCartSummary] = useState(EMPTY_SUMMARY)
  const [cartLoading, setCartLoading] = useState(false)
  const [cartReady, setCartReady] = useState(false)

  const wishlist = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, () => [])

  const applyServerCart = useCallback((payload) => {
    setCart(payload.items || [])
    setCartSummary(payload.summary || EMPTY_SUMMARY)
  }, [])

  const migrateGuestCart = useCallback(async () => {
    const guestCart = readStorage(CART_KEY, [])
    if (!guestCart.length) return

    for (const line of guestCart) {
      const listingId = Number(line.productId || line.listingId || line.id)
      const variantId = Number(line.variantId)
      // Only migrate real backend ids; skip legacy demo/localStorage entries.
      if (!Number.isInteger(listingId) && !Number.isInteger(variantId)) continue
      try {
        await cartService.addItem({
          variantId: Number.isInteger(variantId) && variantId > 0 ? variantId : undefined,
          productId: Number.isInteger(listingId) && listingId > 0 ? listingId : undefined,
          listingId: Number.isInteger(listingId) && listingId > 0 ? listingId : undefined,
          quantity: line.quantity || 1,
          color: line.color || '',
          size: line.size || '',
        })
      } catch {
        // Skip lines that cannot be migrated.
      }
    }
    writeStorage(CART_KEY, [])
  }, [])

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated()) {
      setCart([])
      setCartSummary(EMPTY_SUMMARY)
      setCartReady(true)
      return { items: [], summary: EMPTY_SUMMARY }
    }

    setCartLoading(true)
    try {
      await migrateGuestCart()
      const payload = await cartService.getCart()
      applyServerCart(payload)
      return payload
    } catch (error) {
      toast.error(error.message || 'Failed to load cart')
      throw error
    } finally {
      setCartLoading(false)
      setCartReady(true)
    }
  }, [applyServerCart, migrateGuestCart])

  useEffect(() => {
    refreshCart().catch(() => {})

    const onAuthChange = () => {
      refreshCart().catch(() => {})
    }

    window.addEventListener('dcc-auth-change', onAuthChange)
    window.addEventListener('auth-changed', onAuthChange)
    return () => {
      window.removeEventListener('dcc-auth-change', onAuthChange)
      window.removeEventListener('auth-changed', onAuthChange)
    }
  }, [refreshCart])

  const cartCount = useMemo(
    () => cartSummary.itemCount || cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart, cartSummary.itemCount],
  )

  const addToCart = useCallback(
    async (product, quantity = 1, color = '', size = '') => {
      if (!isAuthenticated()) {
        toast.error('Please sign in to add items to your cart.')
        return null
      }

      try {
        const { listingId, variantId } = resolveProductIds(product)
        const numericListingId = Number(listingId)
        const numericVariantId = Number(variantId)
        const hasListingId = Number.isInteger(numericListingId) && numericListingId > 0
        const hasVariantId = Number.isInteger(numericVariantId) && numericVariantId > 0

        if (!hasListingId && !hasVariantId) {
          toast.error('This product cannot be added to cart yet.')
          return null
        }

        const payload = await cartService.addItem({
          variantId: hasVariantId ? numericVariantId : undefined,
          productId: hasListingId ? numericListingId : undefined,
          listingId: hasListingId ? numericListingId : undefined,
          quantity,
          color,
          size,
        })
        applyServerCart(payload)
        toast.success('Added to cart')
        return payload
      } catch (error) {
        toast.error(error.message || 'Could not add to cart')
        return null
      }
    },
    [applyServerCart],
  )

  const removeFromCart = useCallback(
    async (lineId) => {
      if (!isAuthenticated()) {
        toast.error('Please sign in to manage your cart.')
        return null
      }

      try {
        const payload = await cartService.removeItem(lineId)
        applyServerCart(payload)
        toast.success('Removed from cart')
        return payload
      } catch (error) {
        toast.error(error.message || 'Could not remove item')
        return null
      }
    },
    [applyServerCart],
  )

  const updateCartQuantity = useCallback(
    async (lineId, quantity) => {
      const nextQty = Math.max(1, Number(quantity) || 1)

      if (!isAuthenticated()) {
        toast.error('Please sign in to manage your cart.')
        return null
      }

      try {
        const payload = await cartService.updateQuantity(lineId, nextQty)
        applyServerCart(payload)
        return payload
      } catch (error) {
        toast.error(error.message || 'Could not update quantity')
        return null
      }
    },
    [applyServerCart],
  )

  const clearCart = useCallback(async () => {
    if (!isAuthenticated()) {
      toast.error('Please sign in to manage your cart.')
      return null
    }

    try {
      const payload = await cartService.clear()
      applyServerCart(payload)
      toast.success('Cart cleared')
      return payload
    } catch (error) {
      toast.error(error.message || 'Could not clear cart')
      return null
    }
  }, [applyServerCart])

  const toggleWishlist = useCallback((product) => {
    const snapshot = toShopSnapshot(product)
    const list = readStorage(WISHLIST_KEY, [])
    const exists = list.some((item) => item.id === snapshot.id)
    const next = exists ? list.filter((item) => item.id !== snapshot.id) : [...list, snapshot]
    writeStorage(WISHLIST_KEY, next)
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    const next = readStorage(WISHLIST_KEY, []).filter((item) => item.id !== productId)
    writeStorage(WISHLIST_KEY, next)
  }, [])

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist],
  )

  const moveWishlistToCart = useCallback(
    async (productId) => {
      const item = wishlist.find((i) => i.id === productId)
      if (!item) return
      await addToCart(item, 1)
      removeFromWishlist(productId)
    },
    [wishlist, addToCart, removeFromWishlist],
  )

  const addAllWishlistToCart = useCallback(async () => {
    const list = readStorage(WISHLIST_KEY, [])
    for (const item of list) {
      await addToCart(item, 1)
    }
    writeStorage(WISHLIST_KEY, [])
  }, [addToCart])

  const value = useMemo(
    () => ({
      cart,
      cartSummary,
      cartLoading,
      cartReady,
      wishlist,
      cartCount,
      wishlistCount: wishlist.length,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      moveWishlistToCart,
      addAllWishlistToCart,
    }),
    [
      cart,
      cartSummary,
      cartLoading,
      cartReady,
      wishlist,
      cartCount,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      moveWishlistToCart,
      addAllWishlistToCart,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export { ShopContext }
