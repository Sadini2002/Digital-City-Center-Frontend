import { api } from '../services/api'

function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Frontend Initialized</h1>
      <p className="text-slate-600">
        This React + Vite client is ready with routing, page layout, and an API service layer built on Axios.
      </p>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Configured API base URL</p>
        <code className="mt-1 block text-sm">{api.defaults.baseURL}</code>
      </div>
    </section>
  )
}

export default HomePage
