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
  Calendar,
  UserCog,
  ArrowRight,
  QrCode,
  CheckCircle2,
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

const STATS = [
  { label: 'Role-based portals', value: '5' },
  { label: 'PDF report types', value: '5' },
  { label: 'Live QR scanning', value: '100%' },
  { label: 'Mobile friendly', value: 'Yes' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-white">
              <GraduationCap size={18} />
            </span>
            <span className="text-base font-bold">PMSC Clarin</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#roles" className="hover:text-slate-900">Portals</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
          </div>
          <Link
            to="/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        <div
          className="absolute -top-24 right-[-10%] -z-10 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 left-[-10%] -z-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <CheckCircle2 size={14} /> Built for Clarin, Bohol
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                One portal for your whole
                <span className="bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent"> school community</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Grades, billing, schedules, events, and QR attendance — built for
                admins, teachers, finance, SSG officers, students, and parents,
                each with exactly the access they need.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700"
                >
                  Sign In to Your Portal <ArrowRight size={16} />
                </Link>
                <a
                  href="#roles"
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Explore the Portals
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-bold text-slate-900">{stat.value}</dt>
                    <dd className="text-xs text-slate-500">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Admin Overview</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MockStat icon={Users} label="Total Students" value="17" tone="bg-slate-100 text-slate-700" />
                  <MockStat icon={Wallet} label="Collected" value="₱105,740" tone="bg-emerald-100 text-emerald-700" />
                  <MockStat icon={Calendar} label="Upcoming Events" value="2" tone="bg-blue-100 text-blue-700" />
                  <MockStat icon={ScanLine} label="QR Scans Today" value="12" tone="bg-teal-100 text-teal-700" />
                </div>
                <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Grade 11</span>
                    <span className="font-semibold text-slate-800">3 students</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-600 to-teal-500" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <QrCode size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Attendance Recorded</p>
                    <p className="text-[11px] text-slate-500">STD-00002 &middot; just now</p>
                  </div>
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
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-800 shadow-lg transition hover:bg-blue-50"
          >
            Go to Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-teal-600 text-white">
              <GraduationCap size={14} />
            </span>
            <span className="font-semibold text-slate-700">PMSC Clarin</span>
          </div>
          <p>&copy; {new Date().getFullYear()} PMSC Clarin School Management Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function MockStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <span className={`flex h-7 w-7 items-center justify-center rounded-md ${tone}`}>
        <Icon size={14} />
      </span>
      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  )
}
