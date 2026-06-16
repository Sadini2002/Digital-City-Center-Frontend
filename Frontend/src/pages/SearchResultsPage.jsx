import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import SearchFilters from '../components/search/SearchFilters'
import SearchBestMatch from '../components/search/SearchBestMatch'
import { searchSortOptions } from '../components/search/searchData'
import { applySearchFilters, searchProducts, toBestMatch } from '../data/searchUtils'

const SEARCH_PER_PAGE = 6

function SearchResultsContent({ query, categorySlug }) {
  const initialCategories = categorySlug ? [categorySlug] : []

  const [categories, setCategories] = useState(initialCategories)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [appliedMin, setAppliedMin] = useState('')
  const [appliedMax, setAppliedMax] = useState('')
  const [locations, setLocations] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [delivery, setDelivery] = useState([])
  const [sort, setSort] = useState('relevant')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const matchedProducts = useMemo(
    () => searchProducts(query, { categorySlug: '' }),
    [query],
  )

  const filteredProducts = useMemo(() => {
    let list = applySearchFilters(matchedProducts, {
      categorySlugs: categories,
      priceMin: appliedMin,
      priceMax: appliedMax,
      locations,
      minRating,
      delivery,
    })

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
      case 'newest':
        list.sort((a, b) => (b.badge?.type === 'new' ? 1 : 0) - (a.badge?.type === 'new' ? 1 : 0))
        break
      default:
        break
    }

    return list
  }, [matchedProducts, categories, appliedMin, appliedMax, locations, minRating, delivery, sort])

  const bestMatch = useMemo(() => toBestMatch(filteredProducts[0]), [filteredProducts])

  const start = (page - 1) * SEARCH_PER_PAGE
  const pageProducts = filteredProducts.slice(start, start + SEARCH_PER_PAGE)
  const total = filteredProducts.length
  const showingStart = total === 0 ? 0 : start + 1
  const showingEnd = Math.min(start + SEARCH_PER_PAGE, total)

  const bumpPage = () => setPage(1)

  const toggle = (setter, id) => {
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    bumpPage()
  }

  const clearFilters = () => {
    setCategories([])
    setPriceMin('')
    setPriceMax('')
    setAppliedMin('')
    setAppliedMax('')
    setLocations([])
    setMinRating(0)
    setDelivery([])
    setSort('relevant')
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[1.65rem]">
            Search Results for &apos;{query}&apos;
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {total === 0
              ? 'No products found'
              : `Showing ${showingStart}–${showingEnd} of ${total} results`}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold uppercase tracking-wide text-slate-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              bumpPage()
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          >
            {searchSortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <SearchFilters
            categories={categories}
            onToggleCategory={(id) => toggle(setCategories, id)}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            onApplyPrice={() => {
              setAppliedMin(priceMin)
              setAppliedMax(priceMax)
              bumpPage()
            }}
            locations={locations}
            onToggleLocation={(id) => toggle(setLocations, id)}
            minRating={minRating}
            onMinRatingChange={(stars) => {
              setMinRating(stars)
              bumpPage()
            }}
            delivery={delivery}
            onToggleDelivery={(id) => toggle(setDelivery, id)}
            onClearAll={clearFilters}
          />
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          {bestMatch && <SearchBestMatch product={bestMatch} />}

          {pageProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageProducts.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="font-semibold text-slate-900">No products match your filters</p>
              <p className="mt-2 text-sm text-slate-600">
                Try clearing filters or using different keywords.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-dcc-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {total > SEARCH_PER_PAGE && (
            <CategoryPagination currentPage={page} onPageChange={setPage} />
          )}
        </div>
      </div>
    </>
  )
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const categorySlug = searchParams.get('category')?.trim() || ''

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Search Results', to: null },
  ]

  if (!query) {
    return (
      <div className="min-w-0 bg-white">
        <PageContainer className="py-16 text-center">
          <h1 className="text-xl font-bold text-slate-900">Search the marketplace</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use the search bar above to find products, brands, and shops.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Back to Home
          </Link>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-4 pt-6 sm:pt-8">
        <ProductBreadcrumbs items={breadcrumbs} />
      </PageContainer>

      <div className="bg-slate-50/90 pb-12">
        <PageContainer className="py-6 sm:py-8">
          <SearchResultsContent key={`${query}-${categorySlug}`} query={query} categorySlug={categorySlug} />
        </PageContainer>
      </div>
    </div>
  )
}
