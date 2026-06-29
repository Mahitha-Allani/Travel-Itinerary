import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
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
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">📸 Travel Albums</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Your personal collection of travel memories. Look back at the places you've been and the moments you've captured.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No albums yet!</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Complete a trip and upload some photos or write journal notes to create your first travel album.
            </p>
            <Link to="/itinerary" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition">
              View Your Itineraries
            </Link>
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
