import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid3x3, List, Loader2, PackageSearch, SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryFilters from '../components/category/CategoryFilters'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import CategoryTopShops from '../components/category/CategoryTopShops'
import CategoryHero from '../components/category/CategoryHero'
import { getCategoryShops, sortOptions, getCategoryMeta } from '../components/category/categoryData'
import { categoryApi } from '../services/api/categoryApi'

const PER_PAGE = 6

// Fallback image list (Unsplash) when the API listing has no image
const FALLBACK_IMAGES = {
  'electronics-and-gadgets': 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=500&auto=format&fit=crop&q=60',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60',
  'home-and-living': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=60',
  sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60',
  'kids-and-toys': 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&auto=format&fit=crop&q=60',
}

function normalizeSlug(slug = '') {
  return slug.toLowerCase().replace(/\s+/g, '-')
}

function mapApiListing(listing, slug) {
  const fallback = FALLBACK_IMAGES[normalizeSlug(slug)] ?? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60'
  // Parse brand from description prefix "BRAND - ..."
  const descParts = listing.description?.split(' - ')
  const brand = descParts?.length > 1 ? descParts[0] : ''
  const description = descParts?.length > 1 ? descParts.slice(1).join(' - ') : listing.description

  return {
    id: listing.id,
    name: listing.title,
    brand,
    description,
    price: listing.price,
    originalPrice: null,
    rating: listing.rating ?? 4.5,
    reviews: listing.reviewCount ?? 0,
    image: fallback,
    badge: null,
    categorySlug: slug,
    shopId: listing.seller?.shopUrl ?? null,
  }
}

export default function CategoryPage() {
  const { slug = 'electronics-and-gadgets' } = useParams()

  // ─── State ─────────────────────────────────────────────────────────────────
  const [categoryData, setCategoryData] = useState(null)   // { id, name, icon, slug }
  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(100)
  const [minRating, setMinRating] = useState(0)
  const [selectedSubs, setSelectedSubs] = useState([])
  const [location, setLocation] = useState('All Locations')
  const [availability, setAvailability] = useState('All')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ─── Fetch listings from API ────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        sort,
        page,
        limit: PER_PAGE,
      }
      if (priceMin > 0) params.minPrice = priceMin * 1000
      if (priceMax < 100) params.maxPrice = priceMax * 1000
      if (minRating > 0) params.minRating = minRating
      if (selectedSubs.length > 0) params.subCategories = selectedSubs.join(',')
      if (location !== 'All Locations') params.location = location
      if (availability !== 'All') params.availability = availability

      const res = await categoryApi.getBySlug(slug, params)
      const { category, listings: fetchedListings, pagination: pag } = res.data.data
      setCategoryData(category)
      setListings(fetchedListings.map((l) => mapApiListing(l, slug)))
      setPagination(pag)
    } catch (err) {
      setError(err.message ?? 'Failed to load category')
    } finally {
      setLoading(false)
    }
  }, [slug, sort, page, priceMin, priceMax, minRating, selectedSubs, location, availability])

  // Reset to page 1 when filters or slug change (but not page itself)
  useEffect(() => {
    setPage(1)
    setFiltersOpen(false)
  }, [slug, sort, priceMin, priceMax, minRating, selectedSubs, location, availability])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const meta = getCategoryMeta(slug)
  const categoryShops = getCategoryShops(slug)
  const showTopShops = Boolean(categoryShops) && slug !== 'all'

  const breadcrumbs = useMemo(() => [
    { label: 'Home', to: '/' },
    { label: 'All Categories', to: '/category/all' },
    { label: categoryData?.name ?? slug, to: null },
  ], [categoryData, slug])

  const clearFilters = () => {
    setPriceMin(0)
    setPriceMax(100)
    setMinRating(0)
    setSelectedSubs([])
    setLocation('All Locations')
    setAvailability('All')
    setSort('newest')
    setPage(1)
  }

  const showingStart = pagination.total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const showingEnd = Math.min(page * PER_PAGE, pagination.total)



  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-4 pt-6 sm:pt-8">
        <ProductBreadcrumbs items={breadcrumbs} />
      </PageContainer>

      <CategoryHero categoryData={categoryData ?? meta} slug={slug} />

      <div className="bg-slate-50/90 pb-10">
        <PageContainer className="py-6 sm:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* ── Sidebar Filters ── */}
            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
              <CategoryFilters
                subCategories={meta.subCategories || []}
                selectedSubs={selectedSubs}
                onToggleSub={(id) => {
                  setSelectedSubs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
                }}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                location={location}
                onLocationChange={setLocation}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                availability={availability}
                onAvailabilityChange={setAvailability}
                onClearAll={clearFilters}
              />
            </div>

            {/* ── Main Content ── */}
            <div className="min-w-0 flex-1">
              {/* Header row */}
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {categoryData?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '))}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {loading
                      ? 'Loading…'
                      : `Showing ${showingStart}–${showingEnd} of ${pagination.total} products`}
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
                      className={`rounded-md p-2 transition ${view === 'grid' ? 'bg-dcc-primary text-white shadow-sm' : 'text-slate-500 hover:text-dcc-primary'}`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className={`rounded-md p-2 transition ${view === 'list' ? 'bg-dcc-primary text-white shadow-sm' : 'text-slate-500 hover:text-dcc-primary'}`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Loading ── */}
              {loading && (
                <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />
                  <p className="text-sm">Loading products…</p>
                </div>
              )}

              {/* ── Error (real server errors only, not "not found") ── */}
              {!loading && error && !error.toLowerCase().includes('not found') && (
                <div className="mt-16 flex flex-col items-center gap-3 text-red-500">
                  <p className="text-sm">{error}</p>
                  <button
                    type="button"
                    onClick={fetchListings}
                    className="rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* ── Empty (no products or category not in DB yet) ── */}
              {!loading && ((!error && listings.length === 0) || error?.toLowerCase().includes('not found')) && (
                <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
                  <PackageSearch className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium">No products match your filters.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-semibold text-dcc-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* ── Product Grid / List ── */}
              {!loading && !error && listings.length > 0 && (
                <div
                  className={
                    view === 'grid'
                      ? 'mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                      : 'mt-6 flex flex-col gap-4'
                  }
                >
                  {listings.map((product) => (
                    <CategoryProductCard key={product.id} product={product} view={view} />
                  ))}
                </div>
              )}

              {/* ── Pagination ── */}
              {!loading && !error && pagination.totalPages > 1 && (
                <CategoryPagination
                  currentPage={page}
                  onPageChange={setPage}
                  totalPages={pagination.totalPages}
                />
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      {showTopShops && <CategoryTopShops shops={categoryShops} />}
    </div>
  )
}
