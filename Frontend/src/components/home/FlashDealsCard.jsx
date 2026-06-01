import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'
import { flashDeals } from './homeData'

function useCountdownParts() {
  const [time, setTime] = useState({ h: 8, m: 24, s: 48 })

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) {
          s = 59
          m -= 1
        }
        if (m < 0) {
          m = 59
          h -= 1
        }
        if (h < 0) return { h: 8, m: 24, s: 48 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(time.h)} : ${pad(time.m)} : ${pad(time.s)}`
}

export default function FlashDealsCard() {
  const countdown = useCountdownParts()

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Zap className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={0} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Flash Deals</h3>
            <p className="mt-1 text-xs text-slate-500">
              Ends in <span className="font-bold text-slate-800">{countdown}</span>
            </p>
          </div>
        </div>
        <Link
          to="/deals"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="View all deals"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2.5 lg:gap-3">
        {flashDeals.map((deal) => (
          <Link
            key={deal.id}
            to={`/product/${deal.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md"
          >
            <div className={`relative aspect-[4/3] bg-gradient-to-br ${deal.hue}`}>
              <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                -{deal.discount}%
              </span>
            </div>
            <div className="flex flex-1 flex-col p-2.5 sm:p-3">
              <p className="text-xs font-bold leading-snug text-slate-900 sm:text-[13px]">
                {deal.name}
              </p>
              <p className="mt-1.5 text-sm font-bold text-dcc-primary">LKR {deal.price}</p>
              <p className="text-[11px] text-slate-400 line-through">LKR {deal.oldPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
