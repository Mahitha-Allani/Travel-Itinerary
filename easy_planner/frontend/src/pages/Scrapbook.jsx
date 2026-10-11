import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'
import api from '../api/axios.js'

export default function Scrapbook() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips')
      .then(res => {
        // Filter only completed trips that have some scrapbook data (photos or journal)
        const completedWithMemories = res.data.filter(t => 
          t.status === 'completed' && 
          (t.scrapbookPhotos?.length > 0 || t.journalNotes)
        )
        setTrips(completedWithMemories)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fcfbf9] via-[#f8f7f4] to-[#f4f3ef] relative overflow-hidden">
      <Navbar />
      <TravelDoodleBg opacity="opacity-[0.05]" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/70 text-burgundy-900 text-xs font-semibold mb-3.5 shadow-xs">
            <span>📸</span> <span>Memory Keepsake & Travel Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">Travel Albums</h1>
          <p className="text-slate-600 font-normal text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your personal collection of travel memories. Look back at the places you've been, the moments you've captured, and the stories you've written.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 sm:p-14 text-center border border-white/80 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
            {/* Playful Scrapbook Polaroid Showcase */}
            <div className="flex justify-center items-center gap-3 sm:gap-6 mb-8 pt-4">
              {/* Polaroid 1 */}
              <div className="w-24 sm:w-32 bg-white p-2.5 pb-6 rounded-xl shadow-lg border border-gray-100 rotate-[-8deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-amber-200/80 backdrop-blur-xs rounded-xs shadow-xs" />
                <div className="aspect-square bg-gradient-to-tr from-amber-100 to-rose-100 rounded-lg flex items-center justify-center text-2xl sm:text-3xl">
                  🌴
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center mt-2">Sunny Days</p>
              </div>

              {/* Polaroid 2 */}
              <div className="w-28 sm:w-36 bg-white p-2.5 pb-6 rounded-xl shadow-xl border border-gray-100 rotate-[2deg] hover:rotate-0 transition-transform duration-300 relative z-10 group">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-rose-300/80 backdrop-blur-xs rounded-xs shadow-xs" />
                <div className="aspect-square bg-gradient-to-tr from-rose-100 via-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl sm:text-4xl">
                  ⛰️
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center mt-2">Mountain Air</p>
              </div>

              {/* Polaroid 3 */}
              <div className="w-24 sm:w-32 bg-white p-2.5 pb-6 rounded-xl shadow-lg border border-gray-100 rotate-[8deg] hover:rotate-0 transition-transform duration-300 relative group">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-emerald-200/80 backdrop-blur-xs rounded-xs shadow-xs" />
                <div className="aspect-square bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-2xl sm:text-3xl">
                  📸
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center mt-2">Unforgettable</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">No albums created yet!</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Once you finish a trip, you can add photos, write journal entries, and preserve your travel adventures in your personal scrapbook.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/itinerary" className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-3.5 px-8 rounded-2xl transition shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                View Your Itineraries →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {trips.map(trip => (
              <div key={trip._id} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-linear-to-r from-pink-500 to-burgundy-600 px-8 py-6 flex justify-between items-center text-white">
                  <div>
                    <h2 className="text-2xl font-bold">{trip.destination} Album</h2>
                    <p className="text-pink-100 text-sm mt-1">
                      {new Date(trip.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Link to={`/trip/${trip._id}`} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold transition">
                    Edit Album
                  </Link>
                </div>
                
                <div className="p-8">
                  {/* Journal */}
                  {trip.journalNotes && (
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Journal</h3>
                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100/50 shadow-inner">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium italic">
                          "{trip.journalNotes}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  {trip.scrapbookPhotos?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trip.scrapbookPhotos.map((photo, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                            <img src={photo} alt={`Memory ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
