import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import OrderDetailsPanel from '../components/orders/OrderDetailsPanel'
import useAdminOrder from '../components/orders/useAdminOrder'

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const { order, setOrder, loading, error, reload } = useAdminOrder(id)

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to orders
      </Link>

      {loading && !order ? (
        <div className="flex items-center justify-center py-20 text-slate-500" aria-busy="true">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading order…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center" role="alert">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Try again
          </button>
        </div>
      ) : order ? (
        <OrderDetailsPanel order={order} onOrderChange={(next) => next && setOrder(next)} />
      ) : null}
    </div>
  )
}