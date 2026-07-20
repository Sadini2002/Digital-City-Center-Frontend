import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Package,
  Pause,
  Play,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { IMG } from '../../config/images'
import { heroTrust } from './homeData'
import { getAnnouncements } from '../../admin/utils/adminStorage'

const trustIcons = [Package, ShieldCheck, Star]

const heroSlides = [
  {
    eyebrow: 'Shop smart, live better',
    title: 'Everything You Need, From Everyone You Love',
    highlight: 'Need',
    accent: 'Love',
    copy: 'Explore thousands of products from trusted sellers across Sri Lanka. Fast delivery, secure payments, and 24/7 support.',
    ctaLabel: 'Shop Now',
    ctaTo: '/category/all',
    secondaryLabel: 'Explore Deals',
    secondaryTo: '/deals',
    image: IMG.home?.heroSummer,
    panelTitle: 'Summer Collection 2024',
    panelKicker: 'New arrivals',
    panelOffer: 'Up to 40% OFF',
  },
  {
    eyebrow: 'Fresh drops daily',
    title: 'Discover Local Shops With Citywide Convenience',
    highlight: 'Local',
    accent: 'Citywide',
    copy: 'Compare top-rated sellers, track offers, and get essentials delivered without hopping between apps.',
    ctaLabel: 'Browse Shops',
    ctaTo: '/shops',
    secondaryLabel: 'View Categories',
    secondaryTo: '/category/all',
    image: IMG.products?.smartwatch,
    panelTitle: 'Tech, fashion, groceries',
    panelKicker: 'Curated picks',
    panelOffer: 'Updated every day',
  },
  {
    eyebrow: 'Marketplace deals',
    title: 'Save More On Products People Are Buying Now',
    highlight: 'Save',
    accent: 'Now',
    copy: 'Find flash deals, verified ratings, and popular products from sellers ready to ship islandwide.',
    ctaLabel: 'See Deals',
    ctaTo: '/deals',
    secondaryLabel: 'Top Categories',
    secondaryTo: '/category/all',
    image: IMG.products?.headphones,
    panelTitle: 'Weekend discovery deals',
    panelKicker: 'Limited offers',
    panelOffer: 'New deals live',
  },
]

function renderTitle(slide) {
  const words = slide.title.split(' ')

  return words.map((word, index) => {
    const cleanedWord = word.replace(/[^a-z]/gi, '')

    const className =
      cleanedWord === slide.highlight
        ? 'text-dcc-primary'
        : cleanedWord === slide.accent
          ? 'text-dcc-accent'
          : ''

    return (
      <span key={`${word}-${index}`} className={className}>
        {word}
        {index < words.length - 1 ? ' ' : ''}
      </span>
    )
  })
}

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const slide = heroSlides[activeSlide]
  const totalSlides = heroSlides.length

  const announcement = getAnnouncements().find((a) => {
    if (!a.enabled) return false

    if (a.expiresAt) {
      return new Date(a.expiresAt) > new Date()
    }

    return true
  })

  useEffect(() => {
    if (!isPlaying) return undefined

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % totalSlides)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [isPlaying, totalSlides])

  const goToSlide = (nextIndex) => {
    setActiveSlide((nextIndex + totalSlides) % totalSlides)
    setIsPlaying(false)
  }

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-3 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:px-8 lg:py-14">
        <div className="min-w-0">
          {announcement && (
            <div className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {announcement.title}
              </p>

              <p className="mt-0.5 text-sm text-slate-600">
                {announcement.subtitle}
              </p>

              <Link
                to={announcement.ctaTo || '/category/all'}
                className="mt-2 inline-flex text-sm font-semibold text-dcc-primary hover:underline"
              >
                {announcement.ctaLabel || 'Shop now'}
                <span className="ml-1">›</span>
              </Link>
            </div>
          )}

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
            {slide.eyebrow}
          </p>

          <h1 className="mt-4 text-[1.85rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]">
            {renderTitle(slide)}
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            {slide.copy}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={slide.ctaTo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dcc-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/35 hover:bg-dcc-primary-hover sm:w-auto"
            >
              {slide.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to={slide.secondaryTo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto"
            >
              <Compass className="h-4 w-4 text-slate-600" />
              {slide.secondaryLabel}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 sm:gap-8">
            {heroTrust.map((item, index) => {
              const Icon = trustIcons[index]

              return (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${item.iconColor}`}
                      strokeWidth={2}
                    />
                  </span>

                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="relative min-h-[330px] overflow-hidden rounded-3xl sm:min-h-[390px] lg:min-h-[440px]">
            {slide.image ? (
              <div
                key={slide.image}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url('${slide.image}')` }}
                aria-hidden
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-violet-200 via-violet-100 to-slate-100"
                aria-hidden
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 via-transparent to-violet-500/10" />

            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
              <div className="w-full max-w-[300px] rounded-2xl border border-white/40 bg-white/80 p-6 text-center shadow-xl backdrop-blur-md sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {slide.panelKicker}
                </p>

                <h2 className="mt-2 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                  {slide.panelTitle}
                </h2>

                <p className="mt-2 text-base font-semibold text-slate-700">
                  {slide.panelOffer}
                </p>

                <Link
                  to={slide.ctaTo}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  {slide.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="absolute left-4 top-4 flex gap-2">
              <button
                type="button"
                onClick={() => goToSlide(activeSlide - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                aria-label="Previous hero slide"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => goToSlide(activeSlide + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                aria-label="Next hero slide"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((current) => !current)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
              aria-label={isPlaying ? 'Pause hero slider' : 'Play hero slider'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {heroSlides.map((item, index) => (
                <button
                  key={item.panelTitle}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeSlide
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-2 bg-white/60'
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}