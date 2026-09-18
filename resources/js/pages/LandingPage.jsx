import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Wallet,
  ScanLine,
  FileText,
  ShieldCheck,
  Smartphone,
  BookOpen,
  UserCog,
  QrCode,
  CheckCircle2,
  Sparkle,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Send,
} from 'lucide-react'
import api from '../utils/api'

const PORTAL_ACCENT = 'from-blue-700 to-teal-600'
const PORTAL_RING = 'ring-blue-200'

const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    icon: UserCog,
    points: ['Manage students & staff', 'School-wide reports', 'Full oversight of every module'],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    icon: BookOpen,
    points: ['Enter grades per quarter', 'View weekly schedule', 'Download grade-sheet PDFs'],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: Wallet,
    points: ['Record & track payments', 'Monitor balances', 'Generate billing statements'],
  },
  {
    key: 'ssg',
    label: 'SSG Officer',
    icon: ScanLine,
    points: ['Create & manage events', 'Live QR camera scanning', 'Full attendance logs'],
  },
  {
    key: 'student',
    label: 'Student / Parent',
    icon: GraduationCap,
    points: ['Grades & attendance history', 'Fee balance tracking', 'Personal QR code'],
  },
]

const NAV_LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'foundress', label: 'Our Foundress' },
  { id: 'roles', label: 'Portals' },
  { id: 'features', label: 'Features' },
  { id: 'contact', label: 'Contact' },
]

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Grades & Report Cards',
    description: 'Quarterly grade entry with DepEd-scale remarks, bulk save, and printable grade sheets.',
  },
  {
    icon: Wallet,
    title: 'Billing & Payments',
    description: 'Track fees, record payments, and generate billing statements with a live balance view.',
  },
  {
    icon: QrCode,
    title: 'QR Attendance',
    description: 'Every student gets a personal QR code, scanned live at events with instant duplicate detection.',
  },
  {
    icon: FileText,
    title: 'PDF Reports',
    description: 'Class lists, enrollment, billing, attendance, and grade sheets — all one click away.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Security',
    description: 'Every account sees exactly what it should — enforced end to end, not just hidden in the UI.',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'A responsive layout that holds up from a front-desk monitor to a teacher\'s phone.',
  },
]

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('top')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="PMSC Clarin seal" className="h-9 w-9" />
            <span className="text-base font-bold">PMSC Clarin</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative pb-1 transition ${
                  activeSection === link.id ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 rounded-full bg-blue-700" />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 sm:inline-block"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen((value) => !value)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileNavOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    activeSection === link.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="mt-2 rounded-full bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Sparkle className="absolute left-[8%] top-24 h-5 w-5 text-blue-300" />
          <Sparkle className="absolute right-[14%] top-16 h-4 w-4 text-teal-300" />
          <Sparkle className="absolute left-[30%] top-[70%] h-3.5 w-3.5 text-blue-200" />
          <Sparkle className="absolute right-[30%] bottom-16 h-4 w-4 text-teal-200" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Manage Your Whole School With
                <span className="bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent"> Our Digital Portal</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                From grades to billing to QR attendance — everything Presentation of Mary
                School of Clarin needs, organized in one secure, role-based system.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  Contact Us
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Phone size={15} className="text-blue-600" /> 038-417-5608
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={15} className="text-blue-600" /> pmscbohol2019@gmail.com
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-blue-600" /> Poblacion, Clarin, Bohol
                </span>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-col items-center">
              <a
                href="#foundress"
                className="mb-4 inline-flex items-center gap-1.5 self-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Sparkle size={12} /> St. Marie Rivier — Meet Our Foundress
              </a>

              <div className="relative w-full">
                <div
                  className="absolute -right-6 -top-6 h-full w-full bg-gradient-to-br from-blue-700 to-teal-500"
                  style={{ borderRadius: '62% 38% 45% 55% / 55% 45% 55% 45%' }}
                  aria-hidden="true"
                />
                <a
                  href="#foundress"
                  className="relative block aspect-[4/5] w-full overflow-hidden shadow-2xl"
                  style={{ borderRadius: '62% 38% 45% 55% / 55% 45% 55% 45%' }}
                >
                  <img
                    src="/images/foundress-portrait.jpg"
                    alt="Ven. Marie Rivier, foundress of the Sisters of the Presentation of Mary"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
                </a>

              <a
                href="#foundress"
                className="absolute -bottom-6 left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl sm:-left-8 sm:translate-x-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-white">
                    <Sparkle size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Saint Marie Rivier</p>
                    <p className="text-xs text-slate-500">Our Foundress · Est. 1796</p>
                  </div>
                </div>
              </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="foundress" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-xs lg:order-2">
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-700 to-teal-500 blur-2xl"
                style={{ borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%', opacity: 0.25 }}
                aria-hidden="true"
              />
              <img
                src="/images/foundress.png"
                alt="Ven. Marie Rivier, foundress of the Sisters of the Presentation of Mary"
                className="relative h-auto w-full drop-shadow-2xl"
              />
            </div>

            <div className="lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Our Foundress
              </span>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Saint Marie Rivier</h2>
              <p className="mt-4 text-base text-slate-600">
                Saint Marie Rivier is the foundress of the religious congregation that
                established the Presentation of Mary School of Clarin (PMSC) in Clarin,
                Bohol.
              </p>
              <p className="mt-4 text-base text-slate-600">
                She founded the Sisters of the Presentation of Mary in France in 1796,
                and her spiritual daughters later brought her educational mission across
                the world to the Philippines — and to Clarin.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div>
                  <p className="text-2xl font-bold text-blue-700">1796</p>
                  <p className="text-xs text-slate-500">Congregation founded in France</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">To Christ,</p>
                  <p className="text-xs text-slate-500">through Mary — our school motto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">A portal for every role</h2>
          <p className="mt-3 text-slate-600">
            Each account signs in with an access code, not an email — and lands on exactly the dashboard it needs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map((role) => (
            <div
              key={role.key}
              className={`group rounded-2xl border border-slate-200 p-5 ring-1 ring-transparent transition hover:-translate-y-1 hover:shadow-xl hover:${PORTAL_RING}`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${PORTAL_ACCENT} text-white`}>
                <role.icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{role.label}</h3>
              <ul className="mt-3 space-y-1.5">
                {role.points.map((point) => (
                  <li key={point} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Everything the front office needs</h2>
            <p className="mt-3 text-slate-600">
              No separate spreadsheets, no separate logbooks — it's all wired into one system.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <feature.icon size={18} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Get in touch</h2>
            <p className="mt-3 text-slate-600">
              Have feedback, a suggestion, or a question about PMSC Clarin? Send us a message below.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Call Us</p>
                    <p className="text-sm text-slate-500">038-417-5608</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email Us</p>
                    <p className="text-sm text-slate-500">pmscbohol2019@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Visit Us</p>
                    <p className="text-sm text-slate-500">Poblacion, Clarin, Bohol</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="PMSC Clarin seal" className="h-8 w-8" />
            <span className="font-semibold text-slate-700">Presentation of Mary School of Clarin, Inc.</span>
          </div>
          <p>&copy; {new Date().getFullYear()} PMSC Clarin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await api.post('/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('idle')
      setError(
        err.response?.data?.message ??
          err.response?.data?.errors?.email?.[0] ??
          'Unable to send your message. Please try again.',
      )
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Send size={20} />
        </span>
        <p className="mt-4 font-semibold text-emerald-800">Message sent!</p>
        <p className="mt-1 text-sm text-emerald-700">Thank you for reaching out — we'll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-medium text-emerald-700 underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-slate-600">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Juan Dela Cruz"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-slate-600">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-slate-600">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          placeholder="Share your feedback, a suggestion, or a question about PMSC Clarin…"
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex items-center gap-2 rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 disabled:opacity-60"
      >
        <Send size={15} /> {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
