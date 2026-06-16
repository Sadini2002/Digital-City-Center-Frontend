import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { categories } from './homeData'

export default function CategoriesSection() {
  const enabledSlugs = (() => {
    try {
      const stored = localStorage.getItem('dcc_admin_categories')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return new Set(parsed.filter((c) => c.enabled !== false).map((c) => c.slug))
        }
      }
    } catch {}
    return null
  })()

  const visibleCategories = categories.filter((cat) => {
    if (cat.slug === 'more') return true
    if (enabledSlugs) {
      return enabledSlugs.has(cat.slug)
    }
    return true
  })

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Explore Categories</h2>
          <Link
            to="/category/all"
            className="flex items-center gap-0.5 text-sm font-semibold text-dcc-primary hover:underline"
          >
            View All Categories
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon
            const to = cat.slug === 'more' ? '/category/all' : `/category/${cat.slug}`
            return (
              <Link
                key={cat.slug}
                to={to}
                className={`flex flex-col items-center rounded-2xl p-4 transition hover:shadow-md ${
                  cat.dashed
                    ? 'border-2 border-dashed border-slate-200 bg-white'
                    : 'border border-slate-100 bg-white'
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cat.bg}`}
                >
                  <Icon className={`h-7 w-7 ${cat.iconColor}`} strokeWidth={1.75} />
                </div>
                <p className="mt-3 text-center text-xs font-semibold text-slate-900 sm:text-sm">
                  {cat.label}
                </p>
                <p className="mt-0.5 text-center text-[10px] text-slate-500 sm:text-xs">
                  {cat.count}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
