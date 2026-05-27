import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/">
        Back to Home
      </Link>
    </section>
  )
}

export default NotFoundPage
