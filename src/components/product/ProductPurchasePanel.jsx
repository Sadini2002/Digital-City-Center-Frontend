import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../../buyer'
import { BadgeCheck, Box, Minus, Plus, ShoppingCart, Shield, Star, Truck } from 'lucide-react'
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

export default function ProductPurchasePanel({ product, onVariantSelect, onSelectColor }) {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const { variants, selectedVariant } = product

  const [quantity, setQuantity] = useState(1)
  
  // 1. Local state override: only store attribute changes made manually by clicking
  const [localAttributes, setLocalAttributes] = useState(null)

  // 2. Derive the actual active attributes without synchronizing state inside an effect
  const activeAttributes = localAttributes || selectedVariant?.attributes || {}

  // 3. Compute dynamic option selections directly out of database variants
  const getUniqueAttributeOptions = () => {
    const optionsMap = {}
    variants?.forEach((v) => {
      if (v.attributes) {
        Object.entries(v.attributes).forEach(([key, value]) => {
          if (!optionsMap[key]) optionsMap[key] = new Set()
          optionsMap[key].add(value)
        })
      }
    })
    return Object.entries(optionsMap).reduce((acc, [key, set]) => {
      acc[key] = Array.from(set)
      return acc
    }, {})
  }

  const attributeOptions = getUniqueAttributeOptions()
  const hasVariants = Object.keys(attributeOptions).length > 0

  // 4. Inform parent page when button attributes shift
  const handleAttributeClick = (attributeName, value) => {
    const nextAttributes = {
      ...activeAttributes,
      [attributeName]: value,
    }
    
    // Save locally to keep UI buttons highly responsive
    setLocalAttributes(nextAttributes)

    if (onVariantSelect) {
      onVariantSelect(nextAttributes)
    }

    // Trigger image gallery preview reset if color shifts
    if (attributeName === 'Color' && onSelectColor) {
      onSelectColor(0)
    }
  }

  // Reset local adjustments if the base item itself changes out from underneath us
  // We do this by tracking changes using keys instead of a side-effect block
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
        variantId: selectedVariant?.id,
      },
      quantity,
      activeAttributes['Color'] || '',
      activeAttributes['Size'] || '',
    )
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const currentStock = selectedVariant ? selectedVariant.stock : 0

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <StarRating rating={product.rating || 5} />
        <span>
          ({product.reviewCount || 0} Reviews) | {product.rating || 5} Rating
        </span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl lg:text-[1.65rem]">
        {product.title}
      </h1>

      <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {product.seller?.shopName || product.seller?.name || 'City Retailer'}
            </span>
            {product.seller?.verified && (
              <BadgeCheck className="h-5 w-5 text-dcc-primary" aria-label="Verified seller" />
            )}
          </div>
          <Link
            to={`/shop/${product.seller?.shopUrl || ''}`}
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View Shop
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">{product.seller?.businessType} Store</p>
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

      <p
        className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
          currentStock > 0 ? 'text-green-600' : 'text-rose-600'
        }`}
      >
        <Box className="h-4 w-4" />
        {currentStock > 0 ? `IN STOCK (${currentStock} UNITS REMAINING)` : 'OUT OF STOCK'}
      </p>

      {/* Render Dynamic Attributes */}
      {hasVariants && (
        <div className="mt-6 space-y-5">
          {Object.entries(attributeOptions).map(([attributeName, values]) => (
            <div key={attributeName}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Select {attributeName}
                {activeAttributes[attributeName] ? `: ${activeAttributes[attributeName]}` : ''}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 items-center">
                {values.map((value) => {
                  const isSelected = activeAttributes[attributeName] === value

                  // 1. Check if this attribute group is the Color selector
                  if (attributeName.toLowerCase() === 'color') {
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAttributeClick(attributeName, value)}
                        className={`h-9 w-9 rounded-full border-2 transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-dcc-primary ring-2 ring-dcc-primary/30 scale-105 shadow-sm'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                        // 2. Map the string name (e.g. "Black", "Red", "#ffffff") directly to CSS background
                        style={{ backgroundColor: value.toLowerCase() }}
                        aria-label={value}
                        title={value} // Shows color name on hover
                      />
                    )
                  }

                  // 3. Fallback to normal text buttons for other attributes (like Size, Storage, etc.)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAttributeClick(attributeName, value)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-dcc-primary text-white shadow-sm ring-2 ring-dcc-primary/20'
                          : 'border border-slate-300 bg-white text-slate-700 hover:border-dcc-primary'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            className="touch-target px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={currentStock === 0}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-semibold">
            {currentStock > 0 ? quantity : 0}
          </span>
          <button
            type="button"
            className="touch-target px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            disabled={currentStock === 0 || quantity >= currentStock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={currentStock === 0}
            className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
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