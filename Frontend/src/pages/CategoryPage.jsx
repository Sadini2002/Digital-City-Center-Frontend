import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const PER_PAGE = 6

export default function CategoryPage() {
  const { slug = 'electronics' } = useParams()
  const meta = getCategoryMeta(slug)
  const breadcrumbs = getCategoryBreadcrumbs(slug, meta.title)
  const categoryProducts = useMemo(() => getCategoryProducts(slug), [slug])
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

  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts]

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
  }, [categoryProducts, minRating, priceMin, priceMax, sort])

  const start = (page - 1) * PER_PAGE
  const pageProducts = filteredProducts.slice(start, start + PER_PAGE)
  const showingStart = filteredProducts.length === 0 ? 0 : start + 1
  const showingEnd = Math.min(start + PER_PAGE, filteredProducts.length)

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
                    {meta.title}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {showingStart}–{showingEnd} of {meta.totalProducts} products
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

              <div
                className={
                  view === 'grid'
                    ? 'mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                    : 'mt-6 flex flex-col gap-4'
                }
              >
                {pageProducts.map((product) => (
                  <CategoryProductCard key={product.id} product={product} view={view} />
                ))}
              </div>

              <CategoryPagination currentPage={page} onPageChange={setPage} />
            </div>
          </div>
        </PageContainer>
      </div>

      {showTopShops && <CategoryTopShops shops={categoryShops} />}
    </div>
  )
}
