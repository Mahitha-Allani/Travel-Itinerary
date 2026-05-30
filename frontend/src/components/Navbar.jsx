import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navLink = (to, label) => (
    <Link to={to} onClick={() => setOpen(false)}
      className={`text-sm font-semibold transition-colors ${
        pathname === to
          ? 'text-burgundy-600 border-b-2 border-burgundy-500 pb-0.5'
          : 'text-gray-600 hover:text-burgundy-600'
      }`}>
      {label}
    </Link>
  )

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/home" className="text-lg font-bold text-burgundy-600 shrink-0">Voyara</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLink('/home',      'Home')}
          {navLink('/planner',   'Plan Your Trip')}
          {navLink('/itinerary', 'Your Itinerary')}
          {navLink('/map', '🗺️ Map')}
        </div>

        {/* Avatar + logout */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:bg-creme-50 px-3 py-1.5 rounded-xl transition">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-500 to-burgundy-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 max-w-24 truncate">{user?.name}</span>
          </button>
          <button onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition">
            Logout
          </button>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} className="md:hidden text-2xl text-burgundy-600">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3 bg-white">
          {navLink('/home',      'Home')}
          {navLink('/planner',   'Plan Your Trip')}
          {navLink('/itinerary', 'Your Itinerary')}
          {navLink('/profile',   'Profile')}
          <button onClick={handleLogout} className="text-sm text-left text-red-400 hover:text-red-600">Logout</button>
        </div>
      )}
    </nav>
  )
}
