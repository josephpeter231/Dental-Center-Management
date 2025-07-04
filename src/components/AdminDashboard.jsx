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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">DC</span>
              </div>
              <h1 className="ml-2 sm:ml-3 text-sm sm:text-xl font-semibold text-gray-900 truncate">
                Dental Center
                <span className="hidden sm:inline"> Management</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">
                Welcome, <span className="font-medium">{user.email}</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin
              </span>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <nav className="w-full sm:w-64 bg-white shadow-sm border-b sm:border-b-0 sm:border-r min-h-0 sm:min-h-screen">
          <div className="p-2 sm:p-4">
            <ul className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 overflow-x-auto sm:overflow-x-visible">
              {navItems.map((item) => (
                <li key={item.id} className="flex-shrink-0 sm:flex-shrink">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-left rounded-md transition-colors whitespace-nowrap text-xs sm:text-sm ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-0 sm:border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-1 sm:mr-3 text-sm sm:text-lg">{item.icon}</span>
                    <span className="hidden xs:inline">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6">
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
