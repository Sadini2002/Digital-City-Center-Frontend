import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { adminApi } from '../../services/adminApi'

/**
 * Type-ahead buyer filter. `value` is the selected buyer ({id,name,email}) or null.
 */
export default function BuyerFilter({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      adminApi
        .getOrderBuyerOptions(query.trim())
        .then((res) => !cancelled && setOptions(res.data?.data ?? []))
        .catch(() => !cancelled && setOptions([]))
        .finally(() => !cancelled && setLoading(false))
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, open])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  if (value) {
    return (
      <div className="flex h-[38px] items-center justify-between gap-2 rounded-lg border border-dcc-primary bg-violet-50 px-3 text-sm">
        <span className="truncate font-medium text-slate-900" title={value.email}>
          {value.name}
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear buyer filter"
          className="rounded p-0.5 text-slate-500 hover:bg-violet-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
        placeholder="Buyer name or email"
        aria-label="Filter by buyer"
        aria-expanded={open}
        aria-autocomplete="list"
        className="h-[38px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
      />
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full min-w-[16rem] overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {loading && <li className="px-3 py-2 text-sm text-slate-500">Searching…</li>}
          {!loading && options.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No buyers found.</li>}
          {options.map((buyer) => (
            <li key={buyer.id} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => {
                  onChange(buyer)
                  setQuery('')
                  setOpen(false)
                }}
                className="block w-full px-3 py-2 text-left hover:bg-violet-50"
              >
                <span className="block text-sm font-medium text-slate-900">{buyer.name}</span>
                <span className="block text-xs text-slate-500">{buyer.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}