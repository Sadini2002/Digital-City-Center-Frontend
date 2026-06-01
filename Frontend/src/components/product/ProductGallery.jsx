import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import CdnImage from '../common/CdnImage'

export default function ProductGallery({ images, badges }) {
  const galleryImages = images.filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSrc = galleryImages[activeIndex]

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
          <CdnImage src={activeSrc} alt="Product" className="aspect-square w-full object-cover" />
        ) : (
          <div className="aspect-square w-full bg-slate-100" aria-hidden />
        )}
        <button
          type="button"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm hover:bg-white"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
