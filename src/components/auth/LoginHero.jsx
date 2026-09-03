import { ShoppingCart, Store } from 'lucide-react'

const features = [
  {
    title: 'Smart Shopping',
    description: 'Access flash deals and personalized recommendations.',
    icon: ShoppingCart,
    iconBg: 'bg-violet-100',
    iconColor: 'text-dcc-primary',
  },
  {
    title: 'Seller Hub',
    description: 'Powerful tools to grow your business across the nation.',
    icon: Store,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
]

export default function LoginHero() {
  return (
    <div className="flex flex-col justify-center py-4 sm:py-8 lg:py-16 lg:pr-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-dcc-primary xs:text-xs">
        One account, infinite possibilities
      </p>
      <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 xs:text-3xl sm:mt-4 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        Everything You Need,{' '}
        <span className="text-dcc-accent">From Everyone You Love.</span>
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
        Join the fastest growing marketplace in Sri Lanka. Buy from verified local shops or start
        selling your own products to thousands of customers today.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}
            >
              <feature.icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={2} />
            </div>
            <p className="mt-3 font-semibold text-slate-900">{feature.title}</p>
            <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
