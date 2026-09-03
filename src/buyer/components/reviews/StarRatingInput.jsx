import { Star } from 'lucide-react'

export default function StarRatingInput({ value, onChange, label = 'Your rating' }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded p-0.5 transition hover:scale-110"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`h-8 w-8 ${
                star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
