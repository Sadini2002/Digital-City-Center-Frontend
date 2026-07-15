import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'
import CdnImage from '../common/CdnImage'

function useCountdown(endTimeString) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endTimeString) return

    const calculateTime = () => {
      const difference = new Date(endTimeString) - new Date()
      
      if (difference <= 0) {
        setTimeLeft('00 : 00 : 00')
        return
      }

      const hrs = Math.floor(difference / (1000 * 60 * 60))
      const mins = Math.floor((difference / 1000 / 60) % 60)
      const secs = Math.floor((difference / 1000) % 60)

      const pad = (n) => String(n).padStart(2, '0')
      setTimeLeft(`${pad(hrs)} : ${pad(mins)} : ${pad(secs)}`)
    }

    calculateTime() // Initial call
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [endTimeString])

  return timeLeft || '00 : 00 : 00'
}

export default function FlashDealsCard() {
  const [flashSaleData, setFlashSaleData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/home/flash-sale')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.flashSale) {
          setFlashSaleData(data.flashSale)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching flash sale:', err)
        setLoading(false)
      })
  }, [])

  const countdown = useCountdown(flashSaleData?.endTime)

  const hueGradients = [
    'from-purple-100 to-purple-200 text-purple-600',
    'from-blue-100 to-blue-200 text-blue-600',
    'from-pink-100 to-pink-200 text-pink-600',
    'from-amber-100 to-amber-200 text-amber-600'
  ]

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <p className="text-sm text-slate-500 animate-pulse">Loading Flash Deals...</p>
      </div>
    )
  }

  if (!flashSaleData || !flashSaleData.products || flashSaleData.products.length === 0) {
    return null 
  }

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      {/* Header  */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Zap className="h-5 w-5 text-amber-500" fill="currentColor" strokeWidth={0} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">{flashSaleData.title || 'Flash Deals'}</h3>
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

      {/* Products Grid  */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2.5 lg:gap-3">
        {flashSaleData.products.map((product, index) => {
          const currentHue = hueGradients[index % hueGradients.length]

          return (
            <Link
              key={product.id}
              to={`/product/${product.variantId}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md"
            >
              {/* Product Image & Badge Area */}
              <div className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br p-4 ${currentHue}`}>
                {product.discountPercentage ? (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {product.discountPercentage}
                  </span>
                ) : (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-teal-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    NEW
                  </span>
                )}
                
                {product.image && (
                  <CdnImage
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Product Details Area */}
              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <p className="text-xs font-bold leading-snug text-slate-900 sm:text-[13px] line-clamp-2">
                  {product.title}
                </p>
                
                {/* Flash Sale Price */}
                <p className="mt-1.5 text-sm font-bold text-indigo-600">
                  LKR {Number(product.flashPrice).toLocaleString()}
                </p>
                 
                {/* Original Price (Line-through) */}
                {product.originalPrice && (
                  <p className="text-[11px] text-slate-400 line-through">
                    LKR {Number(product.originalPrice).toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}