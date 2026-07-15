import { PackageSearch } from 'lucide-react'

export default function CategoryHero({ categoryData, slug }) {
  const title = categoryData?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '))
  
  return (
    <div className="relative overflow-hidden bg-dcc-primary px-6 py-12 sm:px-12 sm:py-20 lg:px-16">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 8V0h8" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-3 shadow-sm backdrop-blur-md">
          <PackageSearch className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100 sm:mt-6">
          Discover a wide range of top-quality products in the {title} category. Find exactly what you need with our extensive collection.
        </p>
      </div>
    </div>
  )
}
