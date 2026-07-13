import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function SearchAutocomplete({ className, compact = true, onSearch }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const searchQuery = query.trim()

    if (!searchQuery) return

    onSearch?.(searchQuery)
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        className={cn(
          'w-full rounded-xl border border-primary-100 bg-primary-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none',
          compact ? 'h-11 pl-4 pr-12' : 'h-14 pl-5 pr-14 text-base',
        )}
      />

      <button
        type="submit"
        aria-label="Search"
        className={cn(
          'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-white transition hover:opacity-90',
          compact ? 'right-1 h-9 w-9' : 'right-2 h-10 w-10',
        )}
      >
        <Search className={cn(compact ? 'h-4 w-4' : 'h-5 w-5')} />
      </button>
    </form>
  )
}