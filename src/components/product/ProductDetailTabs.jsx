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

  const selectTab = (id) => {
    setActiveTab(id)
    if (id === 'reviews') onShowReviews?.()
  }

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
        {[
          { id: 'description', label: 'Description' },
          { id: 'specifications', label: 'Specifications' },
          { id: 'reviews', label: `Reviews (${product.reviewCount})` },
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

      {activeTab === 'description' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{product.description}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {product.featureCards.map((card) => (
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

            <div>
              <h3 className="font-semibold text-slate-900">Product Highlights</h3>
              <ul className="mt-3 space-y-2">
                {product.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-dcc-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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

            <div>
              <h3 className="font-semibold text-slate-900">You May Also Like</h3>
              <div className="mt-4 space-y-3">
                {product.relatedProducts.map((item) => (
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
          </div>
        </div>
      )}

      {activeTab === 'specifications' && (
        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          {product.specifications.map((row) => (
            <div
              key={row.label}
              className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:gap-4"
            >
              <dt className="text-sm font-semibold text-slate-700 sm:w-36">{row.label}</dt>
              <dd className="text-sm text-slate-600">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {activeTab === 'reviews' && (
        <p className="mt-6 text-sm text-slate-600">
          See customer reviews below.
        </p>
      )}
    </div>
  )
}
