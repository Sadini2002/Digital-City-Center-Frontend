import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import SiteLayout from '../../layouts/SiteLayout'
import PageContainer from '../../components/layout/PageContainer'
import LiveDeliveryPanel from '../components/tracking/LiveDeliveryPanel'
import trackingApi from '../services/trackingApi'

/**
 * Public buyer tracking — no login required.
 * BACKEND: GET /tracking/public/:code or GET /delivery/track/:code
 */
export default function TrackDeliveryPage() {
  const { trackingCode: paramCode } = useParams()
  const [searchParams] = useSearchParams()
  const initialCode = paramCode || searchParams.get('code') || ''

  const [code, setCode] = useState(initialCode)
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(Boolean(initialCode))
  const [error, setError] = useState('')

  const load = async (trackingCode) => {
    if (!trackingCode?.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await trackingApi.getPublic(trackingCode.trim())
      setDelivery(data)
    } catch (err) {
      setError(err.message || 'Tracking not found')
      setDelivery(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialCode) load(initialCode)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    load(code)
  }

  return (
    <SiteLayout>
      <PageContainer className="py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Track your delivery</h1>
          <p className="mb-8 text-sm text-slate-600">
            Enter your tracking code to see status and location.{' '}
            <span className="text-slate-400">Try DCC-DLV-1001 or DCC-DLV-0998 (demo).</span>
          </p>

          <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="tracking-code" className="mb-1.5 block text-sm font-medium text-slate-700">
                Tracking code
              </label>
              <input
                id="tracking-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="DCC-DLV-XXXX"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover disabled:opacity-60 sm:mb-0"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Searching…' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !delivery && (
            <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
          )}

          {delivery && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <LiveDeliveryPanel delivery={delivery} route={delivery.route} isLive={false} />
            </div>
          )}
        </div>
      </PageContainer>
    </SiteLayout>
  )
}
