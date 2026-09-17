import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const AuthContext = createContext(null)

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'touchstart']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pmsc_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch {
      // Best-effort: still clear local session even if the request fails.
    }
    localStorage.removeItem('pmsc_token')
    localStorage.removeItem('pmsc_user')
    setUser(null)
    navigate('/login')
  }, [navigate])

  const login = useCallback(async (accessCode, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/login', {
        access_code: accessCode,
        password,
      })
      localStorage.setItem('pmsc_token', data.token)
      localStorage.setItem('pmsc_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }, [])

  // 15-minute inactivity auto-logout.
  useEffect(() => {
    if (!user) return undefined

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        logout()
      }, INACTIVITY_LIMIT_MS)
    }

    resetTimer()
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [user, logout])

  const value = {
    user,
    role: user?.role ?? null,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
