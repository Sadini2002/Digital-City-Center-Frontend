import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEARCH_CATEGORY_SLUGS, searchProducts } from '../../data/searchUtils'

const categoryOptions = Object.keys(SEARCH_CATEGORY_SLUGS)

function categoryFromSlug(slug) {
  if (!slug) return 'All Categories'
  const entry = Object.entries(SEARCH_CATEGORY_SLUGS).find(([, s]) => s === slug)
  return entry ? entry[0] : 'All Categories'
}

function SearchPageBar({ className, query, category }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)

  const runSearch = (searchTerm, categoryLabel) => {
    const q = searchTerm.trim()
    if (!q) return
    const slug = SEARCH_CATEGORY_SLUGS[categoryLabel] || ''
    const params = new URLSearchParams({ q })
    if (slug) params.set('category', slug)
    navigate(`/search?${params.toString()}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(`/product/${suggestions[activeIndex].id}`)
      setShowSuggestions(false)
    } else {
      runSearch(term, selectedCategory)
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    const trimmed = term.trim()
    if (trimmed.length > 0) {
      const catSlug = SEARCH_CATEGORY_SLUGS[selectedCategory] || ''
      const matches = searchProducts(trimmed, { categorySlug: catSlug })
      setSuggestions(matches.slice(0, 6))
    } else {
      setSuggestions([])
    }
    setActiveIndex(-1)
  }, [term, selectedCategory])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowSuggestions(true)
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > -1 ? prev - 1 : prev))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex h-11 w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="hidden shrink-0 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:outline-none sm:block"
          aria-label="Search category"
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="search"
          name="q"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and shops..."
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0"
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center bg-dcc-primary text-white transition-colors hover:bg-dcc-primary-hover"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {showSuggestions && term.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50">
          {suggestions.length > 0 ? (
            suggestions.map((product, index) => (
              <div
                key={product.id}
                onClick={() => {
                  navigate(`/product/${product.id}`)
                  setShowSuggestions(false)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  activeIndex === index ? 'bg-slate-50' : 'bg-transparent'
                }`}
              >
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-50 border border-slate-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      DCC
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {product.brand}
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-700">
                    {product.name}
                  </div>
                </div>
                <div className="shrink-0 text-xs font-bold text-slate-900">
                  LKR {product.price.toLocaleString('en-LK')}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-500">
              No products found for &ldquo;{term}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DefaultSearchBar({ className }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(`/product/${suggestions[activeIndex].id}`)
      setShowSuggestions(false)
    } else {
      const term = query.trim()
      if (!term) return
      const slug = SEARCH_CATEGORY_SLUGS[category] || ''
      const params = new URLSearchParams({ q: term })
      if (slug) params.set('category', slug)
      navigate(`/search?${params.toString()}`)
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length > 0) {
      const catSlug = SEARCH_CATEGORY_SLUGS[category] || ''
      const matches = searchProducts(trimmed, { categorySlug: catSlug })
      setSuggestions(matches.slice(0, 6))
    } else {
      setSuggestions([])
    }
    setActiveIndex(-1)
  }, [query, category])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowSuggestions(true)
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > -1 ? prev - 1 : prev))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex min-w-0 w-full gap-0 overflow-hidden rounded-full bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-dcc-primary/20">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="hidden shrink-0 border-r border-slate-200 bg-slate-50 pl-4 pr-2 text-xs font-medium text-slate-700 focus:outline-none lg:block"
          aria-label="Search category"
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and shops..."
          className="h-11 min-w-0 flex-1 border-0 bg-transparent py-2 pl-4 pr-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0 lg:pl-3"
          autoComplete="off"
        />
        <button
          type="submit"
          className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dcc-primary text-white transition-colors hover:bg-dcc-primary-hover"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {showSuggestions && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50">
          {suggestions.length > 0 ? (
            suggestions.map((product, index) => (
              <div
                key={product.id}
                onClick={() => {
                  navigate(`/product/${product.id}`)
                  setShowSuggestions(false)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  activeIndex === index ? 'bg-slate-50' : 'bg-transparent'
                }`}
              >
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-50 border border-slate-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      DCC
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {product.brand}
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-700">
                    {product.name}
                  </div>
                </div>
                <div className="shrink-0 text-xs font-bold text-slate-900">
                  LKR {product.price.toLocaleString('en-LK')}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-500">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HeaderSearch({ className = '' }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isSearchPage = location.pathname === '/search'
  const query = searchParams.get('q') || ''
  const category = categoryFromSlug(searchParams.get('category') || '')

  if (isSearchPage) {
    return (
      <SearchPageBar
        key={`${query}-${category}`}
        className={className}
        query={query}
        category={category}
      />
    )
  }

  return <DefaultSearchBar className={className} />
}
