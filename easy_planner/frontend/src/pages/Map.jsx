import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Keeping a few major cities for quick links
const topCities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Kerala', lat:  9.9312, lng: 76.2673 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad',lat: 17.3850, lng: 78.4867 }
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
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <section className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-burgundy-600 mb-1">Explore All of India 🗺️</h2>
              <p className="text-gray-500 text-sm">Select any of the main cities below or from the map to plan a trip.</p>
            </div>
          </div>

          <div
            ref={mapRef}
            className="rounded-2xl shadow-lg border border-creme-200 z-0 relative"
            style={{ height: '520px', width: '100%' }}
          />

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Popular Destinations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topCities.map(city => (
                <button key={city.name} onClick={() => {
                  mapInstance.current?.setView([city.lat, city.lng], 10)
                }}
                  className="bg-white rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 border border-creme-200 hover:border-burgundy-400 hover:text-burgundy-600 transition text-left shadow-sm">
                  📍 {city.name}
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