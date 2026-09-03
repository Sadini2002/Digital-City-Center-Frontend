export default function CheckoutSection({ title, step, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
        {step != null && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dcc-primary text-sm font-bold text-white">
            {step}
          </span>
        )}
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
