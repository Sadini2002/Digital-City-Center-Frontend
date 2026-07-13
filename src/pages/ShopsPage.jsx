import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CdnImage from '../components/common/CdnImage'
import { shopApi, normalizeShop } from '../services/api/shopApi'
import NotFoundPage from './NotFoundPage'
import { formatLkr } from '../data/productsCatalog'
import { slugifyShopName } from '../data/shopsData'
import ShopStats from '../components/shop/ShopStats'
import StarRating from '../components/shop/StarRating'


const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shops', to: null },
]

export default function ShopsPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadShops() {
      setLoading(true)
      setError(null)
      try {
        const response = await shopApi.getAll()
        const rawShops = response?.data?.data ?? []
        if (!cancelled) {
          setShops(rawShops.map(normalizeShop).filter(Boolean))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.error || err?.message || 'Failed to load shops.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadShops()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Marketplace shops</h1>
        <p className="mt-1 text-sm text-slate-600">Browse verified sellers across Sri Lanka.</p>

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && shops.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No shops found yet.
          </div>
        )}

        {!loading && !error && shops.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link
              key={shop.slug}
              to={`/shop/${shop.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Banner Area */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                {shop.image ? (
                  <CdnImage
                    src={shop.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${shop.hue}`} />
                )}
                {/* Overlay to dim slightly */}
                <div className="absolute inset-0 bg-slate-950/10" />
              </div>

              {/* Shop info container with offset padding for avatar */}
              <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7">
                {/* Logo Avatar overlapping banner */}
                <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-dcc-primary to-violet-600 font-bold text-white shadow-md">
                  {shop.logo}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 group-hover:text-dcc-primary transition-colors">
                    {shop.name}
                  </span>
                  {shop.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-dcc-primary fill-violet-100" aria-label="Verified" />
                  )}
                </div>

                <div className="mt-1.5 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    {shop.rating != null ? shop.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-slate-300 mx-1.5">|</span>
                  <span className="text-xs text-slate-500">{shop.productsLabel}</span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500 flex-1">
                  {shop.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        )}
      </PageContainer>
    </div>
  )
}