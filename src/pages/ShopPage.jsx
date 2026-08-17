import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Loader2, PackageSearch, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CdnImage from '../components/common/CdnImage'
import { mapListingToCardProduct } from '../buyer/services/productMapper'
import { shopApi } from '../services/api'
import NotFoundPage from './NotFoundPage'

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SH'
}

function mapShop(shop) {
  if (!shop) return null
  const listingCount = shop._count?.listings ?? shop.productCount ?? 0
  const memberYear = shop.memberSince
    ? new Date(shop.memberSince).getFullYear()
    : shop.createdAt
      ? new Date(shop.createdAt).getFullYear()
      : null

  return {
    id: shop.id,
    slug: shop.shopUrl,
    name: shop.shopName,
    rating: Number(shop.rating ?? 5).toFixed(1),
    verified: String(shop.status || '').toLowerCase() === 'active',
    logo: initials(shop.shopName),
    productsLabel: `${listingCount} product${listingCount === 1 ? '' : 's'}`,
    location: shop.location || 'Sri Lanka',
    memberSince: memberYear || '—',
    image: shop.bannerImage || shop.image || '',
    hue: 'from-slate-200 to-slate-300',
    categorySlug: (shop.businessType || 'marketplace')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-'),
  }
}

export default function ShopPage() {
  const shopname = useParams().shopname
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadShop() {
      if (!shopname) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setNotFound(false)

      try {
        const [shopRes, productsRes] = await Promise.all([
          shopApi.getByUrl(shopname),
          shopApi.getProductsByUrl(shopname),
        ])

        const shopData = shopRes?.data?.data ?? shopRes?.data
        const listings = productsRes?.data?.data ?? productsRes?.data ?? []

        if (!shopData) {
          if (!cancelled) setNotFound(true)
          return
        }

        const mappedShop = mapShop(shopData)
        const mappedProducts = (Array.isArray(listings) ? listings : [])
          .map((listing) => mapListingToCardProduct(listing, mappedShop.categorySlug))
          .filter((product) => product && Number.isInteger(product.listingId) && product.listingId > 0)

        if (!cancelled) {
          setShop(mappedShop)
          setProducts(mappedProducts)
        }
      } catch (err) {
        const status = err?.response?.status
        if (status === 404) {
          if (!cancelled) setNotFound(true)
        } else if (!cancelled) {
          setError(err?.message || 'Failed to load shop')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadShop()
    return () => {
      cancelled = true
    }
  }, [shopname])

  const breadcrumbs = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Shops', to: '/shops' },
      { label: shop?.name || 'Shop', to: null },
    ],
    [shop?.name],
  )

  if (loading) {
    return (
      <div className="min-w-0 bg-slate-50">
        <PageContainer className="pb-12">
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />
            <p className="mt-4 text-sm text-slate-600">Loading shop…</p>
          </div>
        </PageContainer>
      </div>
    )
  }

  if (notFound) {
    return <NotFoundPage />
  }

  if (error || !shop) {
    return (
      <div className="min-w-0 bg-slate-50">
        <PageContainer className="pb-12">
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
            <p className="text-sm text-red-500">{error || 'Failed to load shop'}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-w-0 bg-slate-50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="relative h-52 w-full sm:h-64">
            {shop.image ? (
              <CdnImage src={shop.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${shop.hue}`} />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative -mt-16 px-6 pb-6">
            <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dcc-primary to-violet-600 text-lg font-bold text-white shadow">
                  {shop.logo}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{shop.name}</h1>
                    {shop.verified && <BadgeCheck className="h-5 w-5 text-dcc-primary" />}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">{shop.rating}</span>
                    <span>• {shop.productsLabel}</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {shop.location} • Member since {shop.memberSince}
                  </p>
                </div>
              </div>

              <Link
                to={`/category/${shop.categorySlug}`}
                className="rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Browse category
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">All Listings</h2>
          <p className="text-sm text-slate-600">{products.length} products from this shop</p>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
            <PackageSearch className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium">This shop has no active products yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <CategoryProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
