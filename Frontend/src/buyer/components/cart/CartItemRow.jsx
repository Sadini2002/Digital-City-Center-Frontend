import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import CdnImage from '../../../components/common/CdnImage'
import { formatLkr } from '../../../components/category/categoryData'

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 py-5 sm:flex-row sm:items-center">
      <Link
        to={`/product/${item.id}`}
        className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3 sm:h-24 sm:w-24"
      >
        <CdnImage src={item.image} alt="" className="max-h-full max-w-full object-contain" />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.brand}</p>
        <Link to={`/product/${item.id}`} className="mt-0.5 block font-semibold text-slate-900 hover:text-dcc-primary">
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500">Sold by {item.seller}</p>
        <p className="mt-2 text-sm font-bold text-dcc-primary sm:hidden">{formatLkr(lineTotal)}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            className="px-3 py-2 text-slate-600 hover:bg-slate-50"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p className="hidden min-w-[7rem] text-right text-sm font-bold text-dcc-primary sm:block">
          {formatLkr(lineTotal)}
        </p>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  )
}
