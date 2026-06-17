import { Headphones, Package, RefreshCw, ShieldCheck } from 'lucide-react'
import { valueProps } from './homeData'

const icons = [Package, ShieldCheck, Headphones, RefreshCw]

export default function ValuePropositionBar() {
  return (
    <section className="bg-white px-3 pb-10 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-dcc-bar px-4 py-8 text-white sm:px-8 sm:py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {valueProps.map((item, i) => {
            const Icon = icons[i]
            return (
              <div key={item.title} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-snug">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
