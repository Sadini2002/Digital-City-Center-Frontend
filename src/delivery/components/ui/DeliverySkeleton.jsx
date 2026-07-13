export function DeliveryStatsSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/80" />
      ))}
    </div>
  )
}

export function DeliveryBlockSkeleton({ className = 'h-64' }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />
}
