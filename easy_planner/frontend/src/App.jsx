import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Landing   from './pages/Landing.jsx'
import Login     from './pages/Login.jsx'
import Register  from './pages/Register.jsx'
import Home      from './pages/Home.jsx'
import Planner   from './pages/Planner.jsx'
import Itinerary from './pages/Itinerary.jsx'
import Profile   from './pages/Profile.jsx'
import Map        from './pages/Map.jsx'
import TripDetail from './pages/TripDetail.jsx'
import Chatbot    from './components/Chatbot.jsx'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/home"      element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/planner"   element={<PrivateRoute><Planner /></PrivateRoute>} />
        <Route path="/itinerary" element={<PrivateRoute><Itinerary /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
        <Route path="/map"        element={<PrivateRoute><Map /></PrivateRoute>} />
        <Route path="/trip/:id"   element={<PrivateRoute><TripDetail /></PrivateRoute>} />
      </Routes>
      <Chatbot />
    </AuthProvider>
  )
}
