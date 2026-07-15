import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CdnImage from '../components/common/CdnImage'
import { shopApi, normalizeShop, normalizeListing } from '../services/api/shopApi'
import NotFoundPage from './NotFoundPage'


export default function ShopPage() {
  const shopname = useParams().shopname
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadShop() {
      setLoading(true)
      setNotFound(false)
      try {
        const [shopRes, productsRes] = await Promise.all([
          shopApi.getByUrl(shopname),
          shopApi.getProductsByUrl(shopname).catch(() => ({ data: { data: [] } })),
        ])
        if (cancelled) return
        const rawShop = shopRes?.data?.data
        if (!rawShop) {
          setNotFound(true)
        } else {
          setShop(normalizeShop(rawShop))
          const rawProducts = productsRes?.data?.data ?? []
          setProducts(rawProducts.map(normalizeListing).filter(Boolean))
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadShop()
    return () => {
      cancelled = true
    }
  }, [shopname])

  if (loading) {
    return (
      <div className="min-w-0 bg-slate-50">
        <PageContainer className="pb-12">
          <div className="mt-4 h-64 animate-pulse rounded-3xl border bg-white" />
        </PageContainer>
      </div>
    )
  }

  if (notFound || !shop) {
    return <NotFoundPage />
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shops', to: '/shops' },
    { label: shop.name, to: null },
  ]

  return (
    <div className="min-w-0 bg-slate-50">
      <PageContainer className="pb-12">

        <ProductBreadcrumbs items={breadcrumbs} />

        {/* HERO HEADER (MATCH UI IMAGE STYLE) */}
        <div className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-sm">

          {/* Banner */}
          <div className="relative h-52 w-full sm:h-64">
            {shop.image ? (
              <CdnImage
                src={shop.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${shop.hue}`} />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* SHOP INFO OVERLAY SECTION */}
          <div className="relative -mt-16 px-6 pb-6">
            <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dcc-primary to-violet-600 text-lg font-bold text-white shadow">
                  {shop.logo}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">
                      {shop.name}
                    </h1>
                    {shop.verified && (
                      <BadgeCheck className="h-5 w-5 text-dcc-primary" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">
                      {shop.rating != null ? shop.rating.toFixed(1) : 'New'}
                    </span>
                    <span>• {shop.productsLabel}</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {shop.businessType ? `${shop.businessType} • ` : ''}
                    {shop.memberSince ? `Member since ${shop.memberSince}` : ''}
                  </p>
                </div>
              </div>

              {/* RIGHT BUTTON */}
              <Link
                to="/shops"
                className="rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                All shops
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION TITLE */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">All Listings</h2>
          <p className="text-sm text-slate-600">
            {products.length} products from this shop
          </p>
        </div>

        {/* PRODUCT GRID (MATCH MARKETPLACE STYLE) */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))}
        </div>

      </PageContainer>
    </div>
  )
}