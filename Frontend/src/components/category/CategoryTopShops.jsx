import { Link } from 'react-router-dom'
import { BadgeCheck, ChevronRight, Star } from 'lucide-react'
import CdnImage from '../common/CdnImage'

export default function CategoryTopShops({ shops, sectionTitle = 'Top Rated Shops' }) {
  if (!shops) return null

  const { featured, standard } = shops

  return (
    <section className="mt-0 bg-violet-50/90 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{sectionTitle}</h2>
          <Link
            to="/shops"
            className="inline-flex items-center gap-0.5 text-sm font-semibold text-dcc-primary hover:underline"
          >
            View All Shops
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <Link
            to={`/shop/${featured.id}`}
            className="relative min-h-[280px] overflow-hidden rounded-2xl shadow-md sm:min-h-[320px]"
          >
            <CdnImage
              src={featured.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!featured.image && <div className="absolute inset-0 bg-slate-700" aria-hidden />}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
            <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 sm:min-h-[320px] sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
                {featured.logo}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="text-xl font-bold text-white sm:text-2xl">{featured.name}</h3>
                {featured.verified && (
                  <BadgeCheck className="h-6 w-6 shrink-0 text-dcc-accent" aria-label="Verified" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-sm font-medium text-violet-200">Verified Seller</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">
                {featured.description}
              </p>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {standard.map((shop) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-6 py-8 text-center shadow-sm transition hover:shadow-md"
              >
                <div
                  className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-slate-700 shadow-inner ${shop.hue}`}
                >
                  {shop.logo}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{shop.name}</h3>
                <div className="mt-1.5 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                  <span className="text-sm font-semibold text-slate-800">{shop.rating}</span>
                  <span className="text-sm text-slate-500">· {shop.products}</span>
                </div>
                <span className="mt-5 rounded-lg bg-violet-100 px-6 py-2.5 text-sm font-semibold text-dcc-primary">
                  Visit Shop
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
