import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function SearchAutocomplete({ className }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="h-11 w-full rounded-xl border border-primary-100 bg-primary-50/50 pl-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-white"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
