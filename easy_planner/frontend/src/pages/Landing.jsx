import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleAuthModal from '../components/GoogleAuthModal.jsx'

const cities = [
  { name: 'Mumbai',    img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80' },
  { name: 'Jaipur',   img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80' },
  { name: 'Agra',     img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80' },
  { name: 'Goa',      img: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=600&q=80' },
  { name: 'Kerala',   img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
  { name: 'Delhi',    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80' },
  { name: 'Kolkata',  img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80' },
  { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },]
const strip = [...cities, ...cities]

export default function Landing() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [googleOpen, setGoogleOpen] = useState(false)

  useEffect(() => { if (isLoggedIn) navigate('/home') }, [isLoggedIn, navigate])

  return (
    <div className="h-screen overflow-hidden flex bg-creme-50">

      {/* Left — scrolling city strip */}
      <div className="hidden lg:flex w-5/12 h-screen overflow-hidden bg-gray-950 shrink-0">
        <div className="scroll-track w-full flex flex-col gap-3 p-4">
          {strip.map((c, i) => (
            <div key={i} className="relative rounded-2xl h-44 shrink-0 overflow-hidden">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-lg font-semibold drop-shadow-lg">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth box */}
      <div className="flex-1 h-screen flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-creme-500 flex items-center justify-center text-white text-lg">✈</div>
            <h1 className="text-2xl font-bold text-burgundy-600">Voyara</h1>
          </div>
          <p className="text-gray-500 text-sm mb-8">Plan your perfect trip effortlessly.</p>

          <div className="space-y-3">
            <button onClick={() => navigate('/login')}
              className="w-full bg-burgundy-600 hover:bg-burgundy-600 text-white font-semibold py-3 rounded-xl transition">
              Login
            </button>
            <button onClick={() => navigate('/register')}
              className="w-full border-2 border-burgundy-300 text-burgundy-600 hover:bg-burgundy-50 font-semibold py-3 rounded-xl transition">
              Register
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <button onClick={() => setGoogleOpen(true)}
              className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl transition text-sm cursor-pointer">
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      <GoogleAuthModal isOpen={googleOpen} onClose={() => setGoogleOpen(false)} />
    </div>
  )
}