import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEARCH_CATEGORY_SLUGS } from '../../data/searchUtils'

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
    runSearch(term, selectedCategory)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex h-11 w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
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
  )
}

function DefaultSearchBar({ className }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')

  const handleSubmit = (e) => {
    e.preventDefault()
    const term = query.trim()
    if (!term) return
    const slug = SEARCH_CATEGORY_SLUGS[category] || ''
    const params = new URLSearchParams({ q: term })
    if (slug) params.set('category', slug)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`flex min-w-0 gap-0 overflow-hidden rounded-full bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-dcc-primary/20 ${className}`}>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="hidden shrink-0 border-r border-slate-200 bg-slate-50/80 pl-4 pr-2 text-xs font-medium text-slate-700 focus:outline-none lg:block"
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
