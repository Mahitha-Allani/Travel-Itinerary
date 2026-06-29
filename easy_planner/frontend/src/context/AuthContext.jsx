import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    if (token) {
      api.get('/users/me')
        .then(({ data }) => {
          setUser(data)
          localStorage.setItem('user', JSON.stringify(data))
        })
        .catch(err => {
          console.error("Failed to fetch fresh user data", err)
        })
    }
  }, [token])

  const login = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const logout = () => {
    setShowConfirm(true)
  }

  const forceLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setShowConfirm(false)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}

      {/* Centered Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-9999">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center border border-creme-200">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              🚪
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Logout</h3>
            <p className="text-gray-500 text-xs mb-6">Are you sure you want to log out of Voyara?</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={forceLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
