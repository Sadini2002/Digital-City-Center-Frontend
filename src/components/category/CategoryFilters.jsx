import { Star } from 'lucide-react'
import { locationOptions, ratingFilters } from './categoryData'

function DualRangeSlider({ min, max, onMinChange, onMaxChange }) {
  const safeMin = Math.min(min, max - 1)
  const safeMax = Math.max(max, min + 1)

  return (
    <div className="relative mt-4 h-8">
      <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-violet-100">
        <div
          className="absolute h-full rounded-full bg-dcc-primary"
          style={{ left: `${safeMin}%`, right: `${100 - safeMax}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={safeMin}
        onChange={(e) => onMinChange(Math.min(Number(e.target.value), safeMax - 1))}
        className="pointer-events-none absolute inset-0 z-20 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-dcc-primary [&::-webkit-slider-thumb]:shadow-md"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={0}
        max={100}
        value={safeMax}
        onChange={(e) => onMaxChange(Math.max(Number(e.target.value), safeMin + 1))}
        className="pointer-events-none absolute inset-0 z-30 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-dcc-primary [&::-webkit-slider-thumb]:shadow-md"
        aria-label="Maximum price"
      />
    </div>
  )
}

export default function CategoryFilters({
  subCategories,
  selectedSubs,
  onToggleSub,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  location,
  onLocationChange,
  minRating,
  onMinRatingChange,
  availability,
  onAvailabilityChange,
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
            Sub-Categories
          </h3>
          <ul className="mt-3 space-y-3">
            {subCategories.map((sub) => (
              <li key={sub.id}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedSubs.includes(sub.id)}
                      onChange={() => onToggleSub(sub.id)}
                      className="h-4 w-4 rounded border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                    />
                    <span className="text-slate-700">{sub.label}</span>
                  </span>
                  <span className="shrink-0 text-slate-400">({sub.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Price Range
          </h3>
          <DualRangeSlider
            min={priceMin}
            max={priceMax}
            onMinChange={onPriceMinChange}
            onMaxChange={onPriceMaxChange}
          />
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value="LKR 0"
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-slate-600"
            />
            <input
              type="text"
              value={priceMax >= 100 ? 'LKR 100k+' : `LKR ${(priceMax * 1000).toLocaleString()}`}
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-slate-600"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Seller Location
          </h3>
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
          >
            {locationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Availability
          </h3>
          <ul className="mt-3 space-y-2.5">
            {['All', 'In Stock', 'Out of Stock'].map((opt) => (
              <li key={opt}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === opt}
                    onChange={() => onAvailabilityChange(opt)}
                    className="h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
                  <span className="text-slate-600">{opt}</span>
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
            {ratingFilters.map((filter) => (
              <li key={filter.stars}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === filter.stars}
                    onChange={() => onMinRatingChange(filter.stars)}
                    className="h-4 w-4 border-slate-300 text-dcc-primary focus:ring-dcc-primary/30"
                  />
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
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
