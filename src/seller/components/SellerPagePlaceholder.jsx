import { Construction } from 'lucide-react'

export default function SellerPagePlaceholder({ title, description }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-dcc-primary">
        <Construction className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-xs font-medium text-slate-400">This screen will be completed by the seller module teammate.</p>
    </div>
  )
}
