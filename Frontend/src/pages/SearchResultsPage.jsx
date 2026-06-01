import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import SearchFilters from '../components/search/SearchFilters'
import SearchBestMatch from '../components/search/SearchBestMatch'
import {
  SEARCH_PER_PAGE,
  SEARCH_TOTAL,
  bestMatchProduct,
  getSearchBreadcrumbs,
  searchResults,
  searchSortOptions,
} from '../components/search/searchData'

const DEFAULT_QUERY = 'Wireless Headphones'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || DEFAULT_QUERY

  const [categories, setCategories] = useState(['headphones'])
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

  const filteredProducts = useMemo(() => {
    let list = [...searchResults]

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating)
    }
    if (appliedMin) {
      list = list.filter((p) => p.price >= Number(appliedMin))
    }
    if (appliedMax) {
      list = list.filter((p) => p.price <= Number(appliedMax))
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
        break
    }

    return list
  }, [appliedMin, appliedMax, minRating, sort])

  const start = (page - 1) * SEARCH_PER_PAGE
  const pageProducts = filteredProducts.slice(start, start + SEARCH_PER_PAGE)
  const displayEnd = Math.min(24, SEARCH_TOTAL)

  const toggle = (setter, id) => {
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const clearFilters = () => {
    setCategories(['headphones'])
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
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-4 pt-6 sm:pt-8">
        <ProductBreadcrumbs items={getSearchBreadcrumbs()} />
      </PageContainer>

      <div className="bg-slate-50/90 pb-12">
        <PageContainer className="py-6 sm:py-8">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[1.65rem]">
                Search Results for &apos;{query}&apos;
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Showing 1–{displayEnd} of {SEARCH_TOTAL.toLocaleString()} results
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold uppercase tracking-wide text-slate-500">
                Sort by:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
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
                  setPage(1)
                }}
                locations={locations}
                onToggleLocation={(id) => toggle(setLocations, id)}
                minRating={minRating}
                onMinRatingChange={setMinRating}
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

              <SearchBestMatch product={bestMatchProduct} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pageProducts.map((product) => (
                  <CategoryProductCard key={product.id} product={product} />
                ))}
              </div>

              <CategoryPagination currentPage={page} onPageChange={setPage} />
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  )
}
