import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, LayoutGrid, Shirt, Laptop, ShoppingCart, Home, Sparkles, Dumbbell, Baby } from 'lucide-react'

const iconMap = {
  Shirt: Shirt,
  Laptop: Laptop,
  ShoppingCart: ShoppingCart,
  Home: Home,
  Sparkles: Sparkles,
  Dumbbell: Dumbbell,
  Baby: Baby,
  LayoutGrid: LayoutGrid
}

const colorMap = {
  fashion: { bg: 'bg-pink-50', icon: 'text-pink-500' },
  electronics: { bg: 'bg-sky-50', icon: 'text-sky-500' },
  groceries: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
  'home-living': { bg: 'bg-amber-50', icon: 'text-amber-600' },
  beauty: { bg: 'bg-purple-50', icon: 'text-purple-500' },
  sports: { bg: 'bg-orange-50', icon: 'text-orange-500' },
  'kids-toys': { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
  default: { bg: 'bg-slate-50', icon: 'text-slate-500' }
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/home/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setLoading(false)
      })
  }, [])

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
    if (enabledSlugs) {
      return enabledSlugs.has(cat.slug)
    }
    return true
  })

  if (loading) {
    return (
      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200"></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="h-16 w-16 rounded-2xl bg-slate-200"></div>
                <div className="mt-3 h-4 w-16 rounded bg-slate-200"></div>
                <div className="mt-1 h-3 w-12 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (visibleCategories.length === 0) return null

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Explore Categories</h2>
          <Link
            to="/category/all"
            className="flex items-center gap-0.5 text-sm font-semibold text-indigo-600 hover:underline"
          >
            View All Categories
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {visibleCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || LayoutGrid
            
            const colors = colorMap[cat.slug] || colorMap.default

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 transition hover:shadow-md hover:border-slate-200/80"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition duration-300 ${colors.bg} group-hover:scale-105`}>
                  <IconComponent className={`h-7 w-7 ${colors.icon}`} strokeWidth={1.75} />
                </div>
                <p className="mt-3 text-center text-xs font-semibold text-slate-900 sm:text-sm line-clamp-1">
                  {cat.label}
                </p>
                <p className="mt-0.5 text-center text-[10px] text-slate-500 sm:text-xs">
                  {cat.count}
                </p>
              </Link>
            )
          })}

          <Link
            to="/category/all"
            className="flex flex-col items-center rounded-2xl p-4 transition hover:shadow-md border-2 border-dashed border-slate-200 bg-white group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition duration-300">
              <LayoutGrid className="h-7 w-7 text-slate-400" strokeWidth={1.75} />
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-slate-900 sm:text-sm">
              More
            </p>
            <p className="mt-0.5 text-center text-[10px] text-slate-500 sm:text-xs">
              View all
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}