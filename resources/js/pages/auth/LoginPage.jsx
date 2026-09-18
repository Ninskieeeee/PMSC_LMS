import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, IdCard, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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
  const [attempts, setAttempts] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(accessCode, password)
      navigate(DASHBOARD_BY_ROLE[user.role] ?? '/login')
    } catch (err) {
      setAttempts((count) => count + 1)
      setError(
        err.response?.data?.message ??
          err.response?.data?.errors?.access_code?.[0] ??
          'Unable to log in. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      {/* Blue brand wash over the school photo, so the card and text stay readable. */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/92 via-blue-800/88 to-sky-600/80" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute bottom-24 left-1/3 h-40 w-40 rounded-full border border-white/10" />
      </div>

      <Link
        to="/"
        className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:top-6"
      >
        <ArrowLeft size={14} /> Back to Home
      </Link>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/logo.png"
            alt="Presentation of Mary School of Clarin, Inc. seal"
            className="h-36 w-36 drop-shadow-2xl sm:h-40 sm:w-40"
          />

          <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Presentation of Mary
            <br />
            School of Clarin, Inc.
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
            School Management System
          </p>

          <p className="mt-6 hidden max-w-sm text-sm text-white/60 lg:block">
            &copy; {new Date().getFullYear()} PMSC Clarin. All rights reserved.
          </p>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-center text-2xl font-bold uppercase tracking-widest text-white">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <label htmlFor="access_code" className="sr-only">
                Access Code
              </label>
              <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                id="access_code"
                type="text"
                required
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                placeholder="ACCESS CODE"
                autoComplete="username"
                className="w-full rounded-full border border-white/25 bg-white/10 py-3 pl-12 pr-4 font-mono text-sm uppercase tracking-wide text-white placeholder-white/60 outline-none transition focus:border-white/60 focus:bg-white/20"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="PASSWORD"
                autoComplete="current-password"
                className="w-full rounded-full border border-white/25 bg-white/10 py-3 pl-12 pr-12 text-sm text-white placeholder-white/60 outline-none transition focus:border-white/60 focus:bg-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-center text-xs font-medium uppercase tracking-wide text-white/50">
              Login Attempts: {attempts}
            </p>

            {error && (
              <p className="rounded-full bg-red-500/20 px-4 py-2 text-center text-xs font-medium text-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-sky-400 py-3 text-sm font-bold uppercase tracking-widest text-blue-950 shadow-lg transition hover:bg-sky-300 disabled:opacity-60"
            >
              {submitting ? 'Signing In…' : 'Log In'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowHelp((value) => !value)}
              className="text-xs font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
            >
              Forgot password?
            </button>
            {showHelp && (
              <p className="mt-2 text-xs text-white/60">
                Contact your school administrator to reset your password.
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-white/40 lg:hidden">
            &copy; {new Date().getFullYear()} PMSC Clarin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
