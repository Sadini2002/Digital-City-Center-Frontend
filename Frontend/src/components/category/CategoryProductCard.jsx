import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import CdnImage from '../common/CdnImage'
import { useShop } from '../../buyer'
import { formatLkr } from './categoryData'

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

function badgeStyles(badge) {
  if (!badge) return ''
  if (badge.type === 'new') return 'bg-teal-500'
  return 'bg-red-500'
}

export default function CategoryProductCard({ product, view = 'grid' }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop()
  const saved = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  if (view === 'list') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition hover:shadow-md"
      >
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3">
          {product.badge && (
            <span
              className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white ${badgeStyles(product.badge)}`}
            >
              {product.badge.label}
            </span>
          )}
          <CdnImage src={product.image} alt="" className="max-h-full max-w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {product.categoryLabel || product.brand}
          </p>
          <h3 className="mt-1 font-bold text-slate-900 group-hover:text-dcc-primary">{product.name}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <StarRow rating={product.rating} />
            <span className="text-xs text-slate-500">
              ({product.sales ? `${product.sales} sold` : `${product.reviews} reviews`})
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-dcc-primary">{formatLkr(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatLkr(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 self-end">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
              saved ? 'border-pink-200 bg-pink-50 text-pink-500' : 'border-slate-200 text-slate-500'
            }`}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-dcc-primary text-white hover:bg-dcc-primary-hover"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition hover:shadow-md"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-50/80 p-5">
        {product.badge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${badgeStyles(product.badge)}`}
          >
            {product.badge.label}
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition ${
            saved ? 'text-pink-500' : 'text-slate-400 hover:text-red-500'
          }`}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} strokeWidth={1.75} />
        </button>
        <CdnImage
          src={product.image}
          alt=""
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {product.categoryLabel || product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-900 group-hover:text-dcc-primary">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <StarRow rating={product.rating} />
          <span className="text-xs text-slate-500">
            ({product.sales ? `${product.sales} sold` : `${product.reviews} reviews`})
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2 pr-12">
          <span className="text-base font-bold text-dcc-primary">{formatLkr(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatLkr(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-dcc-primary text-white shadow-sm hover:bg-dcc-primary-hover"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </Link>
  )
}
