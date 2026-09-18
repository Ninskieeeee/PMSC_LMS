import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  Wallet,
  ScanLine,
  FileText,
  ShieldCheck,
  Smartphone,
  BookOpen,
  UserCog,
  ArrowRight,
  QrCode,
  CheckCircle2,
  Sparkle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    icon: UserCog,
    accent: 'from-slate-700 to-slate-900',
    ring: 'ring-slate-200',
    points: ['Manage students & staff', 'School-wide reports', 'Full oversight of every module'],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    icon: BookOpen,
    accent: 'from-blue-600 to-blue-800',
    ring: 'ring-blue-200',
    points: ['Enter grades per quarter', 'View weekly schedule', 'Download grade-sheet PDFs'],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: Wallet,
    accent: 'from-amber-500 to-amber-700',
    ring: 'ring-amber-200',
    points: ['Record & track payments', 'Monitor balances', 'Generate billing statements'],
  },
  {
    key: 'ssg',
    label: 'SSG Officer',
    icon: ScanLine,
    accent: 'from-emerald-600 to-emerald-800',
    ring: 'ring-emerald-200',
    points: ['Create & manage events', 'Live QR camera scanning', 'Full attendance logs'],
  },
  {
    key: 'student',
    label: 'Student / Parent',
    icon: GraduationCap,
    accent: 'from-teal-600 to-teal-800',
    ring: 'ring-teal-200',
    points: ['Grades & attendance history', 'Fee balance tracking', 'Personal QR code'],
  },
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

const HERO_HIGHLIGHTS = [
  { label: '5 Role Portals', icon: Users },
  { label: 'Live QR Attendance', icon: QrCode },
  { label: 'Instant PDF Reports', icon: FileText },
]

export default function LandingPage() {
  const [highlight, setHighlight] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlight((value) => (value + 1) % HERO_HIGHLIGHTS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  const ActiveIcon = HERO_HIGHLIGHTS[highlight].icon

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="PMSC Clarin seal" className="h-9 w-9" />
            <span className="text-base font-bold">PMSC Clarin</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#top" className="hover:text-blue-700">Home</a>
            <a href="#foundress" className="hover:text-blue-700">Our Foundress</a>
            <a href="#roles" className="hover:text-blue-700">Portals</a>
            <a href="#features" className="hover:text-blue-700">Features</a>
            <a href="#contact" className="hover:text-blue-700">Contact</a>
          </div>
          <Link
            to="/login"
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800"
          >
            Sign In
          </Link>
        </div>
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
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  Sign In
                </Link>
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

            <div className="relative mx-auto w-full max-w-md">
              <div
                className="absolute -right-6 -top-6 h-full w-full bg-gradient-to-br from-blue-700 to-teal-500"
                style={{ borderRadius: '62% 38% 45% 55% / 55% 45% 55% 45%' }}
                aria-hidden="true"
              />
              <div
                className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl"
                style={{ borderRadius: '62% 38% 45% 55% / 55% 45% 55% 45%' }}
              >
                <img
                  src="/images/foundress-portrait.jpg"
                  alt="Ven. Marie Rivier, foundress of the Sisters of the Presentation of Mary"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-left-8 sm:translate-x-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-white">
                    <ActiveIcon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{HERO_HIGHLIGHTS[highlight].label}</p>
                    <p className="text-xs text-slate-500">Built into every account</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-1.5">
                  {HERO_HIGHLIGHTS.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setHighlight(index)}
                      aria-label={`Show ${item.label}`}
                      className={`h-1.5 rounded-full transition-all ${
                        index === highlight ? 'w-5 bg-blue-700' : 'w-1.5 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
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
              className={`group rounded-2xl border border-slate-200 p-5 ring-1 ring-transparent transition hover:-translate-y-1 hover:shadow-xl hover:${role.ring}`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} text-white`}>
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

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to sign in?</h2>
          <p className="mt-3 text-white/80">
            Use your access code and password — admins, teachers, finance, SSG officers, students, and parents all sign in right here.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-blue-800 shadow-lg transition hover:bg-blue-50"
          >
            Go to Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="PMSC Clarin seal" className="h-8 w-8" />
            <span className="font-semibold text-slate-700">Presentation of Mary School of Clarin, Inc.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-blue-600" /> 038-417-5608
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-blue-600" /> pmscbohol2019@gmail.com
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} PMSC Clarin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
