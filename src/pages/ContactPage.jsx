import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import contactHero from '../assets/images/contact-hero.jpg'

const subjectOptions = [
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'order', label: 'Order Help' },
  { value: 'seller', label: 'Seller / Vendor Inquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'general', label: 'General Inquiry' },
]

const faqItems = [
  {
    question: 'How do I track my order?',
    answer:
      'Sign in to your account and open My Orders, or use the Track Order link in the header with your order ID. You will see live status updates from checkout through delivery.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Most items can be returned within 7 days of delivery if unused and in original packaging. Open a return request from your order details page and our team will guide you through pickup or drop-off.',
  },
  {
    question: 'How can I sell on DCC?',
    answer:
      'Click Register, choose Sell on DCC, and complete seller verification. Once approved, you can list products, manage orders, and receive payouts through your seller dashboard.',
  },
  {
    question: 'Is payment secure?',
    answer:
      'Yes. All transactions are processed through encrypted payment gateways with local bank integration. DCC never stores your full card details on our servers.',
  },
]

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=42+Flower+Road,+Colombo+07,+Sri+Lanka&hl=en&z=15&output=embed'

const MAP_LINK = 'https://maps.google.com/?q=42+Flower+Road+Colombo+07+Sri+Lanka'

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        {item.question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
          {item.answer}
        </div>
      )}
    </div>
  )
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('customer-support')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(-1)

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/15'

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setName('')
    setEmail('')
    setMessage('')
    setSubject('customer-support')
  }

  return (
    <div className="min-w-0 bg-white">
      {/* Hero */}
      <section className="relative min-h-[280px] sm:min-h-[320px]">
        <img
          src={contactHero}
          alt="Modern office workspace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative mx-auto flex max-w-7xl items-end px-4 pb-28 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
              We&apos;re here to help you with anything you need. Whether it&apos;s a question about
              an order, selling on DCC, or just a quick hello.
            </p>
          </div>
        </div>
      </section>

      {/* Form + contact sidebar */}
      <section className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl lg:grid lg:grid-cols-[1.35fr_1fr]">
          <form onSubmit={handleSubmit} className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>

            {sent && (
              <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Thank you — your message has been received. We will get back to you shortly.
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  rows={5}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover"
              >
                Send Message
              </button>
            </div>
          </form>

          <aside className="flex flex-col gap-4 bg-slate-50/80 p-6 sm:p-8">
            <div className="rounded-2xl bg-dcc-primary p-6 text-white">
              <div className="space-y-5">
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-medium">+94 (11) 234 5678</p>
                    <p className="text-sm font-medium">+94 (77) 123 4567</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">
                      Email Support
                    </p>
                    <p className="mt-1 text-sm font-medium">support@digitalcity.lk</p>
                    <p className="text-sm font-medium">vendor@digitalcity.lk</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">
                      Headquarters
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      42 Flower Road, Colombo 07,
                      <br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Support Hours</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex justify-between gap-4">
                  <span>Mon – Fri</span>
                  <span className="font-medium text-slate-800">9:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Saturday</span>
                  <span className="font-medium text-slate-800">10:00 AM – 4:00 PM</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sunday</span>
                  <span className="font-medium text-slate-800">Closed</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-5">
              <p className="text-sm font-bold text-slate-900">Follow our community</p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-dcc-primary hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-dcc-primary hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-dcc-primary hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Visit Our Office */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-dcc-primary">
              Our Location
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Visit Our Office</h2>
          </div>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-dcc-primary hover:text-dcc-primary-hover"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative h-72 w-full sm:h-96">
            <iframe
              title="Digital City Center office location"
              src={MAP_EMBED_URL}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50/60 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Quick answers to common questions about shopping, selling, and using the Digital City
              Center marketplace.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqItems.map((item, index) => (
              <FaqItem
                key={item.question}
                item={item}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/help"
              className="inline-flex rounded-full bg-violet-100 px-6 py-2.5 text-sm font-semibold text-dcc-primary transition hover:bg-violet-200"
            >
              View All Help Topics
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
