import { Link } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'

export default function ProductTable({ products, onDelete }) {
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
            <th className="px-5 py-3 font-semibold text-right w-44">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const id = product._id || product.id
            const imageUrl = Array.isArray(product.image)
              ? product.image[0]
              : product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60'
            const isAvailable = product.isAvailable && product.stock > 0

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
                  
                  {/* Display Variants */}
                  {((product.variants?.sizes && product.variants.sizes.length > 0) || 
                    (product.variants?.colors && product.variants.colors.length > 0)) && (
                    <div className="mt-1 flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-0.5">Variants:</span>
                      {product.variants?.sizes?.map(size => (
                        <span key={size} className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-semibold text-slate-600">
                          {size}
                        </span>
                      ))}
                      {product.variants?.colors?.map(color => (
                        <span key={color} className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full border border-slate-300" style={{ backgroundColor: color }} />
                          {color}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Display Discount */}
                  {product.discount?.percent > 0 && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold">
                        {product.discount.percent}% OFF
                      </span>
                      {product.discount.startDate && product.discount.endDate && (
                        <span className="text-[10px] text-slate-400">
                          ({product.discount.startDate} to {product.discount.endDate})
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {product.discount?.percent > 0 ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        LKR {Number(product.price * (1 - product.discount.percent / 100)).toLocaleString('en-LK')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        LKR {Number(product.price).toLocaleString('en-LK')}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium text-slate-800">
                      LKR {Number(product.price || 0).toLocaleString('en-LK')}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-700">
                  {product.stock}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'
                        : 'bg-red-50 text-red-700 ring-red-200/80'
                    }`}
                  >
                    {isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to={`/seller/listings/${id}/edit`}
                      state={product}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-dcc-primary"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Link>
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
