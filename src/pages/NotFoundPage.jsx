import { Link } from 'react-router-dom'
import SiteLayout from '../layouts/SiteLayout'

function NotFoundPage() {
  return (
    
      <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 items-center justify-center px-3 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">404</h1>
          <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
          <Link
            className="mt-6 inline-block rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            to="/"
          >
            Back to Home
          </Link>
        </section>
      </main>
    
  )
}

export default NotFoundPage
