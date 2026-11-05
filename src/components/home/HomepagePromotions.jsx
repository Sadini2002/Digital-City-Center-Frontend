import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api/client'

export default function HomepagePromotions() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await api.get('/home/announcements')

        setItems(response.data.data || [])
      } catch (error) {
        console.error('Unable to load homepage promotions:', error)
      }
    }

    loadPromotions()
  }, [])

  const apiBase = (
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '')

  if (!items.length) return null

  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-8">

      {items.map((item) => (

        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
        >

          {item.imageUrl && (
            <img
              src={`${apiBase}${item.imageUrl}`}
              alt={item.title}
              className="h-52 w-full object-cover sm:h-72"
            />
          )}

          <div className="p-5 sm:p-7">

            <h2 className="text-xl font-bold text-slate-900">
              {item.title}
            </h2>

            {item.subtitle && (
              <p className="mt-2 text-sm text-slate-600">
                {item.subtitle}
              </p>
            )}

            {item.description && (
              <p className="mt-2 text-sm text-slate-500">
                {item.description}
              </p>
            )}

            {item.ctaTo && (
              item.ctaTo.startsWith('/') ? (
                <Link
                  to={item.ctaTo}
                  className="mt-4 inline-flex rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {item.ctaLabel || 'Shop Now'}
                </Link>
              ) : (
                <a
                  href={item.ctaTo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {item.ctaLabel || 'Shop Now'}
                </a>
              )
            )}

          </div>

        </article>

      ))}

    </section>
  )
}