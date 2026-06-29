import { useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function GoogleAuthModal({ isOpen, onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/google', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase()
      })
      login(data.token, data.user)
      onClose()
      navigate('/home')
    } catch (err) {
      setError('Sign in failed. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#131314] text-[#e3e3e3] rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-[#303134] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#303134]">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Sign in with Google</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition cursor-pointer">✕</button>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Google Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-[#1b3a60] flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-normal text-white">Sign in</h2>
            <p className="text-[#9aa0a6] text-sm mt-1">to continue to <span className="text-[#8ab4f8]">Voyara</span></p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider block mb-1.5">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ravi Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-[#1f1f1f] border border-[#303134] text-white focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] text-sm transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider block mb-1.5">Gmail Address</label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-[#1f1f1f] border border-[#303134] text-white focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] text-sm transition"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-center text-sm font-semibold text-gray-400 hover:bg-[#2d2e30] rounded-xl transition border border-[#303134] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#131314] py-3 rounded-xl text-sm font-bold transition disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="text-[#9aa0a6] text-xs leading-relaxed mt-5 text-center">
            To continue, your name and email will be shared with Voyara.
          </p>
        </div>
      </div>
    </div>
  )
}
