import { Link } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import { topShops } from './homeData'
import CdnImage from '../common/CdnImage'
import { slugifyShopName } from '../../data/shopsData'

export default function TopShopsCard() {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" strokeWidth={0} />
          </span>
          <h3 className="text-base font-bold text-slate-900">Top Rated Shops</h3>
        </div>
        <Link
          to="/shops"
          className="shrink-0 text-sm font-semibold text-dcc-primary hover:underline"
        >
          View All Shops
          <span className="ml-0.5 inline-block">&gt;</span>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {topShops.slice(0, 2).map((shop) => (
          <Link
            key={shop.id}
            to={`/shop/${slugifyShopName(shop.name)}`}
            className="group block overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md"
          >
            <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-32">
              {shop.image ? (
                <CdnImage
                  src={shop.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${shop.hue}`} />
              )}
            </div>
            <div className="border-t border-slate-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
              <p className="text-sm font-bold text-slate-900">{shop.name}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                <span className="text-sm font-semibold text-slate-800">{shop.rating}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{shop.products}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
