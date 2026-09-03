import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Loader2, ShoppingCart, Zap } from 'lucide-react'
import CdnImage from '../common/CdnImage'
import { useShop } from '../../buyer'
import { homeApi } from '../../services/api'

const HUES = [
  'from-violet-200/90 to-violet-300/80',
  'from-slate-200/90 to-slate-300/80',
  'from-pink-200/90 to-pink-300/80',
  'from-amber-200/90 to-amber-300/80',
]

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-LK')
}

function useCountdown(endTime) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    if (!endTime) return '08 : 24 : 48'
    const total = Math.max(0, Math.floor((endTime.getTime() - now) / 1000))
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(h)} : ${pad(m)} : ${pad(s)}`
  }, [endTime, now])
}

export default function FlashDealsCard() {
  const { addToCart } = useShop()
  const [deals, setDeals] = useState([])
  const [endTime, setEndTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const countdown = useCountdown(endTime)

  useEffect(() => {
    let cancelled = false

    async function loadDeals() {
      setLoading(true)
      try {
        const response = await homeApi.getFlashSale()
        const flashSale = response?.data?.flashSale ?? response?.data?.data?.flashSale
        const products = flashSale?.products || []

        const mapped = products
          .filter(
            (product) =>
              Number.isInteger(Number(product.listingId ?? product.id)) &&
              Number(product.listingId ?? product.id) > 0 &&
              Number.isInteger(Number(product.variantId)) &&
              Number(product.variantId) > 0,
          )
          .map((product, index) => ({
            id: Number(product.listingId ?? product.id),
            listingId: Number(product.listingId ?? product.id),
            variantId: Number(product.variantId),
            name: product.title || product.name || 'Deal',
            price: Number(product.price ?? product.flashPrice ?? 0),
            oldPrice: Number(product.originalPrice || 0) || null,
            discount: Number(product.discountPercent || 0) || null,
            image: product.image || product.images?.[0] || '',
            hue: HUES[index % HUES.length],
          }))

        // One card per listing
        const byListing = new Map()
        for (const deal of mapped) {
          if (!byListing.has(deal.listingId)) byListing.set(deal.listingId, deal)
        }

        if (!cancelled) {
          setDeals([...byListing.values()].slice(0, 4))
          setEndTime(flashSale?.endTime ? new Date(flashSale.endTime) : null)
        }
      } catch {
        if (!cancelled) {
          setDeals([])
          setEndTime(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDeals()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Zap className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={0} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Flash Deals</h3>
            <p className="mt-1 text-xs text-slate-500">
              Ends in <span className="font-bold text-slate-800">{countdown}</span>
            </p>
          </div>
        </div>
        <Link
          to="/deals"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label="View all deals"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 flex flex-1 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-dcc-primary" />
        </div>
      ) : deals.length === 0 ? (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-slate-600">No active flash deals</p>
          <Link to="/deals" className="text-xs font-semibold text-dcc-primary hover:underline">
            Browse deals
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2.5 lg:gap-3">
          {deals.map((deal) => (
            <div
              key={deal.listingId}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md"
            >
              <Link
                to={`/product/${deal.listingId}`}
                className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br p-4 ${deal.hue}`}
              >
                {deal.discount != null && deal.discount > 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    -{deal.discount}%
                  </span>
                )}
                {deal.image && (
                  <CdnImage
                    src={deal.image}
                    alt={deal.name}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <Link to={`/product/${deal.listingId}`}>
                  <p className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 sm:text-[13px]">
                    {deal.name}
                  </p>
                </Link>
                <p className="mt-1.5 text-sm font-bold text-dcc-primary">
                  LKR {formatPrice(deal.price)}
                </p>
                {deal.oldPrice && (
                  <p className="text-[11px] text-slate-400 line-through">
                    LKR {formatPrice(deal.oldPrice)}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      {
                        id: deal.listingId,
                        listingId: deal.listingId,
                        productId: deal.listingId,
                        variantId: deal.variantId,
                        title: deal.name,
                        price: deal.price,
                        originalPrice: deal.oldPrice,
                        image: deal.image,
                      },
                      1,
                    )
                  }
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-dcc-primary py-1.5 text-[11px] font-bold text-white transition hover:bg-dcc-primary-hover"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
