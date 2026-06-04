import { useState } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Contact', to: null },
]

const supportChannels = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@digitalcitycenter.lk',
    note: 'We reply within one business day.',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+94 11 234 5678',
    note: 'Mon–Sat, 9:00 AM – 6:00 PM.',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: '42 Flower Road, Colombo 07',
    note: 'Visits by appointment only.',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: 'Monday – Saturday',
    note: '9:00 AM – 6:00 PM (LKST)',
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setName('')
    setEmail('')
    setMessage('')
    setSubject('general')
  }

  return (
    <div className="min-w-0 bg-slate-50/50">
      <PageContainer className="pb-14">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 max-w-3xl">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Contact us</h1>
          <p className="mt-2 text-slate-600">
            Questions about an order, a seller, or using the marketplace? Send us a message and our
            support team will help.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900">Send a message</h2>

            {sent && (
              <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Thank you — your message has been received. We will email you shortly.
              </p>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                >
                  <option value="general">General inquiry</option>
                  <option value="order">Order help</option>
                  <option value="seller">Seller support</option>
                  <option value="payment">Payments & refunds</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Submit message
            </button>
          </form>

          <aside className="space-y-4">
            {supportChannels.map((channel) => (
              <div
                key={channel.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <channel.icon className="h-5 w-5 text-dcc-primary" />
                <h3 className="mt-2 font-semibold text-slate-900">{channel.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-800">{channel.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{channel.note}</p>
              </div>
            ))}
          </aside>
        </div>
      </PageContainer>
    </div>
  )
}
