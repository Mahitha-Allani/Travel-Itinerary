import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const cities = [
  { name: 'Mumbai',    lat: 19.0760, lng: 72.8777, desc: 'Gateway of India, Marine Drive', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=200&q=80' },
  { name: 'Delhi',     lat: 28.6139, lng: 77.2090, desc: 'Red Fort, India Gate, Qutub Minar', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&q=80' },
  { name: 'Jaipur',   lat: 26.9124, lng: 75.7873, desc: 'Amber Fort, Hawa Mahal, City Palace', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80' },
  { name: 'Agra',     lat: 27.1767, lng: 78.0081, desc: 'Taj Mahal, Agra Fort', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&q=80' },
  { name: 'Goa',      lat: 15.2993, lng: 74.1240, desc: 'Baga Beach, Fort Aguada', img: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=200&q=80' },
  { name: 'Kerala',   lat:  9.9312, lng: 76.2673, desc: 'Backwaters, Munnar', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200&q=80' },
  { name: 'Kolkata',  lat: 22.5726, lng: 88.3639, desc: 'Victoria Memorial, Howrah Bridge', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Hyderabad',lat: 17.3850, lng: 78.4867, desc: 'Charminar, Golconda Fort', img: 'https://images.unsplash.com/photo-1626015365107-39d78616aed5?w=200&q=80' },
  { name: 'Bangalore',lat: 12.9716, lng: 77.5946, desc: 'Bangalore Palace, Lalbagh', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666c6c?w=200&q=80' },
  { name: 'Chennai',  lat: 13.0827, lng: 80.2707, desc: 'Marina Beach, Fort St. George', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=200&q=80' },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723, desc: 'Golden Temple, Wagah Border', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=200&q=80' },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739, desc: 'Ghats, Kashi Vishwanath Temple', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=200&q=80' },
  { name: 'Udaipur',  lat: 24.5854, lng: 73.7125, desc: 'City Palace, Lake Pichola', img: 'https://images.unsplash.com/photo-1615861111624-9b55239a5124?w=200&q=80' },
  { name: 'Shimla',   lat: 31.1048, lng: 77.1734, desc: 'The Ridge, Mall Road', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200&q=80' },
  { name: 'Darjeeling', lat: 27.0360, lng: 88.2627, desc: 'Tiger Hill, Toy Train', img: 'https://images.unsplash.com/photo-1544634076-a90160ddf44e?w=200&q=80' },
  { name: 'Kochi',    lat: 9.9312,  lng: 76.2673, desc: 'Fort Kochi, Chinese Fishing Nets', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200&q=80' },
  { name: 'Mysore',   lat: 12.2958, lng: 76.6394, desc: 'Mysore Palace, Chamundi Hill', img: 'https://images.unsplash.com/photo-1600100397608-f010f419b9b1?w=200&q=80' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, desc: 'Rock Garden, Sukhna Lake', img: 'https://images.unsplash.com/photo-1590766940554-638c4d29e4b6?w=200&q=80' },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, desc: 'Kamakhya Temple, Umananda Island', img: 'https://images.unsplash.com/photo-1590050752117-238cb00199fb?w=200&q=80' },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, desc: 'Lingaraja Temple, Udayagiri', img: 'https://images.unsplash.com/photo-1598444738734-7bf280521e42?w=200&q=80' },
  { name: 'Trivandrum', lat: 8.5241, lng: 76.9366, desc: 'Padmanabhaswamy Temple, Napier Museum', img: 'https://images.unsplash.com/photo-1610443725514-046cbdb051fb?w=200&q=80' },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, desc: 'Meenakshi Temple, Thirumalai Nayakkar', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=200&q=80' },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, desc: 'Mehrangarh Fort, Umaid Bhawan', img: 'https://images.unsplash.com/photo-1599059588523-28db30f30560?w=200&q=80' },
  { name: 'Pondicherry', lat: 11.9416, lng: 79.8083, desc: 'Promenade Beach, Auroville', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=200&q=80' },
  { name: 'Leh', lat: 34.1526, lng: 77.5771, desc: 'Pangong Lake, Nubra Valley', img: 'https://images.unsplash.com/photo-1580210741270-22c608f6d659?w=200&q=80' },
  { name: 'Manali', lat: 32.2396, lng: 77.1887, desc: 'Rohtang Pass, Solang Valley', img: 'https://images.unsplash.com/photo-1580210741270-22c608f6d659?w=200&q=80' },
  { name: 'Rishikesh', lat: 30.0869, lng: 78.2676, desc: 'Laxman Jhula, Triveni Ghat', img: 'https://images.unsplash.com/photo-1590766940554-638c4d29e4b6?w=200&q=80' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, desc: 'Shaniwar Wada, Sinhagad Fort', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, desc: 'Sabarmati Ashram, Akshardham', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Surat', lat: 21.1702, lng: 72.8311, desc: 'Dutch Cemetery, Surat Castle', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, desc: 'Kanpur Zoo, Massacre Ghat', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, desc: 'Bara Imambara, Rumi Darwaza', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, desc: 'Ramtek Temple, Ambazari Lake', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, desc: 'Patna Museum, Golghar', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, desc: 'Sarafa Bazaar, Rajwada', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, desc: 'Lakshmi Vilas Palace, Sayaji Garden', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, desc: 'Upper Lake, Bhimbetka Caves', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
  { name: 'Ludhiana', lat: 30.901, lng: 75.8573, desc: 'Planetarium, Nehru Rose Garden', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=200&q=80' },
]

export default function Map() {
  const mapRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = window.L

      if (mapRef.current._leaflet_id) return // already initialized

      const map = L.map(mapRef.current).setView([22, 80], 5)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      cities.forEach(city => {
        const marker = L.marker([city.lat, city.lng]).addTo(map)
        marker.bindPopup(`
          <div style="text-align:center; min-width:160px">
            <img src="${city.img}" alt="${city.name}" style="width:100%; height:100px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />
            <p style="font-weight:700; color:#8b3434; font-size:15px; margin-bottom:4px; font-family:'Playfair Display', serif;">${city.name}</p>
            <p style="color:#6b7280; font-size:12px; margin-bottom:12px; line-height:1.4;">${city.desc}</p>
            <a href="/planner?dest=${city.name}" style="background:#8b3434; color:white; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-block;">
              Plan a trip →
            </a>
          </div>
        `)
      })
    }
    document.head.appendChild(script)

    return () => {
      if (mapRef.current && mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <section className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-burgundy-600 mb-1">Explore India 🗺️</h2>
            <p className="text-gray-500 text-sm">Click any marker to see top attractions.</p>
          </div>

          <div
            ref={mapRef}
            className="rounded-2xl overflow-hidden shadow-lg border border-creme-200"
            style={{ height: '520px', width: '100%' }}
          />

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cities.map(city => (
              <button key={city.name} onClick={() => navigate(`/planner?dest=${city.name}`)}
                className="bg-white rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 border border-creme-200 hover:border-burgundy-400 hover:text-burgundy-600 transition text-left shadow-sm">
                📍 {city.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}