import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEARCH_CATEGORY_SLUGS } from '../../data/searchUtils'
import { listingsApi } from '../../services/api'

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

function useBackendSuggestions(term) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = term.trim()

    if (q.length < 2) {
      setSuggestions([])
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      setLoading(true)

      try {
        const response = await listingsApi.suggestions({ q }, { signal: controller.signal })
        const values = response.data?.suggestions ?? []
        setSuggestions(values.map((value, index) => ({ id: `${value}-${index}`, name: value })))
      } catch (error) {
        if (error?.name !== 'CanceledError' && error?.name !== 'AbortError') {
          setSuggestions([])
        }
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [term])

  return { suggestions, loading, clearSuggestions: () => setSuggestions([]) }
}

function SearchPageBar({ className, query, category }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const dropdownRef = useRef(null)
  const { suggestions, loading, clearSuggestions } = useBackendSuggestions(term)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        clearSuggestions()
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
    clearSuggestions()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch(term, selectedCategory)
  }

  const handleInputChange = (e) => {
    setTerm(e.target.value)
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
                  runSearch(item.name, selectedCategory)
                  setTerm(item.name)
                  clearSuggestions()
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-800 font-medium transition"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && suggestions.length === 0 && term.trim().length >= 2 && (
        <div className="absolute top-12 left-0 right-0 z-50 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
          Searching...
        </div>
      )}
    </div>
  )
}

function DefaultSearchBar({ className }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const dropdownRef = useRef(null)
  const { suggestions, loading, clearSuggestions } = useBackendSuggestions(query)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        clearSuggestions()
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
    clearSuggestions()
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className={`flex min-w-0 gap-0 overflow-hidden rounded-full bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-dcc-primary/20 ${className}`}>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
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
                  const params = new URLSearchParams({ q: item.name })
                  const slug = SEARCH_CATEGORY_SLUGS[category] || ''
                  if (slug) params.set('category', slug)
                  navigate(`/search?${params.toString()}`)
                  setQuery(item.name)
                  clearSuggestions()
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-800 font-medium transition"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && suggestions.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-12 left-0 right-0 z-50 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
          Searching...
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

