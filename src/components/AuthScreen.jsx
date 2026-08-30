import { useState } from 'react'
import { motion } from 'motion/react'
import { EnvelopeSimple, LockKey, CheckCircle } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'

const LOGO_SRC = `${import.meta.env.BASE_URL}tmn.png`

function translateError(msg) {
  if (!msg) return 'Something went wrong. Please try again.'
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password'
  if (msg.includes('Email not confirmed')) return 'Please confirm your email before signing in'
  if (msg.includes('rate limit')) return 'Too many attempts. Please wait a while and try again.'
  return msg
}

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then tap "Forgot password?"')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email)
      if (err) throw err
      setResetSent(true)
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  if (resetSent) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ boxShadow: 'var(--shadow-md)', background: 'var(--surface)' }}
          className="w-full max-w-sm rounded-2xl p-6 text-center"
        >
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <CheckCircle size={26} weight="bold" />
          </div>
          <p className="mt-4 font-semibold" style={{ color: 'var(--text)' }}>
            Check your email
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            We sent a password reset link to {email}.
          </p>
          <button
            type="button"
            onClick={() => setResetSent(false)}
            className="mt-5 rounded-full px-4 py-2 text-sm font-medium transition"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Back to sign in
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: 'var(--shadow-md)', background: 'var(--surface)' }}
        className="w-full max-w-sm rounded-2xl p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-sm)' }}
          >
            <img src={LOGO_SRC} alt="" className="h-6 w-6 object-contain" style={{ filter: 'invert(1)' }} />
          </div>
          <p className="mt-3 text-lg font-bold" style={{ color: 'var(--text)' }}>
            Terminal 8
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sign in to manage the menu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Email
            </label>
            <div className="relative">
              <EnvelopeSimple
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Password
            </label>
            <div className="relative">
              <LockKey
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="mt-4 w-full text-center text-sm transition"
          style={{ color: 'var(--text-muted)' }}
        >
          Forgot password?
        </button>
      </motion.div>
    </div>
  )
}
