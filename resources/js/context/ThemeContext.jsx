import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

// System mode protocol: 6:00 AM–6:00 PM is dark mode, 6:00 PM–6:00 AM is light mode.
function computeSystemMode() {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'dark' : 'light'
}

function computeEffectiveMode(preference) {
  return preference === 'system' ? computeSystemMode() : preference
}

export function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [preference, setPreferenceState] = useState(() => {
    try {
      return localStorage.getItem('pmsc_theme') || 'system'
    } catch {
      return 'system'
    }
  })
  const [effective, setEffective] = useState(() => computeEffectiveMode(preference))

  // Once the authenticated user's saved preference loads, it becomes the source of truth.
  useEffect(() => {
    if (user?.theme_preference) {
      setPreferenceState(user.theme_preference)
    }
  }, [user?.theme_preference])

  useEffect(() => {
    const recompute = () => setEffective(computeEffectiveMode(preference))
    recompute()
    const interval = setInterval(recompute, 60 * 1000)
    return () => clearInterval(interval)
  }, [preference])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', effective === 'dark')
  }, [effective])

  const setPreference = useCallback(
    async (next) => {
      setPreferenceState(next)
      try {
        localStorage.setItem('pmsc_theme', next)
      } catch {
        // Ignore storage errors (private browsing, etc).
      }
      if (isAuthenticated) {
        try {
          await api.put('/profile/theme', { theme_preference: next })
        } catch {
          // Non-fatal: the UI already reflects the change locally.
        }
      }
    },
    [isAuthenticated],
  )

  return (
    <ThemeContext.Provider value={{ preference, effective, setPreference }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
