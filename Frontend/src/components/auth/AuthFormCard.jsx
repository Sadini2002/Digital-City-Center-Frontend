export default function AuthFormCard({ title, subtitle, children }) {
  return (
    <div className="w-full min-w-0 max-w-md rounded-2xl border border-slate-100/80 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.08)] sm:p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}
