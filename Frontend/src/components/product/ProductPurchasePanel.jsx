import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useShop } from '../../buyer'
import {
  BadgeCheck,
  Box,
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  Star,
  Truck,
} from 'lucide-react'
import WishlistButton from '../common/WishlistButton'
import { formatLkr } from '../../data/productsCatalog'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function ProductPurchasePanel({ product, selectedColorId, onColorChange }) {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const hasColors = product.colors?.length > 0
  const hasSizes = product.sizes?.length > 0
  // colorId comes from parent (lifted state); fall back to local if not provided
  const colorId = selectedColorId ?? product.defaultColorId ?? product.colors?.[0]?.id
  const [size, setSize] = useState(product.defaultSize ?? product.sizes?.[0])
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0)

  const isQuantityTooHigh = quantity !== '' && parseInt(quantity, 10) > product.stock
  const isQuantityTooLow = quantity !== '' && parseInt(quantity, 10) < 1
  const isQuantityInvalid = isQuantityTooHigh || isQuantityTooLow || quantity === ''

  const selectedColor = product.colors?.find((c) => c.id === colorId)

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('This item is currently out of stock.')
      return
    }
    if (quantity === '' || isNaN(parseInt(quantity, 10))) {
      toast.error('Please enter a valid quantity.')
      return
    }
    const qVal = parseInt(quantity, 10)
    if (qVal > product.stock) {
      toast.error(`Cannot add more than ${product.stock} items to cart.`)
      return
    }
    if (qVal < 1) {
      toast.error('Quantity must be at least 1.')
      return
    }

    addToCart(
      {
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0],
        seller: product.seller,
        color: selectedColor?.name,
        size: size,
      },
      qVal,
    )
    toast.success(`${qVal} x ${product.title} added to cart!`)
  }

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error('This item is currently out of stock.')
      return
    }
    if (quantity === '' || isNaN(parseInt(quantity, 10))) {
      toast.error('Please enter a valid quantity.')
      return
    }
    const qVal = parseInt(quantity, 10)
    if (qVal > product.stock) {
      toast.error(`Cannot purchase more than ${product.stock} items.`)
      return
    }
    if (qVal < 1) {
      toast.error('Quantity must be at least 1.')
      return
    }

    addToCart(
      {
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0],
        seller: product.seller,
        color: selectedColor?.name,
        size: size,
      },
      qVal,
    )
    navigate('/cart')
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <StarRating rating={product.rating} />
        <span>
          ({product.reviewCount} Reviews) | {product.rating} Rating
        </span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl lg:text-[1.65rem]">
        {product.title}
      </h1>

      <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{product.seller.name}</span>
            {product.seller.verified && (
              <BadgeCheck className="h-5 w-5 text-dcc-primary" aria-label="Verified seller" />
            )}
          </div>
          <Link
            to={`/shop/${product.seller.shopSlug}`}
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View Shop
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">{product.seller.feedback}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {formatLkr(product.price)}
        </span>
        {product.originalPrice != null && product.originalPrice > product.price && (
          <span className="text-lg text-slate-400 line-through">
            {formatLkr(product.originalPrice)}
          </span>
        )}
      </div>

      {product.stock > 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600">
          <Box className="h-4 w-4" />
          IN STOCK ({product.stock} UNITS REMAINING)
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-600">
          <Box className="h-4 w-4" />
          OUT OF STOCK (0 UNITS REMAINING)
        </p>
      )}

      {hasColors && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.colorLabel ?? 'Select color'}
            {selectedColor?.name ? `: ${selectedColor.name}` : ''}
          </p>
          <div className="mt-2 flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  if (onColorChange) onColorChange(color.id)
                }}
                className={`h-9 w-9 rounded-full border-2 ${
                  colorId === color.id ? 'border-dcc-primary ring-2 ring-dcc-primary/30' : 'border-slate-200'
                }`}
                style={{ backgroundColor: color.swatch }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {hasSizes && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.sizeLabel ?? 'Size'}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  size === option
                    ? 'bg-dcc-primary text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:border-dcc-primary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white max-w-[140px]">
            <button
              type="button"
              className="touch-target px-3 text-slate-605 hover:bg-slate-50 disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, (parseInt(q, 10) || 1) - 1))}
              disabled={product.stock <= 0 || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              disabled={product.stock <= 0}
              value={quantity}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  setQuantity('')
                } else {
                  setQuantity(parseInt(val, 10))
                }
              }}
              className="w-12 border-0 bg-transparent text-center text-sm font-semibold p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="touch-target px-3 text-slate-605 hover:bg-slate-50 disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(product.stock, (parseInt(q, 10) || 0) + 1))}
              disabled={product.stock <= 0 || parseInt(quantity, 10) >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
          </button>
          <WishlistButton
            product={{
              id: product.id,
              title: product.title,
              brand: product.brand,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images?.[0],
              seller: product.seller,
            }}
            showLabel
            className="shrink-0 rounded-xl sm:rounded-full"
          />
        </div>
      </div>

      {/* Inline Validation Warnings */}
      {product.stock > 0 && isQuantityTooHigh && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          Quantity exceeds available stock of {product.stock} units.
        </p>
      )}
      {product.stock > 0 && isQuantityTooLow && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          Quantity must be at least 1.
        </p>
      )}
      {product.stock <= 0 && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          This item is currently out of stock.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Truck className="h-4 w-4 text-sky-600" />
          Fast Delivery
        </span>
        <span className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          1 Year Warranty
        </span>
      </div>
    </div>
  )
}
