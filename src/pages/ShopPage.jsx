import { useMemo } from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CdnImage from '../components/common/CdnImage'
import NotFoundPage from './NotFoundPage'
import { useEffect } from 'react'
import { getShop, getShopProducts } from '../services/shopService'
import { getShopBySlug } from '../data/shopsData'

export default function ShopPage() {
  const { shopUrl } = useParams()
  useEffect(() => {
  loadShop()
}, [shopUrl])

const loadShop = async () => {
  try {
    console.log("Shop URL:", shopUrl)

    const shopRes = await getShop(shopUrl)
    console.log("Shop Response:", shopRes)

    const productsRes = await getShopProducts(shopUrl)
    console.log("Products Response:", productsRes)

    setShop(shopRes.data.data)
    setShopProducts(productsRes.data.data)
  } catch (error) {
    console.error("ERROR:", error)
    setNotFound(true)
  }
}
  const [shop, setShop] = useState(null)
const [shopProducts, setShopProducts] = useState([])
const [loading, setLoading] = useState(true)
const [notFound, setNotFound] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
const [sortBy, setSortBy] = useState('newest')

const products = useMemo(() => {
  if (!shop) return []

  let filtered = [...shopProducts]

  if (searchTerm) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break

    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break

    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break

    default:
      break
  }

  return filtered
}, [shop, searchTerm, sortBy])
  if (loading) {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      Loading...
    </div>
  )
}

if (notFound) {
  return <NotFoundPage />
}

  const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shops', to: '/shops' },
  { label: shop.shopName || shop.shopname, to: null },
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
                  <h1 className="text-2xl font-bold text-slate-900">{shop.shopname}</h1>
                  {shop.verified && (
                    <BadgeCheck className="h-6 w-6 text-dcc-primary" aria-label="Verified seller" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">{shop.rating}</span>
                  <span className="text-sm text-slate-500">· {shop.productsLabel}</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">{shop.businessType}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {shop.location} · Member since {shop.memberSince}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800">Operating Hours:</span>
                <p>{shop.operatingHours}</p>
               </div>

               <div>
                <span className="text-sm font-semibold text-slate-800">Phone:</span>
                 <p>{shop.user?.phone}</p>
               </div>

               <div>
                <span className="text-sm font-semibold text-slate-800">Email:</span>
                 <p>{shop.user?.email}</p>
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

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <input
               type="text"
              placeholder="Search products in this shop..."
              value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border pl-10 pr-4 py-2"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price Low to High</option>
            <option value="price-high">Price High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <h3 className="font-bold text-lg">
              No products found
            </h3>

            <p className="text-slate-500 mt-2">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const firstVariant = product.variants?.[0]

              return (
                <CategoryProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.title || product.name,
                    description: product.description,
                    price: firstVariant?.price || 0,
                    image: product.image || "",
                    rating: product.rating || 0,
                  }}
                />
              )
            })}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
