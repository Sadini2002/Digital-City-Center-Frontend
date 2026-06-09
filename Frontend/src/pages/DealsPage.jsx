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
  Check
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CdnImage from '../components/common/CdnImage'
import { getAllCategoryListings } from '../components/category/categoryData'
import { getProductById, formatLkr } from '../data/productsCatalog'
import { useShop } from '../buyer'

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

export default function DealsPage() {
  const { addToCart, toggleWishlist, isInWishlist } = useShop()

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 18 })

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minDiscount, setMinDiscount] = useState(0)
  const [sortBy, setSortBy] = useState('discount-desc')

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        seconds -= 1
        if (seconds < 0) {
          seconds = 59
          minutes -= 1
        }
        if (minutes < 0) {
          minutes = 59
          hours -= 1
        }
        if (hours < 0) {
          return { hours: 24, minutes: 0, seconds: 0 }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Retrieve products and calculate active deals
  const deals = useMemo(() => {
    // 1. Get static products
    const staticListings = getAllCategoryListings()
    const staticDeals = staticListings
      .filter(item => item.originalPrice && item.originalPrice > item.price)
      .map(item => getProductById(item.id))
      .filter(Boolean)

    // 2. Get local storage seller products
    let localDeals = []
    try {
      const localProducts = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
      localDeals = localProducts
        .filter(p => {
          const isVisible = p.isAvailable !== false && (p.stock == null || Number(p.stock) > 0)
          const hasLabelDiscount = p.labelPrice && p.labelPrice > p.price
          const hasPercentDiscount = p.discount?.percent && p.discount.percent > 0
          return isVisible && (hasLabelDiscount || hasPercentDiscount)
        })
        .map(p => getProductById(p.productId || p._id || p.id))
        .filter(Boolean)
    } catch (e) {
      console.warn('Could not parse local storage seller products:', e)
    }

    // Combine and deduplicate
    const combined = [...staticDeals, ...localDeals]
    const seenIds = new Set()
    const unique = []
    
    for (const item of combined) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        
        // Ensure discount percentage is calculated and stored on product object
        const original = item.originalPrice || item.price
        const discountPct = Math.round(((original - item.price) / original) * 100)
        item.discountPercent = discountPct > 0 ? discountPct : 0
        
        unique.push(item)
      }
    }

    return unique
  }, [])

  // Filter and Sort deals
  const filteredDeals = useMemo(() => {
    let result = [...deals]

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.categorySlug === selectedCategory)
    }

    // Discount Filter
    if (minDiscount > 0) {
      result = result.filter(item => item.discountPercent >= minDiscount)
    }

    // Sorting
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

        {/* Hero Section with Purple Gradient & Live Timer */}
        <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-dcc-primary to-indigo-800 p-6 text-white shadow-lg md:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-600/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-xl text-center md:text-left animate-fadeIn">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 text-amber-300" fill="currentColor animate-pulse" />
                Limited Time Offers
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Unbeatable Flash Deals
              </h1>
              <p className="mt-2 text-sm text-violet-100 md:text-base">
                Grab exclusive discounts from verified shops. These prices will reset back to normal soon, so act fast!
              </p>
            </div>

            {/* Live Countdown Box */}
            <div className="flex shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-center backdrop-blur shadow-xl min-w-[240px]">
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-violet-200">
                <Timer className="h-4 w-4 text-amber-300 animate-spin-slow" />
                Deals End In:
              </span>
              <div className="mt-3 flex gap-2.5 font-mono text-2xl font-bold tracking-wider sm:text-3xl">
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">{pad(timeLeft.hours)}</div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Hrs</span>
                </div>
                <span className="py-2 text-violet-300">:</span>
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">{pad(timeLeft.minutes)}</div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Min</span>
                </div>
                <span className="py-2 text-violet-300">:</span>
                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-slate-900 px-3 py-2 text-white">{pad(timeLeft.seconds)}</div>
                  <span className="mt-1 text-[10px] uppercase text-slate-400">Sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Tab Scrollbar */}
        <div className="mt-8 flex items-center justify-between border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex gap-2 pb-2">
            {CATEGORY_TABS.map(tab => {
              const TabIcon = tab.icon
              const isActive = selectedCategory === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    isActive 
                      ? 'bg-dcc-primary text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          {/* Discount Depth Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5" /> Discount:
            </span>
            {DISCOUNT_FILTERS.map(filter => {
              const isActive = minDiscount === filter.value
              return (
                <button
                  key={filter.value}
                  onClick={() => setMinDiscount(filter.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-violet-100 text-dcc-primary border border-violet-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              )}
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-dcc-primary"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deals Listing Counter */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{filteredDeals.length}</span> active deals
          </p>
          {(selectedCategory !== 'all' || minDiscount > 0) && (
            <button
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

        {/* Deals Product Grid */}
        {filteredDeals.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <Percent className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">No deals match your search</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              We couldn't find any products matching those filters. Try choosing a different category or lowering the discount threshold.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDeals.map((product) => {
              const saved = isInWishlist(product.id)
              
              // Simulated remaining stock calculations for FOMO (Stock limits: Red <= 5, Amber <= 15, Green > 15)
              const stock = product.stock || 12
              const totalCap = 40
              const percentage = Math.min(100, Math.max(5, Math.round((stock / totalCap) * 100)))
              
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
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Badge & Heart Actions */}
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
                    className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition hover:scale-105 ${
                      saved ? 'text-pink-500' : 'text-slate-400 hover:text-red-500'
                    }`}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} strokeWidth={2} />
                  </button>

                  {/* Product Image Link */}
                  <Link
                    to={`/product/${product.id}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50"
                  >
                    <CdnImage
                      src={product.images?.[0] || product.image}
                      alt={product.title || product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.brand || 'Seller Store'}
                    </p>
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-1 block flex-1"
                    >
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-dcc-primary transition-colors min-h-[40px]">
                        {product.title || product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
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
                        ({product.reviewCount || 8})
                      </span>
                    </div>

                    {/* Price Tag */}
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

                    {/* Urgency Stock Meter */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={stock <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-500'}>
                          {urgencyText}
                        </span>
                        <span className="text-slate-400">{Math.round(100 - percentage)}% claimed</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Add to Cart Footer Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product, 1)
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
