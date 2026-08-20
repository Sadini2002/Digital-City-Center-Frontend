import { useMemo, useState } from 'react'
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
import { resolveVariantId } from '../../buyer/services/productMapper'
import { formatLkr } from '../../data/productsCatalog'
import { getAuthToken } from '../../utils/authStorage'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating || 0)
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-200'
            }`}
        />
      ))}
    </div>
  )
}

export default function ProductPurchasePanel({
  product,
  onSelectColor,
}) {
  const navigate = useNavigate()

  const {
    addToCart,
  } = useShop()

  const hasColors =
    product.colors?.length > 0

  const hasSizes =
    product.sizes?.length > 0

  const [
    colorId,
    setColorId,
  ] = useState(
    product.defaultColorId ??
    product.colors?.[0]?.id,
  )

  const [
    size,
    setSize,
  ] = useState(
    product.defaultSize ??
    product.sizes?.[0],
  )

  const [
    quantity,
    setQuantity,
  ] = useState(1)

  const selectedColor =
    product.colors?.find(
      (color) =>
        color.id === colorId,
    )

  const selectedVariantId =
    useMemo(
      () =>
        resolveVariantId(
          product,
          selectedColor?.name || '',
          size || '',
        ),
      [
        product,
        selectedColor?.name,
        size,
      ],
    )

  const selectedVariant =
    product.variants?.find(
      (variant) =>
        Number(variant.id) ===
        Number(selectedVariantId),
    ) ??
    product.variants?.[0]

  const displayPrice =
    Number(
      selectedVariant?.price ??
      product.price ??
      0,
    )

  const displayStock =
    Number(
      selectedVariant?.stock ??
      product.stock ??
      0,
    )

  const displayImage =
    selectedVariant?.images?.find(
      (image) => image.isMain,
    )?.url ||
    selectedVariant?.images?.[0]?.url ||
    product.images?.[0]

  const hasRealVariant =
    Number.isInteger(
      Number(selectedVariantId),
    ) &&
    Number(selectedVariantId) > 0

  const handleAddToCart =
    async () => {
      if (!getAuthToken()) {
        navigate('/login', {
          state: {
            from: `/product/${product.id}`,
          },
        })

        return null
      }

      if (!hasRealVariant) {
        toast.error(
          'This demo product is not connected to inventory yet.',
        )

        return null
      }

      return await addToCart(
        {
          id: product.id,

          listingId:
            product.listingId ??
            product.id,

          productId:
            product.listingId ??
            product.id,

          variantId:
            Number(
              selectedVariantId,
            ),

          selectedVariantId:
            Number(
              selectedVariantId,
            ),

          title:
            product.title,

          name:
            product.title,

          brand:
            product.brand,

          price:
            displayPrice,

          originalPrice:
            product.originalPrice,

          image:
            displayImage,

          seller:
            product.seller,

          stock:
            displayStock,

          variants:
            product.variants || [],
        },

        quantity,

        selectedColor?.name ||
        '',

        size || '',
      )
    }

  const handleBuyNow =
    async () => {
      if (!getAuthToken()) {
        navigate('/login', {
          state: {
            from: `/product/${product.id}`,
          },
        })

        return
      }

      const result =
        await handleAddToCart()

      if (result) {
        navigate('/cart')
      }
    }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <StarRating
          rating={product.rating}
        />

        <span>
          ({product.reviewCount || 0}{' '}
          Reviews) |{' '}
          {product.rating || 0}{' '}
          Rating
        </span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl lg:text-[1.65rem]">
        {product.title}
      </h1>

      <div className="p-4 mt-4 border rounded-xl border-violet-100 bg-violet-50/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {product.seller?.name ||
                'Marketplace Seller'}
            </span>

            {product.seller?.verified && (
              <BadgeCheck
                className="w-5 h-5 text-dcc-primary"
                aria-label="Verified seller"
              />
            )}
          </div>

          {product.seller?.shopSlug && (
            <Link
              to={`/shop/${product.seller.shopSlug}`}
              className="text-sm font-semibold text-dcc-primary hover:underline"
            >
              View Shop
            </Link>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-600">
          {product.seller?.feedback ||
            'Marketplace seller'}
        </p>
      </div>

      <div className="flex flex-wrap items-baseline gap-3 mt-5">
        <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {formatLkr(displayPrice)}
        </span>

        {product.originalPrice != null &&
          product.originalPrice >
          displayPrice && (
            <span className="text-lg line-through text-slate-400">
              {formatLkr(
                product.originalPrice,
              )}
            </span>
          )}
      </div>

      <p className="flex items-center gap-2 mt-3 text-sm font-semibold text-green-600">
        <Box className="w-4 h-4" />

        {displayStock > 0
          ? `IN STOCK (${displayStock} UNITS REMAINING)`
          : 'OUT OF STOCK'}
      </p>

      {hasColors && (
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
            {product.colorLabel ??
              'Select color'}

            {selectedColor?.name
              ? `: ${selectedColor.name}`
              : ''}
          </p>

          <div className="flex gap-3 mt-2">
            {product.colors.map(
              (color, index) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    setColorId(
                      color.id,
                    )

                    onSelectColor?.(
                      index,
                    )
                  }}
                  className={`h-9 w-9 rounded-full border-2 ${colorId === color.id
                      ? 'border-dcc-primary ring-2 ring-dcc-primary/30'
                      : 'border-slate-200'
                    }`}
                  style={{
                    backgroundColor:
                      color.swatch,
                  }}
                  aria-label={
                    color.name
                  }
                />
              ),
            )}
          </div>
        </div>
      )}

      {hasSizes && (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
            {product.sizeLabel ??
              'Size'}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {product.sizes.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setSize(option)
                  }
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${size === option
                      ? 'bg-dcc-primary text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-dcc-primary'
                    }`}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center">
        <div className="flex items-center border rounded-lg border-slate-200">
          <button
            type="button"
            className="px-3 touch-target text-slate-600 hover:bg-slate-50"
            onClick={() =>
              setQuantity((current) =>
                Math.max(
                  1,
                  current - 1,
                ),
              )
            }
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="min-w-[2.5rem] text-center text-sm font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            className="px-3 touch-target text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            onClick={() =>
              setQuantity((current) =>
                Math.min(
                  Math.max(
                    displayStock,
                    1,
                  ),
                  current + 1,
                ),
              )
            }
            aria-label="Increase quantity"
            disabled={
              displayStock < 1
            }
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              displayStock < 1
            }
            className="inline-flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-dcc-primary hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={
              handleBuyNow
            }
            disabled={
              displayStock < 1
            }
            className="flex-1 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-slate-900 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>

          <WishlistButton
            product={{
              id:
                product.id,

              listingId:
                product.listingId ??
                product.id,

              variantId:
                hasRealVariant
                  ? Number(
                    selectedVariantId,
                  )
                  : undefined,

              title:
                product.title,

              brand:
                product.brand,

              price:
                displayPrice,

              originalPrice:
                product.originalPrice,

              image:
                displayImage,

              seller:
                product.seller,

              stock:
                displayStock,

              variants:
                product.variants || [],
            }}
            showLabel
            className="shrink-0 rounded-xl sm:rounded-full"
          />
        </div>
      </div>

      {!hasRealVariant && (
        <p className="mt-3 text-xs text-amber-600">
          This catalogue item is demo-only and is not connected to live inventory.
        </p>
      )}

      <div className="flex flex-wrap gap-6 mt-5 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Truck className="w-4 h-4 text-sky-600" />
          Fast Delivery
        </span>

        <span className="inline-flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          1 Year Warranty
        </span>
      </div>
    </div>
  )
}