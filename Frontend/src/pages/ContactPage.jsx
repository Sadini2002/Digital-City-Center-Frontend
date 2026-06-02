import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { SOCIAL_LINKS } from '@/components/icons/SocialIcons'
import Button from '@/components/ui/Button'
import { FAQAccordion } from '@/components/marketplace'
import { FAQ_ITEMS, CONTACT_INFO, CONTACT_SUBJECTS } from '@/constants/staticContent'
import { cn } from '@/utils/cn'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-500'
const fieldClass =
  'w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'

function FAQGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <FAQAccordion key={item.question} items={[item]} defaultOpen={-1} />
      ))}
    </div>
  )
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [subject, setSubject] = useState(CONTACT_SUBJECTS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative flex min-h-[300px] items-center md:min-h-[340px]">
        <img
          src={CONTACT_INFO.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-dcc relative z-10 py-16 md:py-20">
          <div className="max-w-2xl text-left text-white">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Get in Touch</h1>
            <p className="text-sm leading-relaxed text-gray-200 md:text-base">
              We&apos;re here to help you with anything you need. Whether it&apos;s a question
              about an order, selling on DCC, or just a quick hello.
            </p>
          </div>
        </div>
      </section>

      {/* Form card + sidebar */}
      <section className="relative z-20 -mt-14 pb-16 md:-mt-20">
        <div className="container-dcc">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] xl:gap-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card-hover)] md:p-8 lg:p-10">
              <form onSubmit={handleSubmit}>
                <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">
                  Send Us a Message
                </h2>
                {submitted ? (
                  <div className="rounded-xl bg-emerald-50 p-8 text-center">
                    <p className="font-semibold text-emerald-800">Message sent successfully!</p>
                    <p className="mt-2 text-sm text-emerald-600">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className={labelClass}>
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          required
                          placeholder="John Doe"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          className={fieldClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className={labelClass}>
                        Subject
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={cn(fieldClass, 'appearance-none pr-10')}
                        >
                          {CONTACT_SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        placeholder="How can we help you today?"
                        className={cn(fieldClass, 'resize-none')}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button type="submit" size="lg">
                        Send Message
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl bg-primary p-6 text-white shadow-md md:p-7">
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-100" />
                    <div>
                      {CONTACT_INFO.phones.map((phone) => (
                        <p key={phone} className="text-sm text-white/95">
                          {phone}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-100" />
                    <div>
                      {CONTACT_INFO.emails.map((email) => (
                        <p key={email}>
                          <a href={`mailto:${email}`} className="text-sm text-white/95 hover:underline">
                            {email}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-100" />
                    <div>
                      {CONTACT_INFO.address.map((line) => (
                        <p key={line} className="text-sm text-white/95">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Support Hours</h3>
                <ul className="space-y-2.5">
                  {CONTACT_INFO.hours.map(({ days, time }) => (
                    <li key={days} className="flex justify-between text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{days}</span>
                      <span className={time === 'Closed' ? 'text-gray-400' : ''}>{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 md:p-6">
                <p className="mb-4 text-sm font-semibold text-gray-800">Follow our community</p>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Office location */}
      <section className="mt-12 bg-primary-50/50 py-14 md:py-16">
        <div className="container-dcc">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                Our Location
              </span>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Visit Our Office</h2>
            </div>
            <a
              href={CONTACT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-[var(--shadow-card)]">
            <iframe
              title="Digital City Center office on Google Maps"
              src={CONTACT_INFO.mapEmbedUrl}
              className="h-72 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding mt-4">
        <div className="container-dcc max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              Quick answers to common questions about shopping, selling, and payments.
            </p>
          </div>

          <FAQGrid items={FAQ_ITEMS} />

          <div className="mt-10 text-center">
            <Link
              to="/help"
              className="inline-flex rounded-full bg-primary-50 px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-100"
            >
              View All Help Topics
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
