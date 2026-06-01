import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Help Center', to: '/help' },
  { label: 'Sell on DCC', to: '/register/seller' },
  { label: 'Track Order', to: '/order/track' },
]

function AuthHeader({ variant }) {
  const isRegister = variant === 'register'
  const isForgot = variant === 'forgot'

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Link to="/" className="text-lg font-bold text-dcc-primary sm:text-xl">
          Digital City Center
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {isRegister && (
            <span className="hidden text-sm text-slate-600 sm:inline">
              Already have an account?
            </span>
          )}
          <Link
            to="/login"
            className="rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dcc-primary-hover sm:px-6"
          >
            {isForgot ? 'Back to Sign In' : 'Sign In'}
          </Link>
        </div>
      </div>
    </header>
  )
}

function AuthFooter() {
  return (
    <footer className="mt-auto bg-dcc-footer text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8 lg:px-8">
        <div>
          <p className="font-semibold text-white">Digital City Center</p>
          <p className="mt-1 text-sm text-slate-400">
            © 2024 Digital City Center. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="underline-offset-2 hover:text-white hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default function AuthPageLayout({ variant = 'register', centered = false, children }) {
  const mainClass = centered
    ? 'mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col items-center justify-center px-3 py-8 sm:px-6 sm:py-12 lg:px-8'
    : 'mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col-reverse gap-6 px-3 py-6 sm:gap-10 sm:px-6 sm:py-10 lg:flex-row lg:items-center lg:gap-14 lg:px-8 lg:py-12'

  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-dcc-auth">
      <AuthHeader variant={variant} />
      <main className={mainClass}>{children}</main>
      <AuthFooter />
    </div>
  )
}
