import { Link } from 'react-router-dom'
import { MapPin, ShoppingCart, Star } from 'lucide-react'
import CdnImage from '../common/CdnImage'
import { formatLkr } from './searchData'

export default function SearchBestMatch({ product }) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70 p-4 sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Link
          to={`/product/${product.id}`}
          className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-4 shadow-sm sm:mx-0 sm:h-40 sm:w-40"
        >
          <CdnImage src={product.image} alt="" className="max-h-full max-w-full object-contain" />
        </Link>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <span className="inline-block rounded-md bg-dcc-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Best Match
          </span>
          <Link to={`/product/${product.id}`}>
            <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900 hover:text-dcc-primary sm:text-xl">
              {product.title}
            </h2>
          </Link>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <span className="text-2xl font-bold text-dcc-primary">{formatLkr(product.price)}</span>
            <span className="text-base text-slate-400 line-through">
              {formatLkr(product.originalPrice)}
            </span>
            <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              -{product.discount}%
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 sm:justify-start">
            <span className="inline-flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="ml-1 font-medium text-slate-800">
                {product.rating} ({product.reviews} Reviews)
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {product.seller} ({product.location})
            </span>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center rounded-lg border-2 border-dcc-primary bg-white px-5 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-violet-50"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
