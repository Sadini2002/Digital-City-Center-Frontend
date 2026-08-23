import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import CategoryProductCard from '../components/category/CategoryProductCard'
import CategoryPagination from '../components/category/CategoryPagination'
import SearchFilters from '../components/search/SearchFilters'
import SearchBestMatch from '../components/search/SearchBestMatch'
import { searchSortOptions } from '../components/search/searchData'
import { applySearchFilters, toBestMatch } from '../data/searchUtils'
import { listingsApi } from '../services/api'

const SEARCH_PER_PAGE = 6

function pickListingImage(listing) {
  const variantImages = listing.variants?.flatMap((variant) => variant.images || []) || []

  return (
    listing.image ||
    listing.thumbnail ||
    variantImages[0]?.url ||
    variantImages[0]?.imageUrl ||
    variantImages[0]?.src ||
    ''
  )
}

function normalizeCategoryLabel(value = '') {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function normalizeFilterValue(value = '') {
  return value.toString().trim().toLowerCase().replace(/\s+/g, ' ')
}

function formatFilterLabel(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatRatingLabel(stars) {
  if (stars <= 0) return 'Any rating'

  const value = Number.isInteger(stars) ? `${stars}` : stars.toFixed(1)
  return `${value} Stars & Up`
}

function getListingPrice(listing) {
  if (listing.price != null) return Number(listing.price)
  if (listing.salePrice != null) return Number(listing.salePrice)

  const primaryVariant = listing.variants?.find((variant) => variant.status !== 'inactive') ?? listing.variants?.[0]

  if (primaryVariant?.price != null) return Number(primaryVariant.price)

  return 0
}

function getListingStock(listing) {
  if (listing.stock != null) return Number(listing.stock)

  const activeVariants = listing.variants?.filter((variant) => variant.status !== 'inactive') ?? listing.variants ?? []
  const variantStock = activeVariants.reduce((total, variant) => total + Number(variant.stock ?? 0), 0)

  return variantStock
}

function mapListingToProduct(listing, categoryOverride = '') {
  const sellerName = listing.seller?.shopName || listing.seller?.name || 'Marketplace Seller'
  const categoryName = listing.category?.name || listing.category?.label || normalizeCategoryLabel(categoryOverride)
  const price = getListingPrice(listing)
  const stock = getListingStock(listing)
  const originalPrice = listing.originalPrice ?? listing.compareAtPrice ?? null
  const sellerLocation = normalizeFilterValue(listing.seller?.location || listing.seller?.city || '')
  const sellerRating = Number(listing.seller?.rating ?? listing.rating ?? listing.averageRating ?? 0)
  const sellerReviewCount = Number(listing.seller?.reviewCount ?? listing.reviewsCount ?? listing.reviewCount ?? 0)

  return {
    ...listing,
    id: listing.id ?? listing.listingId,
    name: listing.title ?? listing.name ?? 'Untitled product',
    brand: sellerName,
    categorySlug: listing.category?.slug || listing.category?.name || categoryOverride,
    categoryLabel: categoryName,
    price,
    originalPrice: originalPrice != null ? Number(originalPrice) : null,
    rating: sellerRating,
    reviews: sellerReviewCount,
    sales: Number(listing.sales ?? listing.soldCount ?? 0),
    stock,
    badge: listing.badge ?? null,
    image: pickListingImage(listing),
    seller: sellerName,
    sellerLocation: sellerLocation,
    sellerLocationLabel: formatFilterLabel(listing.seller?.location || listing.seller?.city || 'Unknown'),
    freeDelivery: Boolean(listing.freeDelivery),
    islandwideDelivery: listing.islandwideDelivery ?? true,
    description: listing.description ?? '',
  }
}

function SearchResultsContent({ query, categorySlug }) {
  const initialCategories = categorySlug ? [categorySlug] : []

  const [categories, setCategories] = useState(initialCategories)
  const [requestedCategory, setRequestedCategory] = useState(categorySlug || '')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [appliedMin, setAppliedMin] = useState('')
  const [appliedMax, setAppliedMax] = useState('')
  const [locations, setLocations] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [availability, setAvailability] = useState([])
  const [sort, setSort] = useState('relevant')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadResults() {
      setLoading(true)
      setError('')

      try {
        const activeCategory = requestedCategory || ''
        const response = activeCategory
          ? await listingsApi.getProductsByCategory(activeCategory)
          : await listingsApi.search({
              q: query,
            })

        const listings = response.data?.results ?? []
        const normalizedQuery = query.trim().toLowerCase()
        const mappedProducts = listings.map((listing) => mapListingToProduct(listing, activeCategory))
        const visibleProducts =
          activeCategory && normalizedQuery
            ? mappedProducts.filter((product) => {
                const haystack = `${product.name} ${product.brand} ${product.description}`.toLowerCase()
                return haystack.includes(normalizedQuery)
              })
            : mappedProducts

        if (!active) return

        setProducts(visibleProducts)

        if (!activeCategory && !categorySlug) {
          const uniqueCategories = [...new Set(mappedProducts.map((product) => product.categorySlug).filter(Boolean))]

          if (uniqueCategories.length === 1) {
            setCategories([uniqueCategories[0]])
          }
        }
      } catch (requestError) {
        if (!active) return

        setProducts([])
        setError(requestError.message || 'Unable to load search results')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadResults()

    return () => {
      active = false
    }
  }, [query, categorySlug, requestedCategory])

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        const response = await listingsApi.getCategories()
        const backendCategories = response.data?.categories ?? []
        const uniqueCategories = []
        const seen = new Set()

        backendCategories.forEach((category) => {
          const key = (category.slug || category.name || '').trim().toLowerCase()

          if (!key || seen.has(key)) return

          seen.add(key)
          uniqueCategories.push(category)
        })

        if (!active) return

        setCategoryOptions(
          uniqueCategories.map((category) => ({
            id: category.slug || category.name,
            slug: category.slug || category.name,
            label: category.name,
          })),
        )
      } catch {
        if (!active) return

        setCategoryOptions([])
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    let list = applySearchFilters(products, {
      categorySlugs: categories,
      priceMin: appliedMin,
      priceMax: appliedMax,
      locations,
      minRating,
      availability,
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
  }, [products, categories, appliedMin, appliedMax, locations, minRating, availability, sort])

  const locationOptions = useMemo(() => {
    const uniqueLocations = new Map()

    products.forEach((product) => {
      if (!product.sellerLocation) return

      if (!uniqueLocations.has(product.sellerLocation)) {
        uniqueLocations.set(product.sellerLocation, {
          id: product.sellerLocation,
          label: product.sellerLocationLabel || formatFilterLabel(product.sellerLocation),
        })
      }
    })

    return [...uniqueLocations.values()].sort((a, b) => a.label.localeCompare(b.label))
  }, [products])

  const ratingOptions = useMemo(() => {
    const ratings = new Set([0])

    products.forEach((product) => {
      const rating = Number(product.rating || 0)
      if (!rating) return

      ratings.add(Math.floor(rating))
    })

    return [...ratings]
      .sort((a, b) => b - a)
      .map((stars) => ({
        stars,
        label: formatRatingLabel(stars),
      }))
  }, [products])

  const availabilityOptions = useMemo(() => [
    { id: 'in-stock', label: 'In Stock Only' },
  ], [])

  const bestMatch = useMemo(() => toBestMatch(filteredProducts[0]), [filteredProducts])

  const start = (page - 1) * SEARCH_PER_PAGE
  const pageProducts = filteredProducts.slice(start, start + SEARCH_PER_PAGE)
  const total = filteredProducts.length
  const showingStart = total === 0 ? 0 : start + 1
  const showingEnd = Math.min(start + SEARCH_PER_PAGE, total)

  const bumpPage = () => setPage(1)

  const toggle = (setter, id) => {
    setter((prev) => (prev.includes(id) ? [] : [id]))
    bumpPage()
  }

  const handleCategoryToggle = (id) => {
    setCategories((prev) => (prev.includes(id) ? [] : [id]))
    setRequestedCategory((prev) => (prev === id ? '' : id))
    bumpPage()
  }

  const clearFilters = () => {
    setCategories([])
    setRequestedCategory('')
    setPriceMin('')
    setPriceMax('')
    setAppliedMin('')
    setAppliedMax('')
    setLocations([])
    setMinRating(0)
    setAvailability([])
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
            categoryOptions={categoryOptions}
            locationOptions={locationOptions}
            ratingOptions={ratingOptions}
              availabilityOptions={availabilityOptions}
            onToggleCategory={handleCategoryToggle}
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
              availability={availability}
              onToggleAvailability={(id) => toggle(setAvailability, id)}
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

          {loading ? (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading search results...
            </div>
          ) : error ? (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
              {error}
            </div>
          ) : null}

          {!loading && !error && bestMatch && <SearchBestMatch product={bestMatch} />}

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
