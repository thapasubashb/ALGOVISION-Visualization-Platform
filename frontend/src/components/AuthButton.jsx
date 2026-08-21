import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.name}</span>
        <button onClick={logout} aria-label="Log out"
          className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center transition-colors">
          <LogOut size={14} className="text-slate-600" />
        </button>
      </div>
    )
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}
        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 text-white text-sm font-semibold shadow-sm shadow-blue-300/40">
        Log in
      </button>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export default AuthButton