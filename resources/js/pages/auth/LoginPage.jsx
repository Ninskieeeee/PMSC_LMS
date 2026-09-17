import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Lock, IdCard, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const DEMO_ACCOUNTS = [
  { role: 'Admin', access_code: 'ADM-00001', password: 'Admin@12345' },
  { role: 'Teacher', access_code: 'TCH-00001', password: 'Teacher@123' },
  { role: 'Finance', access_code: 'FIN-00001', password: 'Finance@123' },
  { role: 'SSG Officer', access_code: 'SSG-00001', password: 'Ssg@12345' },
  { role: 'Student / Parent', access_code: 'STD-00001', password: 'Student@123' },
]

const DASHBOARD_BY_ROLE = {
  admin: '/admin',
  teacher: '/teacher',
  finance: '/finance',
  ssg: '/ssg',
  student: '/student',
  parent: '/student',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [accessCode, setAccessCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(accessCode, password)
      navigate(DASHBOARD_BY_ROLE[user.role] ?? '/login')
    } catch (err) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.errors?.access_code?.[0] ??
          'Unable to log in. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemo(account) {
    setAccessCode(account.access_code)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap size={24} />
          </span>
          <span className="text-lg font-bold">PMSC Clarin</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            School Management Portal
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            One portal for admins, teachers, finance, SSG officers, students, and
            parents — grades, billing, schedules, events, and QR attendance in
            one place.
          </p>
        </div>

        <p className="text-sm text-white/60">
          &copy; {new Date().getFullYear()} PMSC Clarin. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center bg-gray-50 px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <GraduationCap size={20} />
            </span>
            <span className="text-lg font-bold text-gray-900">PMSC Clarin</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in with your access code.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="access_code" className="mb-1 block text-sm font-medium text-gray-700">
                Access Code
              </label>
              <div className="relative">
                <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="access_code"
                  type="text"
                  required
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                  placeholder="ADM-00001"
                  autoComplete="username"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 font-mono uppercase tracking-wide focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Demo Accounts
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <div
                  key={account.access_code}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{account.role}</p>
                    <p className="font-mono text-xs text-gray-500">{account.access_code}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemo(account)}
                    className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Fill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
