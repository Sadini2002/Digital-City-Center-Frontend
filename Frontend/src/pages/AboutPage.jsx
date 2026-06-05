import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'

const highlights = [
  {
    title: 'Our Mission',
    body: 'To build a trusted, inclusive marketplace that helps local businesses grow and makes shopping easier for everyone in Sri Lanka.',
    icon: Sparkles,
    tone: 'bg-white',
  },
  {
    title: 'Our Vision',
    body: 'To become Sri Lanka’s leading digital commerce ecosystem with global standards, strong local roots, and opportunities for every entrepreneur.',
    icon: ShieldCheck,
    tone: 'bg-slate-900 text-white',
  },
]

const valueCards = [
  {
    title: 'Trusted by 5,000+ Local Sellers',
    subtitle: 'Verified businesses, secure onboarding, and reliable support.',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Integrity First',
    subtitle: 'Transparent policies and safe transactions.',
    color: 'bg-cyan-400 text-slate-900',
  },
  {
    title: 'Community Led',
    subtitle: 'Built for Sri Lankan buyers and sellers.',
    color: 'bg-slate-100 text-slate-800',
  },
]

const stats = [
  { value: '250K+', label: 'Active Customers' },
  { value: 'Sri Lanka', label: 'Islandwide Reach' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '24/7', label: 'Customer Support' },
]

const leaders = [
  { name: 'Dimuthu Perera', role: 'Founder & CEO' },
  { name: 'Sahan Jayawardena', role: 'COO' },
  { name: 'Arda Wickramasinghe', role: 'CTO' },
  { name: 'Piyu Ranatunga', role: 'Head of Growth' },
]

export default function AboutPage() {
  return (
    <div className="min-w-0 bg-slate-50">
      <PageContainer className="space-y-5 pb-14">
        <section className="rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-100/70 to-white px-6 py-12 text-center sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dcc-primary">
            Empowering Sri Lanka
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Empowering Sri Lanka&apos;s{' '}
            <span className="bg-gradient-to-r from-dcc-primary to-violet-500 bg-clip-text text-transparent">
              Digital Frontier
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Digital City Center (DCC) is Sri Lanka&apos;s trusted platform connecting buyers and
            sellers through secure transactions, verified stores, and digital growth opportunities.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register/seller"
              className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Join Our Ecosystem <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Our Impact Report
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {highlights.map((item) => (
            <article
              key={item.title}
              className={`rounded-2xl border border-slate-200 p-6 shadow-sm ${item.tone}`}
            >
              <item.icon className="h-5 w-5 text-dcc-primary" />
              <h2 className="mt-3 text-2xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={valueCards[0].image}
              alt={valueCards[0].title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-slate-900">{valueCards[0].title}</h3>
              <p className="mt-1 text-sm text-slate-600">{valueCards[0].subtitle}</p>
            </div>
          </article>
          {valueCards.slice(1).map((item) => (
            <article
              key={item.title}
              className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${item.color}`}
            >
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm opacity-80">{item.subtitle}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-900 p-5 text-center text-white sm:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-300">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1.2fr]">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
            alt="Supporting local entrepreneurs"
            className="h-64 w-full rounded-xl object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Empowering Local Entrepreneurs</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Digital City Center was built from a simple observation: Sri Lanka is emerging with
              incredible talent, but the lack of a unified digital platform has held many local
              businesses back.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-dcc-primary" />
                Secure Financial Backbone
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-dcc-primary" />
                Integrated Logistics
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900">Guided by Excellence</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Our leadership team combines deep business knowledge with product and technology
            execution to keep DCC trusted, secure, and customer-focused.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <article
                key={person.name}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-slate-300" />
                <p className="mt-3 font-semibold text-slate-900">{person.name}</p>
                <p className="text-xs text-slate-500">{person.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-dcc-primary via-violet-600 to-violet-500 px-6 py-10 text-center text-white sm:px-8">
          <h2 className="text-3xl font-bold">Ready to Digitalize Your Shop?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-violet-100">
            Join thousands of Sri Lankan businesses already growing through Digital City Center.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/register/seller"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-dcc-primary hover:bg-slate-100"
            >
              Start Selling Now
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>
        </section>
      </PageContainer>
    </div>
  )
}
