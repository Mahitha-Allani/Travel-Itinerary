import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleAuthModal from '../components/GoogleAuthModal.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'

const cities = [
  { name: 'Mumbai',    img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80' },
  { name: 'Jaipur',    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80' },
  { name: 'Agra',      img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80' },
  { name: 'Goa',       img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
  { name: 'Kerala',    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
  { name: 'Delhi',     img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80' },
  { name: 'Kolkata',   img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80' },
  { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
]
const strip = [...cities, ...cities]

export default function Landing() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [googleOpen, setGoogleOpen] = useState(false)

  useEffect(() => { if (isLoggedIn) navigate('/home') }, [isLoggedIn, navigate])

  return (
    <div className="h-screen overflow-hidden flex bg-gradient-to-br from-[#fcfbf9] via-[#f8f7f4] to-[#f4f3ef] relative">

      {/* Left — scrolling city strip */}
      <div className="hidden lg:flex w-5/12 h-screen overflow-hidden bg-gray-950 shrink-0 relative z-10 shadow-2xl">
        <div className="scroll-track w-full flex flex-col gap-3.5 p-4">
          {strip.map((c, i) => (
            <div key={i} className="relative rounded-2xl h-44 shrink-0 overflow-hidden group shadow-md">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-lg tracking-wide">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth box with TravelDoodleBg */}
      <div className="flex-1 h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        <TravelDoodleBg opacity="opacity-[0.05]" />

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-7 sm:p-9 w-full max-w-sm border border-white/80 relative z-10">
          <div className="flex items-center gap-3 mb-2.5">
            {/* Compass badge instead of airplane */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-burgundy-600 to-rose-700 flex items-center justify-center text-white text-xl shadow-md rotate-[-4deg]">
              🧭
            </div>
            <div>
              <span className="text-3xl font-black tracking-tight text-burgundy-800 font-brand">Voyara</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mb-7 font-normal">Plan your perfect trip effortlessly.</p>

          <div className="space-y-3.5">
            <button onClick={() => navigate('/login')}
              className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-3 rounded-2xl transition shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Login
            </button>
            <button onClick={() => navigate('/register')}
              className="w-full border-2 border-burgundy-200 text-burgundy-800 hover:bg-burgundy-50 font-bold py-3 rounded-2xl transition hover:scale-[1.02] active:scale-[0.98]">
              Register
            </button>
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <button onClick={() => setGoogleOpen(true)}
              className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-2xl transition text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:border-slate-300">
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      <GoogleAuthModal isOpen={googleOpen} onClose={() => setGoogleOpen(false)} />
    </div>
  )
}