import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import Footer from '../components/Footer.jsx'

export default function Register() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.token, data.user)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-burgundy-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-burgundy-600">Voyara</Link>
        <Link to="/login" className="text-sm font-semibold text-burgundy-600 hover:underline">Login</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-burgundy-700 mb-6 text-center">Create an Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300 text-sm" />
            <input type="email" placeholder="Email" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300 text-sm" />
            <input type="password" placeholder="Password" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300 text-sm" />
            <button type="submit" disabled={loading}
              className="w-full bg-pink-400 hover:bg-creme-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Have an account? <Link to="/login" className="text-burgundy-600 underline">Login here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
