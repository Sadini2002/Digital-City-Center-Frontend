export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
