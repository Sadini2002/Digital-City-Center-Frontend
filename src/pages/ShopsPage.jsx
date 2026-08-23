import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Loader2, PackageSearch, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CdnImage from '../components/common/CdnImage'
import { shopApi } from '../services/api'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shops', to: null },
]

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SH'
}

function mapShopCard(shop) {
  const listingCount = shop._count?.listings ?? shop.productCount ?? 0
  const slug = shop.shopUrl
  if (!slug) return null

  return {
    id: shop.id,
    slug,
    name: shop.shopName,
    rating: Number(shop.rating ?? 5).toFixed(1),
    verified: String(shop.status || '').toLowerCase() === 'active',
    description: shop.businessType
      ? `${shop.shopName} — ${shop.businessType} on Digital City Center.`
      : `${shop.shopName} on Digital City Center.`,
    logo: initials(shop.shopName),
    productsLabel: `${listingCount} product${listingCount === 1 ? '' : 's'}`,
    hue: 'from-slate-200 to-slate-300',
    image: shop.bannerImage || shop.image || '',
  }
}

export default function ShopsPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadShops() {
      setLoading(true)
      setError('')
      try {
        const res = await shopApi.getAll()
        const data = res?.data?.data ?? res?.data ?? []
        const mapped = (Array.isArray(data) ? data : []).map(mapShopCard).filter(Boolean)
        if (!cancelled) setShops(mapped)
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load shops')
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
          <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />
            <p className="text-sm">Loading shops…</p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-16 flex flex-col items-center gap-3 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && shops.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
            <PackageSearch className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium">No shops available yet.</p>
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
                  <div className="absolute inset-0 bg-slate-950/10" />
                </div>

                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7">
                  <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-dcc-primary to-violet-600 font-bold text-white shadow-md">
                    {shop.logo}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 transition-colors group-hover:text-dcc-primary">
                      {shop.name}
                    </span>
                    {shop.verified && (
                      <BadgeCheck
                        className="h-4 w-4 shrink-0 fill-violet-100 text-dcc-primary"
                        aria-label="Verified"
                      />
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700">{shop.rating}</span>
                    <span className="mx-1.5 text-slate-300">|</span>
                    <span className="text-xs text-slate-500">{shop.productsLabel}</span>
                  </div>

                  <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
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
