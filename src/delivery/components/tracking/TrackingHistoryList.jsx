export default function TrackingHistoryList({ points = [], maxHeight = 'max-h-48' }) {
  if (!points.length) {
    return <p className="text-sm text-slate-500">No GPS history yet.</p>
  }

  const sorted = [...points].sort(
    (a, b) => new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0)
  )

  return (
    <ul className={`space-y-2 overflow-y-auto text-sm ${maxHeight}`}>
      {sorted.map((p, i) => (
        <li key={p.id || `${p.latitude}-${p.recordedAt}-${i}`} className="flex justify-between text-slate-600">
          <span className="font-mono text-xs">
            {Number(p.latitude).toFixed(4)}, {Number(p.longitude).toFixed(4)}
          </span>
          <span className="text-xs text-slate-400">
            {p.recordedAt ? new Date(p.recordedAt).toLocaleTimeString() : '—'}
          </span>
        </li>
      ))}
    </ul>
  )
}
