import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function ProductBreadcrumbs({ items }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.label} className="inline-flex min-w-0 items-center gap-1">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
          {item.to ? (
            <Link to={item.to} className="truncate hover:text-dcc-primary">
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
