import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { toCartLine, toShopSnapshot } from './shopUtils'

const CART_KEY = 'dcc_cart'
const WISHLIST_KEY = 'dcc_wishlist'

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (key === CART_KEY || key === WISHLIST_KEY) {
      return Array.isArray(parsed) ? parsed : fallback
    }
    return parsed
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

function normalizeLineId(line) {
  return line.lineId ?? [line.id, line.color ?? '', line.size ?? ''].join('::')
}

function getCart() {
  return Array.isArray(cartCache)
    ? cartCache.map((line) => ({ ...line, lineId: normalizeLineId(line) }))
    : []
}

function getWishlist() {
  return Array.isArray(wishlistCache) ? wishlistCache : []
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(getCart)
  const [wishlist, setWishlist] = useState(getWishlist)

  useEffect(() => {
    const handler = () => {
      setCart(getCart())
      setWishlist(getWishlist())
    }

    window.addEventListener('dcc-shop-update', handler)
    window.addEventListener('storage', handler)

    return () => {
      window.removeEventListener('dcc-shop-update', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cart],
  )

  const addToCart = useCallback((product, quantity = 1) => {
    const snapshot = toShopSnapshot(product)
    const lineId = normalizeLineId(snapshot)
    const next = [...readStorage(CART_KEY, [])].map((line) => ({ ...line, lineId: normalizeLineId(line) }))
    const index = next.findIndex((line) => line.lineId === lineId)
    const availableStock = product.stock ?? snapshot.stock ?? Infinity

    if (availableStock !== Infinity && quantity > availableStock) {
      toast.error(`Only ${availableStock} unit(s) available in stock.`)
      return
    }

    if (index >= 0) {
      const newQty = next[index].quantity + quantity
      if (availableStock !== Infinity && newQty > availableStock) {
        toast.error(`Cannot add more. Only ${availableStock} unit(s) in stock.`)
        return
      }
      next[index] = { ...next[index], quantity: newQty }
    } else {
      next.push({
        ...toCartLine(snapshot, quantity),
        lineId,
        stock: availableStock !== Infinity ? availableStock : undefined,
      })
    }
    writeStorage(CART_KEY, next)
  }, [])

  const removeFromCart = useCallback((lineId) => {
    const next = readStorage(CART_KEY, []).map((line) => ({ ...line, lineId: normalizeLineId(line) })).filter((line) => line.lineId !== lineId)
    writeStorage(CART_KEY, next)
  }, [])

  const updateCartQuantity = useCallback((lineId, quantity) => {
    const next = readStorage(CART_KEY, []).map((line) => {
      const normalizedLine = { ...line, lineId: normalizeLineId(line) }
      if (normalizedLine.lineId !== lineId) return normalizedLine
      const max = normalizedLine.stock ?? Infinity
      const safeQty = Math.max(1, quantity)
      if (max !== Infinity && safeQty > max) {
        toast.error(`Only ${max} unit(s) available in stock.`)
        return { ...normalizedLine, quantity: max }
      }
      return { ...normalizedLine, quantity: safeQty }
    })
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
