import { useState } from 'react'
import { Link } from 'react-router-dom'
import CdnImage from '../common/CdnImage'
import { Battery, Check, Heart, Star } from 'lucide-react'
import { formatLkr } from './productDetailData'

function FeatureIcon({ type }) {
  if (type === 'battery') return <Battery className="h-5 w-5 text-dcc-primary" />
  return <Heart className="h-5 w-5 text-dcc-primary" />
}

export default function ProductDetailTabs({ product, onShowReviews }) {
  const [activeTab, setActiveTab] = useState('description')

  if (!product) return null

  const reviewsArray = product.reviews || []
  const reviewCount = reviewsArray.length

  const featureCards = product.featureCards || []
  const highlights = product.highlights || []
  const relatedProducts = product.relatedProducts || []

  // 1. Core overall metadata
  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) ?? 0;
  const globalSpecs = [
    { label: 'Status Available', value: product.status ? product.status.toUpperCase() : 'ACTIVE' },
    { label: 'Total Inventory', value: `${totalStock} items available` },
    { label: 'Product Category', value: product.category?.name || 'General' },
  ];

  const selectTab = (id) => {
    setActiveTab(id)
    if (id === 'reviews') onShowReviews?.()
  }

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      {/* Tab Selectors */}
      <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
        {[
          { id: 'description', label: 'Description' },
          { id: 'specifications', label: 'Specifications' },
          { id: 'reviews', label: `Reviews (${reviewCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-dcc-primary text-dcc-primary'
                : 'border-transparent text-slate-600 hover:text-dcc-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB 1: DESCRIPTION --- */}
      {activeTab === 'description' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{product.description}</p>

            {featureCards.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {featureCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                      <FeatureIcon type={card.icon} />
                    </div>
                    <h3 className="mt-3 font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                  </div>
                ))}
              </div>
            )}

            {highlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900">Product Highlights</h3>
                <ul className="mt-3 space-y-2">
                  {highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-dcc-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-dcc-primary p-6 text-white">
              <h3 className="text-lg font-bold">Bundle & Save!</h3>
              <p className="mt-2 text-sm text-white/90">
                Pair with accessories and save up to 15% on your order.
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-violet-50"
              >
                View Bundle Deals
              </button>
            </div>

            {relatedProducts.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900">You May Also Like</h3>
                <div className="mt-4 space-y-3">
                  {relatedProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-dcc-primary/30 hover:bg-violet-50/30"
                    >
                      {item.image ? (
                        <CdnImage
                          src={item.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm font-bold text-dcc-primary">{formatLkr(item.price)}</p>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.rating}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: SPECIFICATIONS (REFACTORED MATRIX STYLE) --- */}
      {activeTab === 'specifications' && (
        <div className="mt-8 space-y-8">
          {/* General Metadata cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              General Information
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {globalSpecs.map((spec) => (
                <div key={spec.label} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <span className="text-xs font-medium text-slate-400">{spec.label}</span>
                  <span className="mt-1 text-sm font-semibold text-slate-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Options Data Table */}
          {product.variants?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Available Variant Combinations
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-4">Options</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-center">Available Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {product.variants.map((variant, i) => {
                        const optString = variant.attributes
                          ? Object.values(variant.attributes).join(' / ')
                          : `Variant ${i + 1}`;

                        return (
                          <tr key={variant.id || i} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 font-semibold text-slate-900">
                              <span className="inline-flex items-center rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 border border-violet-100/80">
                                {optString}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-xs text-slate-500 font-medium tracking-wide">
                              {variant.sku || '—'}
                            </td>
                            <td className="p-4 text-right font-semibold text-slate-900">
                              {formatLkr(variant.price)}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                (variant.stock || 0) > 0 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : 'bg-rose-50 text-rose-700'
                              }`}>
                                {variant.stock || 0} left
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: REVIEWS --- */}
      {activeTab === 'reviews' && (
        <p className="mt-6 text-sm text-slate-600">
          See customer reviews below.
        </p>
      )}
    </div>
  )
}