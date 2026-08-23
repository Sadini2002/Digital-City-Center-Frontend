import { Clock, Navigation } from 'lucide-react'
import { formatDistance, formatEta } from '../../utils/geo'

export default function LiveEtaBadge({ etaMinutes, distanceKm, className = '' }) {
  if (etaMinutes == null && distanceKm == null) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {etaMinutes != null && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-dcc-primary">
          <Clock className="h-3.5 w-3.5" />
          ETA {formatEta(etaMinutes)}
        </span>
      )}
      {distanceKm != null && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          <Navigation className="h-3.5 w-3.5" />
          {formatDistance(distanceKm)} away
        </span>
      )}
    </div>
  )
}
