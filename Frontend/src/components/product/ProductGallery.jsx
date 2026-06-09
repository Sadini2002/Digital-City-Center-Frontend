import { useEffect, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import CdnImage from '../common/CdnImage'
import WishlistButton from '../common/WishlistButton'

export default function ProductGallery({ images, badges, product }) {
  const galleryImages = images.filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSrc = galleryImages[activeIndex]
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' })

  useEffect(() => {
    if (isLightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isLightboxOpen])

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {galleryImages.length > 1 && (
        <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
          {galleryImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 sm:h-20 sm:w-20 ${
                activeIndex === index ? 'border-dcc-primary' : 'border-transparent'
              }`}
            >
              <CdnImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative order-1 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:order-2">
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
        {activeSrc ? (
          <button
            type="button"
            className="w-full h-full cursor-zoom-in flex items-center justify-center bg-transparent"
            onClick={() => setIsLightboxOpen(true)}
          >
            <CdnImage src={activeSrc} alt="Product" className="aspect-square w-full object-cover" />
          </button>
        ) : (
          <div className="aspect-square w-full bg-slate-100" aria-hidden />
        )}
        {product && (
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton product={product} size="md" className="shadow-sm" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm hover:bg-white"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {isLightboxOpen && activeSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsLightboxOpen(false)} />
          <div className="relative z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative max-h-[80vh] max-w-[90vw] overflow-hidden rounded-2xl bg-slate-900 shadow-2xl cursor-zoom-out"
              onClick={() => setIsLightboxOpen(false)}
            >
              <img
                src={activeSrc}
                alt="Product Zoomed"
                style={zoomStyle}
                className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-75 ease-out select-none"
              />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-350 pointer-events-none">
              Hover to zoom & pan • Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
