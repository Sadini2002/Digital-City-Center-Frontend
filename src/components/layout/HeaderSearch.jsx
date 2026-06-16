import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEARCH_CATEGORY_SLUGS } from '../../data/searchUtils'
import { getAllCategoryListings } from '../category/categoryData'

function getVisibleCategoryOptions() {
  const allSlugs = Object.entries(SEARCH_CATEGORY_SLUGS)
  try {
    const stored = localStorage.getItem('dcc_admin_categories')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const enabled = new Set(parsed.filter((c) => c.enabled !== false).map((c) => c.slug))
        return allSlugs.filter(([label, slug]) => {
          if (!slug) return true
          return enabled.has(slug)
        }).map(([label]) => label)
      }
    }
  } catch (e) {}
  return Object.keys(SEARCH_CATEGORY_SLUGS)
}

function categoryFromSlug(slug) {
  if (!slug) return 'All Categories'
  const entry = Object.entries(SEARCH_CATEGORY_SLUGS).find(([, s]) => s === slug)
  return entry ? entry[0] : 'All Categories'
}

function getSuggestions(term, categoryLabel) {
  const q = term.trim().toLowerCase()
  if (!q) return []

  const staticListings = getAllCategoryListings()
  let localProducts = []
  try {
    localProducts = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
  } catch {}

  const combined = [
    ...staticListings.map(p => ({ id: p.id, name: p.name, categorySlug: p.categorySlug })),
    ...localProducts.map(p => ({ id: p.productId || p._id || p.id, name: p.name, categorySlug: p.itemType }))
  ]

  const categorySlug = SEARCH_CATEGORY_SLUGS[categoryLabel] || ''
  const filtered = categorySlug 
    ? combined.filter(p => p.categorySlug === categorySlug)
    : combined

  const seen = new Set()
  const result = []

  for (const item of filtered) {
    if (item.name && item.name.toLowerCase().includes(q)) {
      if (!seen.has(item.name.toLowerCase())) {
        seen.add(item.name.toLowerCase())
        result.push(item)
      }
    }
  }

  return result.slice(0, 6)
}

function SearchPageBar({ className, query, category }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [suggestions, setSuggestions] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const runSearch = (searchTerm, categoryLabel) => {
    const q = searchTerm.trim()
    if (!q) return
    const slug = SEARCH_CATEGORY_SLUGS[categoryLabel] || ''
    const params = new URLSearchParams({ q })
    if (slug) params.set('category', slug)
    navigate(`/search?${params.toString()}`)
    setSuggestions([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch(term, selectedCategory)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setTerm(val)
    setSuggestions(getSuggestions(val, selectedCategory))
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form
        onSubmit={handleSubmit}
        className={`flex h-11 w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
      >
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setSuggestions(getSuggestions(term, e.target.value))
          }}
          className="hidden shrink-0 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:outline-none sm:block"
          aria-label="Search category"
        >
          {getVisibleCategoryOptions().map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="search"
          name="q"
          value={term}
          onChange={handleInputChange}
          placeholder="Search for products, brands and shops..."
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center bg-dcc-primary text-white transition-colors hover:bg-dcc-primary-hover"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/product/${item.id}`)
                  setSuggestions([])
                  setTerm('')
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-800 font-medium transition"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DefaultSearchBar({ className }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [suggestions, setSuggestions] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const term = query.trim()
    if (!term) return
    const slug = SEARCH_CATEGORY_SLUGS[category] || ''
    const params = new URLSearchParams({ q: term })
    if (slug) params.set('category', slug)
    navigate(`/search?${params.toString()}`)
    setSuggestions([])
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setSuggestions(getSuggestions(val, category))
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className={`flex min-w-0 gap-0 overflow-hidden rounded-full bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-dcc-primary/20 ${className}`}>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setSuggestions(getSuggestions(query, e.target.value))
          }}
          className="hidden shrink-0 border-r border-slate-200 bg-slate-50/80 pl-4 pr-2 text-xs font-medium text-slate-700 focus:outline-none lg:block"
          aria-label="Search category"
        >
          {getVisibleCategoryOptions().map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for products, brands and shops..."
          className="h-11 min-w-0 flex-1 border-0 bg-transparent py-2 pl-4 pr-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0 lg:pl-3"
        />
        <button
          type="submit"
          className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dcc-primary text-white transition-colors hover:bg-dcc-primary-hover"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/product/${item.id}`)
                  setSuggestions([])
                  setQuery('')
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-800 font-medium transition"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
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

