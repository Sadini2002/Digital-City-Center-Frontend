import { Link } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'

export default function ProductTable({ products, onDelete, onToggleAvailability }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">No listings found.</p>
        <Link
          to="/seller/listings/new"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
        >
          Add your first product
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-5 py-3 font-semibold w-20">Image</th>
            <th className="px-5 py-3 font-semibold w-24">Product ID</th>
            <th className="px-5 py-3 font-semibold">Name</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Stock</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold text-right w-56">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const id = product._id || product.id
            const imageUrl = Array.isArray(product.image)
              ? product.image[0]
              : product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60'
            const isAvailable = product.isAvailable !== false && (product.stock == null || Number(product.stock) > 0)
            const isPaused = product.isAvailable === false
            const statusLabel = isPaused ? 'Paused' : isAvailable ? 'Available' : 'Out of Stock'
            const statusClass = isPaused
              ? 'bg-amber-50 text-amber-700 ring-amber-200/80'
              : isAvailable
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'
              : 'bg-red-50 text-red-700 ring-red-200/80'

            const variantSizes = Array.isArray(product.variants?.sizes)
              ? product.variants.sizes.filter(Boolean)
              : Array.isArray(product.sizes)
              ? product.sizes.filter(Boolean)
              : []
            const variantColors = Array.isArray(product.variants?.colors)
              ? product.variants.colors.filter(Boolean)
              : Array.isArray(product.colors)
              ? product.colors.filter(Boolean)
              : []
            const discountPercent = Number(
              product.discount?.percent ||
                (product.labelPrice && product.labelPrice > product.price
                  ? Math.round(((product.labelPrice - product.price) / product.labelPrice) * 100)
                  : 0)
            )
            const discountStart = product.discount?.startDate ? new Date(product.discount.startDate) : null
            const discountEnd = product.discount?.endDate ? new Date(product.discount.endDate) : null
            const now = new Date()
            const isDiscountActive =
              discountPercent > 0 &&
              (!discountStart || now >= discountStart) &&
              (!discountEnd || now <= discountEnd)

            return (
              <tr key={id} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-3.5">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 object-cover shadow-sm"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60'
                    }}
                  />
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-500 text-xs">
                  {product.productId || id}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-900">{product.name}</div>
                  {variantSizes.length > 0 && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      Sizes: {variantSizes.join(', ')}
                    </div>
                  )}
                  {variantColors.length > 0 && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      Colors: {variantColors.join(', ')}
                    </div>
                  )}
                  {isDiscountActive && (
                    <div className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200/80">
                      {`-${discountPercent}% Discount`}
                    </div>
                  )}
                  {discountPercent > 0 && !isDiscountActive && (
                    <div className="mt-1 text-[11px] text-amber-600">Expired discount</div>
                  )}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-800">
                  LKR {Number(product.price || 0).toLocaleString('en-LK')}
                </td>
                <td className="px-5 py-3.5 text-slate-700">
                  {product.stock}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/seller/listings/${id}/edit`}
                      state={product}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-dcc-primary"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Link>
                    {onToggleAvailability && (
                      <button
                        type="button"
                        onClick={() => onToggleAvailability(id, isPaused)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100/80"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
