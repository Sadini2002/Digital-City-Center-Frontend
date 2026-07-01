import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Sparkles, Tag, X } from 'lucide-react'
import { cn } from '@/../../src/utils/cn'
import { categories } from '../home/homeData'
import { searchResults } from './searchData'

const quickSearches = ['wireless headphones', 'smart watch', 'fashion deals', 'home essentials']

function normalizeSuggestion(value) {
  return value.toLowerCase().trim()
}

export default function SearchBar({ className, compact = false, onSearch }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = useMemo(() => {
    const typed = normalizeSuggestion(query)

    const source = [
      ...searchResults.map((item) => ({
        label: item.name,
        meta: item.categoryLabel || item.brand,
        type: 'product',
      })),

      ...categories
        .filter((category) => category.slug !== 'more')
        .map((category) => ({
          label: category.label,
          meta: category.count,
          type: 'category',
          to: `/category/${category.slug}`,
        })),

      ...quickSearches.map((label) => ({
        label,
        meta: 'Popular search',
        type: 'trend',
      })),
    ]

    const unique = new Map()

    source.forEach((item) => {
      const key = normalizeSuggestion(item.label)

      if (!unique.has(key)) {
        unique.set(key, item)
      }
    })

    const ranked = Array.from(unique.values()).filter((item) => {
      if (!typed) return item.type !== 'product'

      return normalizeSuggestion(item.label).includes(typed)
    })

    return ranked.slice(0, compact ? 5 : 7)
  }, [compact, query])

  const submitSearch = (value = query) => {
    const term = value.trim()

    if (!term) return

    setIsOpen(false)
    setActiveIndex(-1)

    onSearch?.(term)

    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  const selectSuggestion = (item) => {
    if (item.to) {
      setIsOpen(false)
      setActiveIndex(-1)

      onSearch?.(item.label)

      navigate(item.to)
      return
    }

    setQuery(item.label)
    submitSearch(item.label)
  }

  const handleKeyDown = (event) => {
    if (!isOpen && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      setIsOpen(true)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (suggestions.length === 0) return

      setActiveIndex((current) => (current + 1) % suggestions.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      if (suggestions.length === 0) return

      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
    }

    if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault()
      selectSuggestion(suggestions[activeIndex])
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submitSearch()
      }}
      className={cn('relative w-full', className)}
    >
      <div
        className={cn(
          'relative flex items-center rounded-2xl border bg-white shadow-lg shadow-slate-900/10 transition focus-within:border-dcc-primary focus-within:ring-4 focus-within:ring-violet-100',
          compact ? 'h-11 border-primary-100 shadow-none' : 'h-14 border-white/80',
        )}
      >
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, shops, categories..."
          className={cn(
            'h-full min-w-0 flex-1 rounded-2xl bg-transparent pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none',
            compact ? 'pr-20' : 'pr-24 sm:text-base',
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
            className="absolute right-12 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className={cn(
            'absolute right-1.5 inline-flex items-center justify-center rounded-xl bg-dcc-primary font-semibold text-white hover:bg-dcc-primary-hover',
            compact ? 'h-8 w-9' : 'h-11 px-4',
          )}
          aria-label="Search"
        >
          {compact ? <Search className="h-4 w-4" /> : <ArrowRight className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/12">
          <div className="max-h-80 overflow-y-auto py-2">
            {suggestions.map((item, index) => {
              const Icon = item.type === 'trend' ? Sparkles : Tag

              return (
                <button
                  key={`${item.type}-${item.label}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(item)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition',
                    activeIndex === index ? 'bg-violet-50' : 'hover:bg-slate-50',
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {item.label}
                    </span>

                    <span className="block truncate text-xs text-slate-500">
                      {item.meta}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </form>
  )
}