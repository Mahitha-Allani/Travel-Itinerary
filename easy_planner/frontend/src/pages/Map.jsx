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
  const dynamicMarker = useRef(null)
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Helper to add a popup for any city
  const showCityPopup = (lat, lng, cityName, displayName) => {
    const L = window.L
    if (!L) return

    if (dynamicMarker.current) {
      dynamicMarker.current.remove()
    }

    dynamicMarker.current = L.marker([lat, lng]).addTo(mapInstance.current)
    dynamicMarker.current.bindPopup(`
      <div style="text-align:center; min-width:160px">
        <div style="width:100%; height:100px; background:#e5e7eb; border-radius:8px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <span style="font-size:24px">📍</span>
        </div>
        <p style="font-weight:700; color:#8b3434; font-size:15px; margin-bottom:4px; font-family:'Playfair Display', serif;">${cityName}</p>
        <p style="color:#6b7280; font-size:11px; margin-bottom:12px; line-height:1.4;">${displayName || cityName + ', India'}</p>
        <a href="/planner?dest=${encodeURIComponent(cityName)}" style="background:#8b3434; color:white; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-block;">
          Plan a trip →
        </a>
      </div>
    `).openPopup()

    mapInstance.current.setView([lat, lng], 10)
  }

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

      // Add click listener for reverse geocoding
      mapInstance.current.on('click', async (e) => {
        const { lat, lng } = e.latlng
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`)
          const data = await res.json()
          
          if (data && data.address) {
            const cityName = data.address.city || data.address.town || data.address.state_district || data.address.state || 'Unknown Location'
            if (data.address.country === 'India') {
              showCityPopup(lat, lng, cityName, data.display_name)
            } else {
              alert("Voyara currently only supports locations within India.")
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err)
        }
      })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)},India&limit=1`)
      const data = await res.json()
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const cityName = data[0].name || searchQuery
        showCityPopup(lat, lon, cityName, display_name)
      } else {
        alert("City not found in India. Please try another name.")
      }
    } catch (err) {
      console.error(err)
      alert("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <section className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-burgundy-600 mb-1">Explore All of India 🗺️</h2>
              <p className="text-gray-500 text-sm">Search for any city or click anywhere on the map to plan a trip.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search any Indian city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 rounded-xl border border-creme-200 focus:outline-none focus:border-burgundy-400 bg-white"
              />
              <button type="submit" disabled={loading} className="bg-burgundy-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-burgundy-700 transition disabled:opacity-50">
                {loading ? '...' : 'Search'}
              </button>
            </form>
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
                  setSearchQuery(city.name)
                  showCityPopup(city.lat, city.lng, city.name, `${city.name}, India`)
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