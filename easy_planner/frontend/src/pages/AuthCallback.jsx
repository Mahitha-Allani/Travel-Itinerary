import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Google redirects here after successful sign-in:
// /auth-callback?token=JWT&id=...&name=...&email=...
export default function AuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const id    = params.get('id')
    const name  = params.get('name')
    const email = params.get('email')
    const error = params.get('error')

    if (error || !token) {
      navigate('/?error=' + (error || 'unknown'))
      return
    }

    login(token, { id, name, email })
    navigate('/home')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-burgundy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
