import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function ProductPurchasePanel({ product, onSelectColor }) {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const hasColors = product.colors?.length > 0
  const hasSizes = product.sizes?.length > 0
  const [colorId, setColorId] = useState(product.defaultColorId ?? product.colors?.[0]?.id)
  const [size, setSize] = useState(product.defaultSize ?? product.sizes?.[0])
  const [quantity, setQuantity] = useState(1)

  const selectedColor = product.colors?.find((c) => c.id === colorId)

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0],
        seller: product.seller,
      },
      quantity,
      selectedColor?.name || '',
      size || '',
    )
  }

  const handleBuyNow = () => {
    handleAddToCart()
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

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600">
        <Box className="h-4 w-4" />
        IN STOCK ({product.stock} UNITS REMAINING)
      </p>

      {hasColors && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.colorLabel ?? 'Select color'}
            {selectedColor?.name ? `: ${selectedColor.name}` : ''}
          </p>
          <div className="mt-2 flex gap-3">
            {product.colors.map((color, index) => (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  setColorId(color.id)
                  onSelectColor?.(index)
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
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            className="touch-target px-3 text-slate-600 hover:bg-slate-50"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            className="touch-target px-3 text-slate-600 hover:bg-slate-50"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Buy Now
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
