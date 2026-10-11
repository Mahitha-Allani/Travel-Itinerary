import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import GoogleAuthModal from '../components/GoogleAuthModal.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [googleOpen, setGoogleOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfbf9] via-[#f8f7f4] to-[#f4f3ef] flex flex-col relative overflow-hidden">
      <TravelDoodleBg opacity="opacity-[0.05]" />
      <nav className="bg-white/90 backdrop-blur-md shadow-xs px-6 py-4 flex justify-between items-center relative z-10 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-burgundy-700 font-brand">
          <span className="text-base">🧭</span>
          <span>Voyara</span>
        </Link>
        <Link to="/register" className="text-sm font-bold text-burgundy-700 hover:underline">Register</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-9 rounded-3xl shadow-2xl w-full max-w-md border border-white/80">
          <h2 className="text-2xl font-bold text-burgundy-600 mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-creme-300 focus:outline-none focus:ring-2 focus:ring-burgundy-300 text-sm" />
            <input type="password" placeholder="Password" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl border border-creme-300 focus:outline-none focus:ring-2 focus:ring-burgundy-300 text-sm" />
            <button type="submit" disabled={loading}
              className="w-full bg-burgundy-600 hover:bg-burgundy-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow transition cursor-pointer">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button onClick={() => setGoogleOpen(true)}
            className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl transition text-sm cursor-pointer font-semibold flex items-center justify-center gap-2">
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account? <Link to="/register" className="text-burgundy-600 underline">Register here</Link>
          </p>
        </div>
      </div>

      <GoogleAuthModal isOpen={googleOpen} onClose={() => setGoogleOpen(false)} />
    </div>
  )
}
