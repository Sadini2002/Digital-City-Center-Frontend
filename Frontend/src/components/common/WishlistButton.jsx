import { Heart } from 'lucide-react'
import { useShop } from '../../buyer'

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
}

/** @param {{ product: object, size?: 'sm' | 'md' | 'lg', className?: string, showLabel?: boolean }} props */
export default function WishlistButton({ product, size = 'md', className = '', showLabel = false }) {
  const { toggleWishlist, isInWishlist } = useShop()
  const saved = isInWishlist(product.id)

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(product)}
      className={`inline-flex items-center justify-center gap-2 rounded-full border transition ${
        saved
          ? 'border-pink-200 bg-pink-50 text-pink-500'
          : 'border-slate-200 bg-white text-slate-500 hover:border-pink-200 hover:text-pink-500'
      } ${showLabel ? 'px-4 py-2.5' : sizeClasses[size]} ${className}`}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
    >
      <Heart className={`${iconSizes[size]} ${saved ? 'fill-current' : ''}`} strokeWidth={1.75} />
      {showLabel && (
        <span className="text-sm font-semibold">{saved ? 'Saved' : 'Save'}</span>
      )}
    </button>
  )
}
