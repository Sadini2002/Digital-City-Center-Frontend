import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  HelpCircle, 
  ChevronRight, 
  BookOpen, 
  Building, 
  Truck, 
  CreditCard,
  MessageSquare,
  ArrowRight
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'

// Content Definitions for all 4 pages
const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Learn how we protect and manage your personal data.',
    icon: ShieldCheck,
    sections: [
      {
        id: 'collection',
        title: '1. Information We Collect',
        content: 'We collect information you provide directly to us when creating a customer account, registering as a seller, or applying as a delivery partner. This includes your name, email address, phone number, delivery address, profile details, and business registrations for sellers.'
      },
      {
        id: 'usage',
        title: '2. How We Use Information',
        content: 'We use the collected information to facilitate transactions between buyers and sellers, optimize delivery routes for partners, process payments securely, verify seller authenticity, and send transactional updates or notifications.'
      },
      {
        id: 'sharing',
        title: '3. Information Sharing & Disclosure',
        content: 'To fulfill orders, we share buyer delivery details with the corresponding sellers and assigned delivery drivers. We do not sell your personal data to third parties. All financial data is processed securely through encrypted payment gateways.'
      },
      {
        id: 'rights',
        title: '4. Your Rights & Choices',
        content: 'You can review, modify, or delete your account information at any time through your Account Page. You also have the right to request a copy of all personal data we hold or request complete deletion of your DCC account.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Guidelines and legal terms for using the DCC platform.',
    icon: FileText,
    sections: [
      {
        id: 'acceptance',
        title: '1. Acceptance of Terms',
        content: 'By accessing or using the Digital City Center (DCC) platform, you agree to comply with and be bound by these Terms of Service. These terms apply to all buyers, sellers, and delivery partners.'
      },
      {
        id: 'seller-rules',
        title: '2. Seller Commitments',
        content: 'Sellers must list accurate pricing, maintain stock availability, and ship genuine items. DCC charges a standard 10% platform fee on all successful sales. Any violation of product policies can result in temporary or permanent shop suspension.'
      },
      {
        id: 'delivery-rules',
        title: '3. Delivery Obligations',
        content: 'Registered delivery partners must handle packages with care, provide real-time status updates via the delivery app, and adhere to estimated times. Earnings are calculated based on completed deliveries and distance.'
      },
      {
        id: 'buyer-rules',
        title: '4. Buyer Code of Conduct',
        content: 'Buyers must provide accurate delivery details and complete payments for COD (Cash on Delivery) or digital orders. Abuse of returns, reviews, or fraud will lead to account restrictions.'
      }
    ]
  },
  cookies: {
    title: 'Cookies Policy',
    subtitle: 'Understanding how we use cookies to improve your experience.',
    icon: Cookie,
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What are Cookies?',
        content: 'Cookies are small text files stored on your browser or device. They enable our website to remember your session, login state, and shopping cart items, ensuring a smooth browsing experience.'
      },
      {
        id: 'types-used',
        title: '2. Types of Cookies We Use',
        content: 'We use Essential Cookies (for shopping cart persistence and buyer/seller login sessions), Functional Cookies (to save dark mode or language preferences), and Performance/Analytics Cookies (to monitor platform usage patterns).'
      },
      {
        id: 'cookie-choices',
        title: '3. Managing Cookie Choices',
        content: 'Most web browsers accept cookies automatically, but you can configure your browser preferences to reject cookies or warn you before accepting them. Disabling cookies may limit your ability to use features like the shopping cart or checkout.'
      }
    ]
  },
  help: {
    title: 'Help Center & FAQ',
    subtitle: 'Frequently asked questions and guides for DCC users.',
    icon: HelpCircle,
    sections: [
      {
        id: 'faq-buyer',
        title: 'Buyers: Order & Shipping FAQ',
        content: 'To place an order, add products to your cart and proceed to Checkout. We support digital cards and cash on delivery. You can track deliveries in real-time using the Track Delivery link in the header or footer.'
      },
      {
        id: 'faq-seller',
        title: 'Sellers: Setup & Payouts FAQ',
        content: 'Register via "Sell on DCC". Once verified, add listings with custom prices and discount values. Payout requests are initiated directly from your Seller Dashboard Earnings page and processed within 2-3 business days.'
      },
      {
        id: 'faq-delivery',
        title: 'Drivers: Route & Payments FAQ',
        content: 'Approved riders can view pending deliveries, accept jobs, and use built-in navigation map triggers. Earnings are automatically updated per delivery and paid out weekly.'
      }
    ]
  }
}

export default function InfoPage({ type = 'privacy' }) {
  const data = CONTENT[type] || CONTENT.privacy
  const PageIcon = data.icon
  const [activeSection, setActiveSection] = useState(data.sections[0]?.id || '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setActiveSection(data.sections[0]?.id || '')
  }, [type])

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: data.title, to: null },
  ]

  const scrollToSection = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <PageContainer>
        <ProductBreadcrumbs items={breadcrumbs} />

        {/* Page Header (Clean, Light Layout) */}
        <div className="mt-6 flex flex-col gap-2 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-dcc-primary">
              <PageIcon className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {data.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500 sm:text-sm">
            {data.subtitle}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Left Navigation Menu (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                On This Page
              </h3>
              <nav className="flex flex-col gap-1 mt-2">
                {data.sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                      activeSection === section.id
                        ? 'bg-violet-50 text-dcc-primary'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{section.title.split('. ')[1] || section.title}</span>
                    <ChevronRight className={`h-3.5 w-3.5 opacity-60 transition-transform ${
                      activeSection === section.id ? 'translate-x-0.5' : ''
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {data.sections.map(section => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className="scroll-mt-6 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                >
                  <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Help Callout (for all pages) */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-violet-50/50 border border-violet-100 p-5 sm:flex-row">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-dcc-primary">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Still have questions?</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Contact our islandwide customer support desk directly.
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="flex items-center gap-1 rounded-xl bg-dcc-primary px-4 py-2 text-xs font-bold text-white hover:bg-dcc-primary-hover transition"
              >
                Get in Touch <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  )
}
