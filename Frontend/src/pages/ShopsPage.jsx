import { Link } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import { getAllShops } from '../data/shopsData'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shops', to: null },
]

export default function ShopsPage() {
  const shops = getAllShops()

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Marketplace shops</h1>
        <p className="mt-1 text-sm text-slate-600">Browse verified sellers across Sri Lanka.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link
              key={shop.slug}
              to={`/shop/${shop.slug}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className={`h-24 bg-gradient-to-br ${shop.hue}`} />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{shop.name}</span>
                  {shop.verified && (
                    <BadgeCheck className="h-4 w-4 text-dcc-primary" aria-label="Verified" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-700">{shop.rating}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{shop.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
