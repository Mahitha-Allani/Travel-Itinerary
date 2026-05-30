import axios from 'axios'

// Use the live Render deployment for the API
const api = axios.create({ baseURL: 'https://travel-itinerary-401f.onrender.com/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
