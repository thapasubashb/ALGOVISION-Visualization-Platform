import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setName(''); setEmail(''); setPassword(''); setError('')
  }

  function switchMode(newMode) {
    setMode(newMode)
    resetForm()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') await signup(name, email, password)
      else await login(email, password)
      resetForm()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90vw] max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/70 p-6"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors">
              <X size={18} />
            </button>

            <h2 className="font-['Sora'] text-xl font-bold text-slate-800 mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              {mode === 'login' ? 'Log in to track your progress.' : 'Sign up to save your progress across sessions.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all" />
              )}
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all" />

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 text-white font-semibold text-sm shadow-md shadow-blue-300/40 disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {mode === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-4">
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => switchMode('signup')} className="text-blue-600 font-semibold hover:underline">Sign up</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-blue-600 font-semibold hover:underline">Log in</button>
                </>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default AuthModal