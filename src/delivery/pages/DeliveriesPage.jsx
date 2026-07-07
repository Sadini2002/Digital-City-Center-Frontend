/** BACKEND: GET /delivery/deliveries, GET /delivery/pool, POST /delivery/deliveries/:id/accept */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, Navigation, Truck } from 'lucide-react'
import { deliveryApi } from '../services/deliveryApi'
import DeliveryStatusBadge from '../components/DeliveryStatusBadge'
import DeliverySegmentedControl from '../components/ui/DeliverySegmentedControl'
import DeliveryFilterPills from '../components/ui/DeliveryFilterPills'
import DeliveryEmptyState from '../components/ui/DeliveryEmptyState'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'
import { formatLkr } from '../../components/category/categoryData'
import { ROLES } from '../data/constants'
import { isGpsActiveStatus } from '../utils/deliveryStatus'
import { readDeliveryUser } from '../utils/readDeliveryUser'

const MINE_STATUS_FILTERS = ['', 'PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
const POOL_STATUS_FILTERS = ['', 'CONFIRMED']

function emptyStateFor(tab, status) {
  if (tab === 'mine') {
    if (status === 'CONFIRMED') {
      return {
        title: 'No pending jobs in your list',
        description:
          'Unassigned orders stay in Available pool until a driver accepts them.',
      }
    }
    return {
      title: 'No deliveries assigned yet',
      description: 'Switch to Available pool to accept your next job.',
    }
  }
  if (status && status !== 'CONFIRMED') {
    return {
      title: 'Pool shows pending jobs only',
      description: 'Clear the status filter to see unassigned orders waiting for pickup.',
    }
  }
  return {
    title: 'No jobs in the pool right now',
    description:
      'When a buyer order is confirmed, a pending delivery appears here for drivers to accept.',
  }
}

export default function DeliveriesPage() {
  const user = readDeliveryUser()
  const isDriver = user?.role === ROLES.DELIVERY_DRIVER
  const [tab, setTab] = useState('mine')
  const [deliveries, setDeliveries] = useState([])
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)

  const statusFilters = tab === 'pool' ? POOL_STATUS_FILTERS : MINE_STATUS_FILTERS

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const fetcher = tab === 'pool' ? deliveryApi.listPool : deliveryApi.listDeliveries
      const params = { page, limit: 10 }
      if (status) params.status = status
      const { data, meta: m } = await fetcher(params)
      setDeliveries(data)
      setMeta(m)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setStatus('')
  }, [tab])

  useEffect(() => {
    load(1)
  }, [tab, status])

  const handleAccept = async (id) => {
    setAcceptingId(id)
    try {
      await deliveryApi.acceptDelivery(id)
      setTab('mine')
      setStatus('PROCESSING')
      await load(1)
    } finally {
      setAcceptingId(null)
    }
  }

  const empty = emptyStateFor(tab, status)

  return (
    <div className="space-y-5">
      <DeliverySegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'mine', label: 'My deliveries' },
          { value: 'pool', label: 'Available pool' },
        ]}
      />

      <DeliveryFilterPills options={statusFilters} value={status} onChange={setStatus} />

      {loading ? (
        <DeliveryBlockSkeleton className="h-72" />
      ) : !deliveries.length ? (
        <DeliveryPanel>
          <DeliveryEmptyState
            icon={Truck}
            title={empty.title}
            description={empty.description}
            action={
              tab === 'mine' ? (
                <button
                  type="button"
                  onClick={() => setTab('pool')}
                  className="rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
                >
                  Browse available pool
                </button>
              ) : null
            }
          />
        </DeliveryPanel>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {deliveries.map((row) => (
              <article
                key={row.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/delivery/deliveries/${row.id}`}
                    className="font-semibold text-dcc-primary hover:underline"
                  >
                    {row.trackingCode}
                  </Link>
                  <DeliveryStatusBadge status={row.status} />
                </div>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span className="line-clamp-2">{row.deliveryAddress}</span>
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">{formatLkr(row.feeAmount ?? 0)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tab === 'pool' && row.status === 'CONFIRMED' ? (
                    <button
                      type="button"
                      disabled={acceptingId === row.id}
                      onClick={() => handleAccept(row.id)}
                      className="flex-1 rounded-lg bg-dcc-primary py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {acceptingId === row.id ? 'Accepting…' : 'Accept job'}
                    </button>
                  ) : (
                    <>
                      <Link
                        to={`/delivery/deliveries/${row.id}`}
                        className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Manage
                      </Link>
                      {isGpsActiveStatus(row.status) && (
                        <Link
                          to={`/delivery/deliveries/${row.id}/tracking`}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-violet-50 py-2 text-sm font-semibold text-dcc-primary"
                        >
                          <Navigation className="h-4 w-4" />
                          GPS
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Drop-off</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-semibold text-dcc-primary">
                      <Link to={`/delivery/deliveries/${row.id}`} className="hover:underline">
                        {row.trackingCode}
                      </Link>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3.5 text-slate-600">{row.deliveryAddress}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      {formatLkr(row.feeAmount ?? 0)}
                    </td>
                    <td className="px-4 py-3.5">
                      <DeliveryStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {tab === 'pool' && row.status === 'CONFIRMED' ? (
                        <button
                          type="button"
                          disabled={acceptingId === row.id}
                          onClick={() => handleAccept(row.id)}
                          className="rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          {acceptingId === row.id ? 'Accepting…' : 'Accept job'}
                        </button>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/delivery/deliveries/${row.id}`}
                            className="text-sm font-semibold text-dcc-primary hover:underline"
                          >
                            Manage
                          </Link>
                          {isGpsActiveStatus(row.status) && (
                            <Link
                              to={`/delivery/deliveries/${row.id}/tracking`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-dcc-primary"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              GPS
                            </Link>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta.totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2"
              aria-label="Delivery list pagination"
            >
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => load(meta.page - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-2 text-sm text-slate-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() => load(meta.page + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {isDriver && tab === 'mine' && (
        <p className="text-center text-xs text-slate-500 md:text-left">
          Tip: Mark <strong>Dispatched</strong> on the delivery page to start live GPS tracking.
        </p>
      )}
    </div>
  )
}
