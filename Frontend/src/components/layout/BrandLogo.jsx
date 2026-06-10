import { Link } from 'react-router-dom'

export default function BrandLogo({ variant = 'header' }) {
  const isFooter = variant === 'footer'

  if (isFooter) {
    return (
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dcc-primary text-lg font-bold text-white">
          D
        </span>
        <span className="text-lg font-bold text-white">Digital City Center</span>
      </Link>
    )
  }

  return (
    <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dcc-primary text-xl font-bold text-white">
        D
      </span>
      <span className="hidden truncate text-base font-bold text-dcc-primary xs:inline sm:text-lg">
        Digital City Center
      </span>
    </Link>
  )
}
