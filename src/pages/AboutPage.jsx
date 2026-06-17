import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Linkedin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react'

const stats = [
  { value: '250k+', label: 'Active Customers' },
  { value: 'Sri Lanka', label: 'Nationwide Reach' },
  { value: '4.8★', label: 'Seller Rating Avg' },
  { value: '24/7', label: 'Customer Support' },
]

const features = [
  {
    title: 'Secure Financial Backbone',
    body: 'End-to-end encrypted payment processing with local bank integration.',
  },
  {
    title: 'Integrated Logistics',
    body: 'Nationwide delivery network connecting every corner of Sri Lanka.',
  },
]

const leaders = [
  {
    name: 'Dinesh Perera',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sarah Jayawardena',
    role: 'Head of Operations',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Amila Wickramasinghe',
    role: 'Chief Technology Officer',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Priya Ranatunga',
    role: 'Director of Partnerships',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
]

export default function AboutPage() {
  return (
    <div className="min-w-0 bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-violet-100/90 via-violet-50/50 to-white px-4 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-lg bg-violet-100/80 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-dcc-primary">
            Established 2024
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.75rem]">
            Empowering Sri Lanka&apos;s
            <br />
            <span className="font-serif text-4xl italic text-dcc-primary sm:text-5xl">
              Digital Frontier
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Digital City Center (DCC) is Sri Lanka&apos;s community-driven marketplace ecosystem —
            connecting local entrepreneurs with customers through secure transactions, verified
            stores, and tools built for growth.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register/seller"
              className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover"
            >
              Join Our Ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Our Impact Report
            </Link>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
              <Target className="h-5 w-5 text-dcc-primary" strokeWidth={2} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To create a seamless digital bridge between local entrepreneurs and customers across
              Sri Lanka, fostering economic growth, innovation, and opportunity for every seller.
            </p>
          </article>

          <article className="rounded-2xl bg-[#1a1523] p-7 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Globe className="h-5 w-5 text-slate-300" strokeWidth={2} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">Our Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              To make &ldquo;Made in Sri Lanka&rdquo; a global hallmark of quality, craftsmanship,
              and digital excellence — empowering local brands to compete on the world stage.
            </p>
          </article>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <article className="relative min-h-[220px] overflow-hidden rounded-2xl shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="DCC team collaborating"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <p className="absolute bottom-5 left-5 text-lg font-bold text-white sm:text-xl">
              Trusted by 5,000+ Local Sellers
            </p>
          </article>

          <article className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-dcc-accent p-6 text-center shadow-sm">
            <ShieldCheck className="h-10 w-10 text-slate-900" strokeWidth={1.75} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">Integrity First</h3>
          </article>

          <article className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-violet-100 p-6 text-center shadow-sm">
            <Users className="h-10 w-10 text-dcc-primary" strokeWidth={1.75} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">Community Led</h3>
          </article>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-[#1a1523] py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-3 text-center sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-white sm:text-3xl">{item.value}</p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Empowering Local Entrepreneurs */}
      <section className="mx-auto max-w-7xl px-3 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <img
            src="/local-entrepreneurs.jpg"
            alt="Supporting local businesses and entrepreneurs"
            className="h-72 w-full rounded-2xl object-cover object-center shadow-sm sm:h-96"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Empowering Local Entrepreneurs
            </h2>
            <blockquote className="mt-5 border-l-4 border-dcc-primary pl-5 text-sm italic leading-relaxed text-slate-600 sm:text-base">
              &ldquo;Digital City Center was born from a simple observation: Sri Lanka is rich with
              incredible talent, yet many local businesses lack a unified digital platform to reach
              customers nationwide.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              Founded in 2024, we set out to provide the tools, infrastructure, and support local
              brands need to thrive in the digital age — from secure payments to nationwide
              logistics.
            </p>
            <ul className="mt-7 space-y-5">
              {features.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-dcc-primary"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-slate-50/60 px-3 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Guided by Excellence
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Meet the visionary leaders driving Sri Lanka&apos;s digital commerce revolution.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((person) => (
              <article
                key={person.name}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover grayscale"
                />
                <p className="mt-4 text-base font-bold text-slate-900">{person.name}</p>
                <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center text-slate-400 transition hover:text-dcc-primary"
                  aria-label={`${person.name} on LinkedIn`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-3 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-dcc-primary via-violet-600 to-blue-500 px-6 py-12 text-center text-white sm:px-10 sm:py-14">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Digitalize Your Shop?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-violet-100 sm:text-base">
            Join thousands of successful Sri Lankan sellers already growing their business on
            Digital City Center.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register/seller"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-dcc-primary shadow-sm transition hover:bg-slate-100"
            >
              Start Selling Now
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border-2 border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
