import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'

// Keeping a few major cities for quick links
const topCities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, tag: 'City of Dreams' },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, tag: 'Capital Heritage' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, tag: 'Pink City' },
  { name: 'Agra', lat: 27.1767, lng: 78.0081, tag: 'Taj Mahal' },
  { name: 'Goa', lat: 15.2993, lng: 74.1240, tag: 'Beaches & Vibes' },
  { name: 'Kerala', lat:  9.9312, lng: 76.2673, tag: 'God’s Own Country' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, tag: 'City of Joy' },
  { name: 'Hyderabad',lat: 17.3850, lng: 78.4867, tag: 'City of Pearls' }
]

export default function Map() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else if (window.L) {
      initMap()
    }

    function initMap() {
      const L = window.L
      if (mapInstance.current) return // already initialized

      mapInstance.current = L.map(mapRef.current).setView([22, 80], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current)

      // Add markers for predefined cities
      topCities.forEach(city => {
        const marker = L.marker([city.lat, city.lng]).addTo(mapInstance.current)
        marker.bindPopup(`
          <div style="text-align:center; min-width:160px">
            <p style="font-weight:700; color:#8b3434; font-size:15px; margin-bottom:4px; font-family:'Playfair Display', serif;">${city.name}</p>
            <p style="color:#6b7280; font-size:11px; margin-bottom:12px; line-height:1.4;">${city.name}, India</p>
            <a href="/planner?dest=${encodeURIComponent(city.name)}" style="background:#8b3434; color:white; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-block;">
              Plan a trip →
            </a>
          </div>
        `)
      })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] relative overflow-hidden">
      <Navbar />
      <TravelDoodleBg opacity="opacity-[0.04]" />

      <section className="flex-1 py-10 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-burgundy-900 text-xs font-semibold mb-3 shadow-xs">
                <span>🧭</span> <span>Interactive Geographic Explorer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Explore India 🗺️</h1>
              <p className="text-slate-600 font-normal text-sm sm:text-base mt-1">Click any city pin to view live details, or jump straight to planning your route.</p>
            </div>
          </div>

          {/* Map Frame */}
          <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 relative z-0">
            <div
              ref={mapRef}
              className="rounded-2xl overflow-hidden shadow-inner"
              style={{ height: '520px', width: '100%' }}
            />
          </div>

          {/* Quick-Jump Destinations */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Popular Destinations</h3>
              <span className="text-xs text-slate-500 font-medium">Click to focus on map</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {topCities.map(city => (
                <button key={city.name} onClick={() => {
                  mapInstance.current?.setView([city.lat, city.lng], 10)
                }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-slate-200/70 hover:border-burgundy-500 hover:text-burgundy-700 hover:shadow-md transition-all duration-200 text-left shadow-xs hover:-translate-y-0.5 group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 group-hover:text-burgundy-700 text-sm">📍 {city.name}</span>
                    <span className="text-slate-400 group-hover:text-burgundy-500 text-xs transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{city.tag}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}