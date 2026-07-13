import { Link } from 'react-router-dom'
import { formatLkr } from '../../../components/category/categoryData'
import { savedAddresses } from '../../data/checkoutData'
import { calculateDeliveryFee } from '../../utils/deliveryPricing'
import { usePlatformSettings } from '../../../hooks/usePlatformSettings'

export default function CartSummary({ subtotal, itemCount, onClear }) {
  const { settings } = usePlatformSettings()
  const defaultAddress =
    savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null
  const deliveryQuote = calculateDeliveryFee({
    address: defaultAddress,
    methodId: 'platform',
    subtotal,
    settings,
  })
  const delivery = itemCount > 0 ? deliveryQuote.fee : 0
  const total = subtotal + delivery

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>Subtotal ({itemCount} items)</dt>
          <dd className="font-medium text-slate-900">{formatLkr(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt>
            Estimated delivery
            {deliveryQuote.distanceKm != null && (
              <span className="mt-0.5 block text-xs font-normal text-slate-400">
                ~{deliveryQuote.distanceKm} km to {defaultAddress?.district || 'destination'}
              </span>
            )}
          </dt>
          <dd className="font-medium text-slate-900">
            {delivery === 0 ? '—' : formatLkr(delivery)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
          <dt>Total</dt>
          <dd className="text-dcc-primary">{formatLkr(total)}</dd>
        </div>
      </dl>

      <Link
        to="/checkout"
        className={`mt-6 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white ${
          itemCount > 0
            ? 'bg-dcc-primary hover:bg-dcc-primary-hover'
            : 'pointer-events-none bg-slate-300'
        }`}
      >
        Proceed to Checkout
      </Link>

      <Link
        to="/"
        className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Continue Shopping
      </Link>

      {itemCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 w-full text-center text-xs font-medium text-slate-500 hover:text-red-600"
        >
          Clear cart
        </button>
      )}
    </div>
  )
}
