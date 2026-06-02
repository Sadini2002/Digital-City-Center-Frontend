import { ArrowRight, Check, Eye, Rocket, Share2, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const TEAM = [
  {
    name: 'Dinesh Perera',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sarah Jayawardena',
    role: 'Head of Operations',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Amila Wickramasinghe',
    role: 'CTO',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Priya Ranatunga',
    role: 'Director of Partnerships',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  },
]

const ABOUT_STATS = [
  { value: '250k+', label: 'ACTIVE CUSTOMERS' },
  { value: 'Sri Lanka', label: 'ISLANDWIDE REACH' },
  { value: '4.8★', label: 'SELLER RATING AVG' },
  { value: '24/7', label: 'CUSTOMER SUPPORT' },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-violet-50/70 to-transparent pb-10">
        <div className="mx-auto max-w-[1200px] px-4 py-16 text-center md:py-20">
          <span className="mb-5 inline-block rounded-full border border-violet-200 bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Established 2024
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-slate-900 md:text-[62px]">
            Empowering Sri Lanka&apos;s <span className="italic text-violet-700">Digital Frontier</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
            Digital City Center is building the infrastructure for local commerce - connecting entrepreneurs, buyers,
            and logistics across every district of the island.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/register/seller"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Join Our Ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/help"
              className="rounded-xl border border-violet-300 bg-white px-7 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Our Impact Report
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-12">
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Rocket className="h-5 w-5" />
            </div>
            <h2 className="text-[38px] font-bold leading-tight text-slate-900">Our Mission</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
              To democratize e-commerce in Sri Lanka by giving every entrepreneur a trusted platform to reach
              customers nationwide - regardless of size or location.
            </p>
          </article>

          <article className="rounded-3xl bg-[#171831] p-7 text-white">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-[38px] font-bold leading-tight">Our Vision</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-300">
              To become South Asia&apos;s most trusted digital marketplace - fostering growth and innovation while
              preserving the character of Sri Lankan commerce.
            </p>
          </article>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <article className="relative overflow-hidden rounded-3xl md:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Trusted by local sellers"
              className="h-[260px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <p className="absolute bottom-4 left-4 text-[36px] font-bold leading-none text-white">Trusted by 5,000+ Local Sellers</p>
          </article>

          <article className="rounded-3xl bg-cyan-400 p-6 text-white">
            <ShieldCheck className="mb-5 h-8 w-8" />
            <h3 className="text-[30px] font-bold leading-tight">Integrity First</h3>
            <p className="mt-2 text-[15px] text-cyan-50">Transparent policies and verified sellers you can trust.</p>
          </article>

          <article className="rounded-3xl bg-[#eceaf6] p-6">
            <Users className="mb-5 h-8 w-8 text-violet-700" />
            <h3 className="text-[30px] font-bold leading-tight text-slate-900">Community Led</h3>
            <p className="mt-2 text-[15px] text-slate-600">Built with local businesses at the heart of every decision.</p>
          </article>
        </div>
      </section>

      <section className="mt-10 w-full bg-[#0b0e1e] py-12 md:py-14">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 gap-x-6 px-4 text-center md:grid-cols-4 md:gap-y-0">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-[40px] font-extrabold leading-none tracking-tight text-white md:text-[48px]">
                {stat.value}
              </p>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 md:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Empowering local entrepreneurs"
            className="h-full min-h-[520px] w-full rounded-3xl object-cover"
          />
          <div className="py-6">
            <h2 className="text-[50px] font-bold leading-tight text-slate-900">Empowering Local Entrepreneurs</h2>
            <blockquote className="mt-6 border-l-4 border-violet-600 pl-4 text-[20px] italic leading-relaxed text-slate-700">
              We started Digital City Center because every talented maker in Sri Lanka deserved the same reach as the
              big brands - without leaving their hometown.
            </blockquote>
            <p className="mt-6 text-[20px] leading-relaxed text-slate-600">
              From Colombo to Jaffna, we partner with sellers who bring authenticity, craft, and innovation to our
              marketplace. Our platform handles payments, logistics, and growth tools so entrepreneurs can focus on
              what they do best.
            </p>
            <ul className="mt-7 space-y-5">
              <li className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
                  <Check className="h-4 w-4 text-violet-700" />
                </span>
                <div>
                  <p className="text-[28px] font-bold leading-tight text-slate-900">Secure Financial Backbone</p>
                  <p className="mt-1 text-[18px] text-slate-600">
                    PayHere, bank transfers, and COD with industry-standard encryption.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
                  <Check className="h-4 w-4 text-violet-700" />
                </span>
                <div>
                  <p className="text-[28px] font-bold leading-tight text-slate-900">Integrated Logistics</p>
                  <p className="mt-1 text-[18px] text-slate-600">
                    Islandwide delivery partners and real-time tracking for every order.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-[#f0f1f5] py-16">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <h2 className="text-[58px] font-bold leading-tight text-slate-900">Guided by Excellence</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[20px] text-slate-600">
            Our leadership team brings decades of experience in technology, retail, and community development across
            Sri Lanka.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {TEAM.map((member) => (
              <article key={member.name} className="rounded-3xl border border-slate-200 bg-white p-8">
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-slate-100"
                />
                <h3 className="mt-5 text-[28px] font-bold text-slate-900">{member.name}</h3>
                <p className="mt-1 text-[18px] text-slate-500">{member.role}</p>
                <Share2 className="mx-auto mt-5 h-4 w-4 text-slate-400" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-4 pb-16 pt-4">
        <article className="rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-cyan-500 px-8 py-14 text-center text-white shadow-lg">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight text-white md:text-[40px]">
            Ready to Digitalize Your Shop?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed text-white/90 md:text-lg">
            Join thousands of Sri Lankan sellers growing their business on Digital City Center. Get started in minutes
            with our guided onboarding.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register/seller"
              className="rounded-xl bg-white px-7 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Start Selling Now
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>
        </article>
      </section>
    </div>
  )
}
