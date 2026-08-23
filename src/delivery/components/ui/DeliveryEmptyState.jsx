export default function DeliveryEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center sm:py-14">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-dcc-primary">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
      )}
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
