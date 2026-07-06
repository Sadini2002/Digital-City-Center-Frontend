import { Star } from 'lucide-react'
import {
  searchDeliveryOptions,
} from './searchData'

export default function SearchFilters({
  categories,
  categoryOptions = [],
  locationOptions = [],
  ratingOptions = [],
  onToggleCategory,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyPrice,
  locations,
  onToggleLocation,
  minRating,
  onMinRatingChange,
  delivery,
  onToggleDelivery,
  onClearAll,
}) {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[260px] lg:self-start xl:w-[280px]">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Category
          </h3>
          <ul className="mt-3 space-y-3">
            {categoryOptions.map((cat) => (
              <li key={cat.id}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={categories.includes(cat.slug)}
                    onChange={() => onToggleCategory(cat.slug)}
                    className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  {cat.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Price Range (LKR)
          </h3>
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
            />
          </div>
          <button
            type="button"
            onClick={onApplyPrice}
            className="mt-3 w-full rounded-lg bg-dcc-primary py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Apply Price
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Seller Location
          </h3>
          <ul className="mt-3 space-y-3">
            {locationOptions.map((loc) => (
              <li key={loc.id}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={locations.includes(loc.id)}
                    onChange={() => onToggleLocation(loc.id)}
                    className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  {loc.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Customer Rating
          </h3>
          <ul className="mt-3 space-y-2.5">
            {ratingOptions.map((filter) => (
              <li key={filter.stars}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="radio"
                    name="search-rating"
                    checked={minRating === filter.stars}
                    onChange={() => onMinRatingChange(filter.stars)}
                    className="h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  {filter.stars > 0 ? (
                    <>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < filter.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="text-slate-600">{filter.label}</span>
                    </>
                  ) : (
                    <span className="text-slate-600">{filter.label}</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Delivery Options
          </h3>
          <ul className="mt-3 space-y-3">
            {searchDeliveryOptions.map((opt) => (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={delivery.includes(opt.id)}
                    onChange={() => onToggleDelivery(opt.id)}
                    className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
