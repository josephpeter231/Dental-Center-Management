import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import AdminDashboard from './components/AdminDashboard'
import PatientDashboard from './components/PatientDashboard'
import { initializeMockData, getCurrentUser, logout } from './utils/auth'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeMockData()
    const user = getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'Admin' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <PatientDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
