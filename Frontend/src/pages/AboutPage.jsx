import { Link } from 'react-router-dom'
import { Shield, Store, Truck } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'About', to: null },
]

const pillars = [
  {
    icon: Store,
    title: 'Trusted sellers',
    text: 'Verified shops across electronics, fashion, groceries, and more — all in one marketplace.',
  },
  {
    icon: Truck,
    title: 'Islandwide delivery',
    text: 'Platform logistics, seller pickup, and courier partners so buyers get orders their way.',
  },
  {
    icon: Shield,
    title: 'Secure checkout',
    text: 'Multiple payment options and buyer protection backed by Digital City Center policies.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-14">
        <ProductBreadcrumbs items={breadcrumbs} />

        <section className="mt-4 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">About Digital City Center</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Digital City Center (DCC) is Sri Lanka&apos;s unified online marketplace — connecting
            buyers with local and national sellers through one trusted platform.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            We help shoppers discover products by category, compare shops, and checkout with
            confidence. Sellers get a digital storefront, order tools, and access to islandwide
            buyers without building their own e-commerce site from scratch.
          </p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
            >
              <item.icon className="h-8 w-8 text-dcc-primary" />
              <h2 className="mt-3 font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-violet-100 bg-violet-50/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Who runs the platform</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Digital City Center is operated by the ITX Enterprise team as part of a national
            digital commerce initiative. Product, engineering, and seller operations work together
            to keep the marketplace secure, fair, and growing for communities across Sri Lanka.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Contact support
            </Link>
            <Link
              to="/register/seller"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Become a seller
            </Link>
          </div>
        </section>
      </PageContainer>
    </div>
  )
}
