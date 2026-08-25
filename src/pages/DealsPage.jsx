import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  Heart,
  ShoppingCart,
  Star,
  Timer,
  SlidersHorizontal,
  Percent,
  Laptop,
  Shirt,
  ShoppingBasket,
  Sofa,
  Gem,
  Dumbbell,
  Baby,
  Sparkles,
  Loader2,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CdnImage from '../components/common/CdnImage'
import { formatLkr } from '../data/productsCatalog'
import { useShop } from '../buyer'
import { homeApi } from '../services/api'

const CATEGORY_TABS = [
  { id: 'all', label: 'All Deals', icon: Sparkles },
  { id: 'electronics', label: 'Electronics', icon: Laptop },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'groceries', label: 'Groceries', icon: ShoppingBasket },
  { id: 'home', label: 'Home & Living', icon: Sofa },
  { id: 'beauty', label: 'Beauty', icon: Gem },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'kids', label: 'Kids & Toys', icon: Baby },
]

const DISCOUNT_FILTERS = [
  { value: 0, label: 'All Discounts' },
  { value: 15, label: '15% Off & Above' },
  { value: 30, label: '30% Off & Above' },
  { value: 50, label: '50% Off & Above' },
]

const SORT_OPTIONS = [
  { value: 'discount-desc', label: 'Highest Discount %' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Customer Rating' },
]

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Deals', to: null },
]

function normalizeCategorySlug(slug = '') {
  const value = String(slug).toLowerCase()
  if (value.includes('electronic')) return 'electronics'
  if (value.includes('fashion')) return 'fashion'
  if (value.includes('grocer')) return 'groceries'
  if (value.includes('home')) return 'home'
  if (value.includes('beauty')) return 'beauty'
  if (value.includes('sport')) return 'sports'
  if (value.includes('kid') || value.includes('toy')) return 'kids'
  return value
}

function msToParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { hours, minutes, seconds }
}

export default function DealsPage() {
  const { addToCart, toggleWishlist, isInWishlist } = useShop()

  const [deals, setDeals] = useState([])
  const [endTime, setEndTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minDiscount, setMinDiscount] = useState(0)
  const [sortBy, setSortBy] = useState('discount-desc')

  useEffect(() => {
    let cancelled = false

    async function loadDeals() {
      setLoading(true)
      setError('')
      try {
        const response = await homeApi.getFlashSale()
        const flashSale = response?.data?.flashSale ?? response?.data?.data?.flashSale
        const products = flashSale?.products || []

        if (!cancelled) {
          const mapped = products
            .filter(
              (product) =>
                Number.isInteger(Number(product.listingId ?? product.id)) &&
                Number(product.listingId ?? product.id) > 0 &&
                Number.isInteger(Number(product.variantId)) &&
                Number(product.variantId) > 0,
            )
            .map((product) => ({
              ...product,
              id: Number(product.listingId ?? product.id),
              listingId: Number(product.listingId ?? product.id),
              productId: Number(product.listingId ?? product.id),
              variantId: Number(product.variantId),
              price: Number(product.price ?? product.flashPrice ?? 0),
              originalPrice: Number(product.originalPrice || 0) || null,
              discountPercent: Number(product.discountPercent || 0),
              stock: Number(product.stock ?? product.stockRemaining ?? 0),
              categorySlug: normalizeCategorySlug(product.categorySlug),
            }))

          // One card per listing (best discount wins when multiple variants are on sale)
          const byListing = new Map()
          for (const product of mapped) {
            const existing = byListing.get(product.listingId)
            if (!existing || product.discountPercent > existing.discountPercent) {
              byListing.set(product.listingId, product)
            }
          }

          setDeals([...byListing.values()])
          setEndTime(flashSale?.endTime ? new Date(flashSale.endTime) : null)
        }
      } catch (err) {
        if (!cancelled) {
          setDeals([])
          setError(err?.message || 'No active flash deals right now.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDeals()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!endTime) return undefined

    const tick = () => setTimeLeft(msToParts(endTime.getTime() - Date.now()))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  const filteredDeals = useMemo(() => {
    let result = [...deals]

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categorySlug === selectedCategory)
    }

    if (minDiscount > 0) {
      result = result.filter((item) => item.discountPercent >= minDiscount)
    }

    switch (sortBy) {
      case 'discount-desc':
        result.sort((a, b) => b.discountPercent - a.discountPercent)
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return result
  }, [deals, selectedCategory, minDiscount, sortBy])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <PageContainer>
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-dcc-primary to-indigo-800 p-6 text-white shadow-lg md:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-600/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-xl animate-fadeIn text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 text-amber-300" fill="currentColor animate-pulse" />
                Limited Time Offers
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Unbeatable Flash Deals
              </h1>
              <p className="mt-2 text-sm text-violet-100 md:text-base">
                Grab exclusive discounts from verified shops. These prices will reset back to normal
                soon, so act fast!
              </p>
            </div>

            <div className="flex min-w-[240px] shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-center shadow-xl backdrop-blur">
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-violet-200">
                <Timer className="h-4 w-4 animate-spin-slow text-amber-300" />
                Deals End In:
              </span>
              <div className="mt-3 flex gap-2.5 font-mono text-2xl font-bold tracking-wider sm:text-3xl">
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
                    {pad(timeLeft.hours)}
                  </div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Hrs</span>
                </div>
                <span className="py-2 text-violet-300">:</span>
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
                    {pad(timeLeft.minutes)}
                  </div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Min</span>
                </div>
                <span className="py-2 text-violet-300">:</span>
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">
                    {pad(timeLeft.seconds)}
                  </div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between overflow-x-auto scroll-smooth border-b border-slate-200 pb-1 no-scrollbar">
          <div className="flex gap-2 pb-2">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon
              const isActive = selectedCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                    isActive
                      ? 'bg-dcc-primary text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Percent className="h-3.5 w-3.5" /> Discount:
            </span>
            {DISCOUNT_FILTERS.map((filter) => {
              const isActive = minDiscount === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setMinDiscount(filter.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'border border-violet-200 bg-violet-100 text-dcc-primary'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-dcc-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredDeals.length}</span> active
            deals
          </p>
          {(selectedCategory !== 'all' || minDiscount > 0) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all')
                setMinDiscount(0)
              }}
              className="text-xs font-bold text-dcc-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />
            <p className="text-sm">Loading deals…</p>
          </div>
        )}

        {!loading && error && filteredDeals.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <Percent className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">No active flash deals</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>
          </div>
        )}

        {!loading && !error && filteredDeals.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <Percent className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">No deals match your search</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              We couldn&apos;t find any products matching those filters. Try choosing a different
              category or lowering the discount threshold.
            </p>
          </div>
        )}

        {!loading && filteredDeals.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDeals.map((product) => {
              const saved = isInWishlist(product.id)
              const stock = product.stock || 0
              const totalCap = Math.max(stock + Number(product.soldCount || 0), 40)
              const percentage = Math.min(
                100,
                Math.max(5, Math.round((stock / totalCap) * 100)),
              )

              let progressColor = 'bg-emerald-500'
              let urgencyText = `In stock (${stock} available)`

              if (stock <= 5) {
                progressColor = 'bg-red-500'
                urgencyText = `Hurry, only ${stock} left in stock!`
              } else if (stock <= 15) {
                progressColor = 'bg-amber-500'
                urgencyText = `Limited quantity: ${stock} left`
              }

              return (
                <div
                  key={`${product.listingId}-${product.variantId}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    -{product.discountPercent}% OFF
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWishlist(product)
                    }}
                    className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-105 ${
                      saved ? 'text-pink-500' : 'text-slate-400 hover:text-red-500'
                    }`}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} strokeWidth={2} />
                  </button>

                  <Link
                    to={`/product/${product.listingId}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50"
                  >
                    <CdnImage
                      src={product.images?.[0] || product.image}
                      alt={product.title || product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.brand || 'Seller Store'}
                    </p>
                    <Link to={`/product/${product.listingId}`} className="mt-1 block flex-1">
                      <h3 className="min-h-[40px] line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-dcc-primary">
                        {product.title || product.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.round(product.rating || 4.5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-dcc-primary">
                        {formatLkr(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatLkr(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={stock <= 5 ? 'animate-pulse text-red-500' : 'text-slate-500'}>
                          {urgencyText}
                        </span>
                        <span className="text-slate-400">{Math.round(100 - percentage)}% claimed</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Real flash-sale IDs only (never mock/string catalog ids)
                        addToCart(
                          {
                            id: product.listingId,
                            listingId: product.listingId,
                            productId: product.listingId,
                            variantId: product.variantId,
                            title: product.title || product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.images?.[0] || product.image,
                            stock: product.stock,
                          },
                          1,
                        )
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-dcc-primary py-2 text-xs font-bold text-white shadow-sm transition hover:bg-dcc-primary-hover active:scale-[0.98]"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
