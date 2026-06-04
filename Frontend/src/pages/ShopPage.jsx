import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CdnImage from '../components/common/CdnImage'
import { getShopBySlug, getShopProducts } from '../data/shopsData'
import NotFoundPage from './NotFoundPage'

export default function ShopPage() {
  const shopname = useParams().shopname
  const shop = getShopBySlug(shopname)
  const products = useMemo(() => (shop ? getShopProducts(shop) : []), [shop])

  if (!shop) {
    return <NotFoundPage />
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shops', to: '/shops' },
    { label: shop.name, to: null },
  ]

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-36 w-full overflow-hidden bg-slate-100 sm:h-48">
            {shop.image ? (
              <CdnImage
                src={shop.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${shop.hue}`} />
            )}
            <div className="absolute inset-0 bg-slate-950/10" />
          </div>
          <div className="flex flex-col gap-4 border-t border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-dcc-primary to-violet-600 text-lg font-bold text-white shadow-md">
                {shop.logo}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{shop.name}</h1>
                  {shop.verified && (
                    <BadgeCheck className="h-6 w-6 text-dcc-primary" aria-label="Verified seller" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">{shop.rating}</span>
                  <span className="text-sm text-slate-500">· {shop.productsLabel}</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">{shop.description}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {shop.location} · Member since {shop.memberSince}
                </p>
              </div>
            </div>
            <Link
              to={`/category/${shop.categorySlug}`}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse category
            </Link>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold text-slate-900">All listings</h2>
        <p className="mt-1 text-sm text-slate-600">{products.length} products from this shop</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
