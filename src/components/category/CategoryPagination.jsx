import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryPagination({ currentPage = 1, onPageChange, totalPages = 1 }) {
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    if (!pages.includes(totalPages)) pages.push(totalPages)
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-10 min-w-[2.5rem] items-center justify-center px-2 text-sm font-semibold transition ${
              currentPage === page
                ? 'rounded-full bg-dcc-primary text-white shadow-md shadow-violet-300/40'
                : 'rounded-lg text-slate-600 hover:bg-white hover:text-dcc-primary'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
