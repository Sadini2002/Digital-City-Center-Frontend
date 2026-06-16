import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import CdnImage from '../../../components/common/CdnImage'
import { formatLkr } from '../../../components/category/categoryData'

export default function WishlistItemCard({ item, onRemove, onAddToCart }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <Link
        to={`/product/${item.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50"
      >
        <CdnImage src={item.image} alt="" className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.brand}</p>
        <Link
          to={`/product/${item.id}`}
          className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 hover:text-dcc-primary"
        >
          {item.name}
        </Link>
        <p className="mt-2 text-base font-bold text-dcc-primary">{formatLkr(item.price)}</p>
        {item.originalPrice != null && item.originalPrice > item.price && (
          <p className="text-xs text-slate-400 line-through">{formatLkr(item.originalPrice)}</p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onAddToCart(item.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-red-200 hover:text-red-600"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
