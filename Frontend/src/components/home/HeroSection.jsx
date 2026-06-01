import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Package, ShieldCheck, Star } from 'lucide-react'
import { IMG } from '../../config/images'
import { heroTrust } from './homeData'

const trustIcons = [Package, ShieldCheck, Star]

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-3 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-14">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
            Shop smart, live better
          </p>
          <h1 className="mt-4 text-[1.85rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]">
            Everything You <span className="text-dcc-primary">Need</span>, From Everyone You{' '}
            <span className="text-dcc-accent">Love</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            Explore thousands of products from trusted sellers across Sri Lanka. Fast delivery,
            secure payments, and 24/7 support.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/category/all"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dcc-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/35 hover:bg-dcc-primary-hover sm:w-auto"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/deals"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto"
            >
              <Compass className="h-4 w-4 text-slate-600" />
              Explore Deals
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 sm:gap-8">
            {heroTrust.map((item, i) => {
              const Icon = trustIcons[i]
              return (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${item.iconColor}`} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl sm:min-h-[360px] lg:min-h-[400px]">
            {IMG.home.heroSummer ? (
            <div
              className={`absolute inset-0 bg-cover bg-center ${
                IMG.home.heroSummer ? '' : 'bg-gradient-to-br from-violet-200 via-violet-100 to-slate-100'
              }`}
              style={
                IMG.home.heroSummer
                  ? { backgroundImage: `url('${IMG.home.heroSummer}')` }
                  : undefined
              }
              aria-hidden
            />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-200 via-violet-100 to-slate-100" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 via-transparent to-violet-500/10" />

            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
              <div className="w-full max-w-[300px] rounded-2xl border border-white/40 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  New arrivals
                </p>
                <h2 className="mt-2 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                  Summer Collection 2024
                </h2>
                <p className="mt-2 text-base font-semibold text-slate-700">Up to 40% OFF</p>
                <Link
                  to="/deals"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Shop Collection
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <span className="h-2 w-7 rounded-full bg-white shadow-sm" />
              <span className="h-2 w-2 rounded-full bg-white/60" />
              <span className="h-2 w-2 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
