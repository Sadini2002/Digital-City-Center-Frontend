import { createContext, useCallback, useMemo, useSyncExternalStore } from 'react'
import { toCartLine, toShopSnapshot } from './shopUtils'

const CART_KEY = 'dcc_cart'
const WISHLIST_KEY = 'dcc_wishlist'

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

let cartCache = readStorage(CART_KEY, [])
let wishlistCache = readStorage(WISHLIST_KEY, [])

function subscribe(callback) {
  const handler = () => {
    cartCache = readStorage(CART_KEY, [])
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

function getCart() {
  return cartCache
}

function getWishlist() {
  return wishlistCache
}

export function ShopProvider({ children }) {
  const cart = useSyncExternalStore(subscribe, getCart, () => [])
  const wishlist = useSyncExternalStore(subscribe, getWishlist, () => [])

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const addToCart = useCallback((product, quantity = 1) => {
    const snapshot = toShopSnapshot(product)
    const next = [...readStorage(CART_KEY, [])]
    const index = next.findIndex((line) => line.id === snapshot.id)
    if (index >= 0) {
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + quantity,
      }
    } else {
      next.push(toCartLine(snapshot, quantity))
    }
    writeStorage(CART_KEY, next)
  }, [])

  const removeFromCart = useCallback((productId) => {
    const next = readStorage(CART_KEY, []).filter((line) => line.id !== productId)
    writeStorage(CART_KEY, next)
  }, [])

  const updateCartQuantity = useCallback((productId, quantity) => {
    const next = readStorage(CART_KEY, []).map((line) =>
      line.id === productId ? { ...line, quantity: Math.max(1, quantity) } : line,
    )
    writeStorage(CART_KEY, next)
  }, [])

  const clearCart = useCallback(() => {
    writeStorage(CART_KEY, [])
  }, [])

  const toggleWishlist = useCallback((product) => {
    const snapshot = toShopSnapshot(product)
    const list = readStorage(WISHLIST_KEY, [])
    const exists = list.some((item) => item.id === snapshot.id)
    const next = exists
      ? list.filter((item) => item.id !== snapshot.id)
      : [...list, snapshot]
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
    (productId) => {
      const item = wishlist.find((i) => i.id === productId)
      if (item) {
        addToCart(item, 1)
        removeFromWishlist(productId)
      }
    },
    [wishlist, addToCart, removeFromWishlist],
  )

  const addAllWishlistToCart = useCallback(() => {
    const list = readStorage(WISHLIST_KEY, [])
    const cart = readStorage(CART_KEY, [])
    list.forEach((item) => {
      const index = cart.findIndex((line) => line.id === item.id)
      if (index >= 0) {
        cart[index] = { ...cart[index], quantity: cart[index].quantity + 1 }
      } else {
        cart.push({ ...item, quantity: 1 })
      }
    })
    writeStorage(CART_KEY, cart)
    writeStorage(WISHLIST_KEY, [])
  }, [])

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      wishlistCount: wishlist.length,
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
      wishlist,
      cartCount,
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
