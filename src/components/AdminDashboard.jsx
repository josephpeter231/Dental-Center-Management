import { useState, useEffect } from 'react'
import { getPatients, getIncidents, addPatient, addIncident, updatePatient, updateIncident } from '../utils/auth'
import PatientManagement from './PatientManagement'
import IncidentManagement from './IncidentManagement'
import Dashboard from './Dashboard'

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [patients, setPatients] = useState([])
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPatients(getPatients())
    setIncidents(getIncidents())
  }

  const handleAddPatient = (patientData) => {
    const newPatient = addPatient(patientData)
    setPatients(getPatients())
    return newPatient
  }

  const handleUpdatePatient = (patientId, updates) => {
    const updatedPatient = updatePatient(patientId, updates)
    setPatients(getPatients())
    return updatedPatient
  }

  const handleAddIncident = (incidentData) => {
    const newIncident = addIncident(incidentData)
    setIncidents(getIncidents())
    return newIncident
  }

  const handleUpdateIncident = (incidentId, updates) => {
    const updatedIncident = updateIncident(incidentId, updates)
    setIncidents(getIncidents())
    return updatedIncident
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'incidents', label: 'Appointments', icon: '📅' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Dental Center Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user.email}</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin
              </span>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="fade-in">
            {activeTab === 'dashboard' && (
              <Dashboard 
                patients={patients} 
                incidents={incidents} 
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'patients' && (
              <PatientManagement
                patients={patients}
                onAddPatient={handleAddPatient}
                onUpdatePatient={handleUpdatePatient}
              />
            )}
            {activeTab === 'incidents' && (
              <IncidentManagement
                incidents={incidents}
                patients={patients}
                onAddIncident={handleAddIncident}
                onUpdateIncident={handleUpdateIncident}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
