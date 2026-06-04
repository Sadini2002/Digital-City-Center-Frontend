import PageContainer from '../components/layout/PageContainer'

function PlaceholderPage({ title, description }) {
  return (
    <PageContainer>
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
      <p className="mt-4 text-sm text-slate-500">
        This is a Team E scaffold page for Phase 1 routing and layout setup.
      </p>
    </section>
    </PageContainer>
  )
}

export default PlaceholderPage
