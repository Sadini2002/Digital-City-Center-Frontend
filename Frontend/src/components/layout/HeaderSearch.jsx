import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

const categoryOptions = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Groceries',
  'Home & Living',
]

function SearchPageBar({ className, defaultQuery }) {
  const navigate = useNavigate()
  const [category, setCategory] = useState('All Categories')

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const term = String(fd.get('q') || '').trim() || 'Wireless Headphones'
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form
      key={defaultQuery}
      onSubmit={handleSubmit}
      className={`flex h-11 w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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
        defaultValue={defaultQuery}
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const term = query.trim() || 'Wireless Headphones'
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative block ${className}`}>
      <span className="sr-only">Search products, brands and shops</span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands and shops..."
        className="h-11 w-full rounded-full border-0 bg-slate-100 py-2 pl-5 pr-14 text-sm text-slate-800 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/20"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-dcc-primary text-white transition-colors hover:bg-dcc-primary-hover"
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

  if (isSearchPage) {
    return (
      <SearchPageBar
        className={className}
        defaultQuery={searchParams.get('q') || 'Wireless Headphones'}
      />
    )
  }

  return <DefaultSearchBar className={className} />
}
