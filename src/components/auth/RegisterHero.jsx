import { ShieldCheck, Truck } from 'lucide-react'

const features = [
  {
    title: 'Islandwide Delivery',
    description: 'Fast and reliable across all districts.',
    icon: Truck,
    cardBg: 'bg-violet-50/90',
    iconWrap: 'bg-violet-100',
    iconColor: 'text-dcc-primary',
  },
  {
    title: 'Secure Payments',
    description: '100% protection for every transaction.',
    icon: ShieldCheck,
    cardBg: 'bg-sky-50/90',
    iconWrap: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
]

export default function RegisterHero() {
  return (
    <div className="flex w-full min-w-0 flex-col justify-center py-2 sm:py-4 lg:py-8 lg:pr-6">
      <h1 className="text-2xl font-bold leading-tight text-dcc-primary xs:text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
        Join the Pulse of Sri Lanka&apos;s Market
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
        Create your account to unlock personalized deals, track orders in real-time, and discover
        the best of local and international brands.
      </p>
      <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`flex gap-4 rounded-xl p-4 sm:p-5 ${feature.cardBg}`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 ${feature.iconWrap}`}
            >
              <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{feature.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
