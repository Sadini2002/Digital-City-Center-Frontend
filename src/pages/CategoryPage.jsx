import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Grid3x3, List, Loader2, PackageSearch, SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryFilters from '../components/category/CategoryFilters'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import CategoryTopShops from '../components/category/CategoryTopShops'
import { getCategoryShops, sortOptions } from '../components/category/categoryData'
import { mapListingToCardProduct } from '../buyer/services/productMapper'
import { categoryApi } from '../services/api/categoryApi'

const PER_PAGE = 6

function normalizeSlug(slug = '') {
  return slug.toLowerCase().replace(/\s+/g, '-')
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

      const res = await categoryApi.getBySlug(slug, params)
      const { category, listings: fetchedListings, pagination: pag } = res.data.data
      setCategoryData(category)
      setListings(
        fetchedListings
          .map((l) => mapListingToCardProduct(l, normalizeSlug(slug)))
          .filter(Boolean),
      )
      setPagination(pag)
    } catch (err) {
      setError(err.message ?? 'Failed to load category')
    } finally {
      setLoading(false)
    }
  }, [slug, sort, page, priceMin, priceMax, minRating])

  // Reset to page 1 when filters or slug change (but not page itself)
  useEffect(() => {
    setPage(1)
    setFiltersOpen(false)
  }, [slug, sort, priceMin, priceMax, minRating])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // ─── Helpers ────────────────────────────────────────────────────────────────
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
    setSort('newest')
    setPage(1)
  }

  const showingStart = pagination.total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const showingEnd = Math.min(page * PER_PAGE, pagination.total)

  // ─── 404-like: category not found ──────────────────────────────────────────
  if (!loading && error?.toLowerCase().includes('not found')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          This category is currently unavailable or has been disabled.
        </p>
        <Link
          to="/"
          className="mt-4 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-4 pt-6 sm:pt-8">
        <ProductBreadcrumbs items={breadcrumbs} />
      </PageContainer>

      <div className="bg-slate-50/90 pb-10">
        <PageContainer className="py-6 sm:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* ── Sidebar Filters ── */}
            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
              <CategoryFilters
                subCategories={[]}
                selectedSubs={[]}
                onToggleSub={() => {}}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                location="All Locations"
                onLocationChange={() => {}}
                minRating={minRating}
                onMinRatingChange={setMinRating}
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

              {/* ── Error ── */}
              {!loading && error && (
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

              {/* ── Empty ── */}
              {!loading && !error && listings.length === 0 && (
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
