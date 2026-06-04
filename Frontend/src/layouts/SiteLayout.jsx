import SiteHeader from '../components/layout/SiteHeader'
import SiteFooter from '../components/layout/SiteFooter'

export default function SiteLayout({ activeAuth = null, children, className = 'bg-white' }) {
  return (
    <div className={`flex min-h-dvh min-w-0 flex-col overflow-x-hidden ${className}`}>
      <SiteHeader activeAuth={activeAuth} showUtilityBar={!activeAuth} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  )
}
