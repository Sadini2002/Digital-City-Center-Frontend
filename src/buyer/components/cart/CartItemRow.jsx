import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import CdnImage from '../../../components/common/CdnImage'
import { formatLkr } from '../../../components/category/categoryData'

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity
  const productPath = `/product/${item.productId ?? item.listingId ?? item.id}`

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 py-5 sm:flex-row sm:items-center">
      <Link
        to={productPath}
        className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3 sm:h-24 sm:w-24"
      >
        <CdnImage src={item.image} alt="" className="max-h-full max-w-full object-contain" />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.brand}</p>
        <Link to={productPath} className="mt-0.5 block font-semibold text-slate-900 hover:text-dcc-primary">
          {item.name}
        </Link>
        {(item.color || item.size) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
            {item.color && (
              <span className="flex items-center gap-1">
                Color: <span className="text-slate-800">{item.color}</span>
              </span>
            )}
            {item.size && (
              <span>
                Size: <span className="text-slate-800">{item.size}</span>
              </span>
            )}
          </div>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-dcc-primary border border-violet-100">
            Seller: {item.seller || item.sellerName || 'Verified Platform Seller'}
          </span>
        </div>
        {item.stock != null && (
          <p className="mt-1 text-xs text-slate-400">{item.stock} in stock</p>
        )}
        <div className="mt-2 flex items-baseline gap-2 sm:hidden">
          <p className="text-sm font-bold text-dcc-primary">{formatLkr(lineTotal)}</p>
          {item.originalPrice != null && Number(item.originalPrice) > Number(item.price) && (
            <p className="text-xs text-slate-400 line-through">
              {formatLkr(Number(item.originalPrice) * item.quantity)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => onUpdateQuantity(item.lineId || item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => onUpdateQuantity(item.lineId || item.id, item.quantity + 1)}
            disabled={item.stock != null && item.quantity >= item.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden min-w-[7rem] text-right sm:block">
          <p className="text-sm font-bold text-dcc-primary">{formatLkr(lineTotal)}</p>
          {item.originalPrice != null && Number(item.originalPrice) > Number(item.price) && (
            <p className="text-xs text-slate-400 line-through">
              {formatLkr(Number(item.originalPrice) * item.quantity)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.lineId || item.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  )
}
