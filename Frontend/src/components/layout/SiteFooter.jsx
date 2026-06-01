import { Link } from 'react-router-dom'
import { CreditCard, Facebook, Instagram } from 'lucide-react'
import BrandLogo from './BrandLogo'

const quickLinks = [
  { label: 'Help Center', to: '/help' },
  { label: 'Sell on DCC', to: '/register/seller' },
  { label: 'Track Order', to: '/order/track' },
  { label: 'Success Stories', to: '/about' },
]

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookies Policy', to: '/cookies' },
]

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-dcc-bar text-slate-300">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Sri Lanka&apos;s trusted marketplace connecting buyers with verified local shops
              and empowering sellers to grow nationwide.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Stay Updated</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Subscribe for the latest deals and tech drops.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/30"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 sm:text-sm">
            © 2024 Digital City Center. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex h-7 w-11 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-slate-400"
              >
                <CreditCard className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
