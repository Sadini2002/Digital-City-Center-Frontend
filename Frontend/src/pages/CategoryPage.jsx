import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Grid3x3, List, SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryFilters from '../components/category/CategoryFilters'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import CategoryTopShops from '../components/category/CategoryTopShops'
import {
  getCategoryBreadcrumbs,
  getCategoryMeta,
  getCategoryProducts,
  getCategoryShops,
  sortOptions,
} from '../components/category/categoryData'
import { categoryApi } from '../services/api'

const PER_PAGE = 6

export default function CategoryPage() {
  const { slug = 'electronics' } = useParams()
  
  const isEnabled = useMemo(() => {
    try {
      const stored = localStorage.getItem('dcc_admin_categories')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const cat = parsed.find(c => c.slug === slug)
          if (cat) return cat.enabled !== false
        }
      }
    } catch {}
    return true
  }, [slug])

  const [dbCategory, setDbCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const meta = getCategoryMeta(slug)
  const breadcrumbs = getCategoryBreadcrumbs(slug, dbCategory?.name || meta.title)
  const categoryShops = getCategoryShops(slug)
  const defaultSubs = meta.subCategories[0] ? [meta.subCategories[0].id] : []

  const [selectedSubs, setSelectedSubs] = useState(defaultSubs)
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(100)
  const [location, setLocation] = useState('All Locations')
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setPage(1)
    setSelectedSubs(meta.subCategories[0] ? [meta.subCategories[0].id] : [])
    setFiltersOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset filters when category slug changes
  }, [slug])

  useEffect(() => {
    if (!isEnabled) return

    let active = true
    setLoading(true)
    setError(null)

    if (slug === 'all') {
      const mockList = getCategoryProducts('all')
      setProducts(mockList)
      setLoading(false)
      return
    }

    categoryApi.getBySlug(slug, { limit: 100 })
      .then((res) => {
        if (!active) return
        if (res.data?.success) {
          const { category, listings } = res.data.data
          const adaptedListings = (listings || []).map((l) => {
            const mockProducts = getCategoryProducts(slug) || []
            const matchedMock =
              mockProducts.find((mp) => mp.name?.toLowerCase() === l.title?.toLowerCase()) ||
              mockProducts.find((mp) => l.title?.toLowerCase().includes(mp.name?.toLowerCase())) ||
              {}
            return {
              ...l,
              name: l.title,
              image: matchedMock.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
              brand: matchedMock.brand || 'DCC Brand',
              categoryLabel: category?.name || meta.title,
              reviews: l.reviewCount ?? 0,
              sellerLocation: matchedMock.sellerLocation || 'colombo',
              subCategory: matchedMock.categorySlug || slug,
            }
          })
          setDbCategory(category)
          setProducts(adaptedListings)
        } else {
          setError('Failed to fetch category data')
        }
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Failed to fetch category data')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, isEnabled])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (selectedSubs.length > 0 && slug !== 'all') {
      list = list.filter((p) => selectedSubs.includes(p.subCategory))
    }

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating)
    }

    const maxPrice = priceMax * 1000
    if (priceMax < 100) {
      list = list.filter((p) => p.price <= maxPrice)
    }
    const minPrice = priceMin * 1000
    if (priceMin > 0) {
      list = list.filter((p) => p.price >= minPrice)
    }

    if (location !== 'All Locations') {
      list = list.filter((p) => p.sellerLocation?.toLowerCase() === location.toLowerCase())
    }

    switch (sort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    return list
  }, [products, selectedSubs, minRating, priceMin, priceMax, location, sort, slug])

  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / PER_PAGE)

  const displayProducts = useMemo(() => {
    const startIdx = (page - 1) * PER_PAGE
    return filteredProducts.slice(startIdx, startIdx + PER_PAGE)
  }, [filteredProducts, page])

  const showingStart = totalProducts === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const showingEnd = Math.min(page * PER_PAGE, totalProducts)

  if (!isEnabled) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">This category is currently unavailable or has been disabled by the admin.</p>
        <Link to="/" className="mt-4 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover">
          Back to Home
        </Link>
      </div>
    )
  }

  const toggleSub = (id) => {
    setSelectedSubs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const clearFilters = () => {
    setSelectedSubs([...defaultSubs])
    setPriceMin(0)
    setPriceMax(100)
    setLocation('All Locations')
    setMinRating(0)
    setSort('newest')
    setPage(1)
  }

  const showTopShops = Boolean(categoryShops) && slug !== 'all'

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-4 pt-6 sm:pt-8">
        <ProductBreadcrumbs items={breadcrumbs} />
      </PageContainer>

      <div className="bg-slate-50/90 pb-10">
        <PageContainer className="py-6 sm:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
              <CategoryFilters
                subCategories={meta.subCategories}
                selectedSubs={selectedSubs}
                onToggleSub={toggleSub}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                location={location}
                onLocationChange={setLocation}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                onClearAll={clearFilters}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {dbCategory?.name || meta.title}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {showingStart}–{showingEnd} of {totalProducts} products
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
                    onClick={() => setFiltersOpen((o) => !o)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="whitespace-nowrap font-medium">Sort by:</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setView('grid')}
                      className={`rounded-md p-2 transition ${
                        view === 'grid'
                          ? 'bg-dcc-primary text-white shadow-sm'
                          : 'text-slate-500 hover:text-dcc-primary'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className={`rounded-md p-2 transition ${
                        view === 'list'
                          ? 'bg-dcc-primary text-white shadow-sm'
                          : 'text-slate-500 hover:text-dcc-primary'
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-dcc-primary border-t-transparent" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                  {error}
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                  No products found matching the filters.
                </div>
              ) : (
                <>
                  <div
                    className={
                      view === 'grid'
                        ? 'mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                        : 'mt-6 flex flex-col gap-4'
                    }
                  >
                    {displayProducts.map((product) => (
                      <CategoryProductCard key={product.id} product={product} view={view} />
                    ))}
                  </div>

                  <CategoryPagination currentPage={page} onPageChange={setPage} totalPages={totalPages} />
                </>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      {showTopShops && <CategoryTopShops shops={categoryShops} />}
    </div>
  )
}
