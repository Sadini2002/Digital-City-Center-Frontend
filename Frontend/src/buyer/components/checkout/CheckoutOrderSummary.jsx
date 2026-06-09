import CdnImage from '../../../components/common/CdnImage'
import { formatLkr } from '../../../components/category/categoryData'

export default function CheckoutOrderSummary({ cart, subtotal, deliveryFee }) {
  const total = subtotal + deliveryFee

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {cart.map((item) => (
          <li key={item.lineId ?? item.id} className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1">
              <CdnImage src={item.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">
                Qty {item.quantity} · {item.seller}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-dcc-primary">
                {formatLkr(item.price * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>Subtotal</dt>
          <dd className="font-medium text-slate-900">{formatLkr(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt>Delivery fee</dt>
          <dd className="font-medium text-slate-900">
            {deliveryFee === 0 ? 'Free' : formatLkr(deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
          <dt>Total</dt>
          <dd className="text-dcc-primary">{formatLkr(total)}</dd>
        </div>
      </dl>
    </div>
  )
}
