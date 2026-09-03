import { Link } from 'react-router-dom'
import { APP_NAME } from '@/utils/constants'
import { SOCIAL_LINKS } from '@/components/icons/SocialIcons'

export default function FooterDefault() {
  return (
    <footer className="bg-[#0f1126] text-white">
      <div className="container-dcc grid gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">{APP_NAME}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Connecting buyers and sellers across Sri Lanka through a modern, secure, and efficient marketplace.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:border-primary hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Categories</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Groceries</li>
            <li>Home & Living</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Newsletter</h4>
          <p className="mt-3 text-sm text-slate-300">Subscribe for the latest deals and store openings.</p>
          <input
            type="email"
            placeholder="Email Address"
            className="mt-4 h-10 w-full rounded-lg border border-slate-700 bg-[#1a1d34] px-3 text-sm outline-none"
          />
          <button type="button" className="mt-3 h-10 w-full rounded-lg bg-primary text-sm font-semibold">
            Subscribe Now
          </button>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
