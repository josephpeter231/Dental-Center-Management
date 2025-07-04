import { useState, useEffect } from 'react'
import { getPatients, getIncidents } from '../utils/auth'

const PatientDashboard = ({ user, onLogout }) => {
  const [patient, setPatient] = useState(null)
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    const loadPatientData = () => {
      const patients = getPatients()
      const allIncidents = getIncidents()
      
      const currentPatient = patients.find(p => p.id === user.patientId)
      const patientIncidents = allIncidents.filter(i => i.patientId === user.patientId)
      
      setPatient(currentPatient)
      setIncidents(patientIncidents)
    }
    
    loadPatientData()
  }, [user])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
          <p className="mt-2 text-gray-600">Unable to load patient information.</p>
        </div>
      </div>
    )
  }

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
                My Dental Records
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">
                Welcome, <span className="font-medium">{patient.name}</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Patient
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

      <div className="max-w-7xl mx-auto py-2 sm:py-4 lg:py-6 px-2 sm:px-4 lg:px-8">
        <div className="fade-in space-y-4 sm:space-y-6">
          {/* Patient Information Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900">{patient.name}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900">
                    {new Date(patient.dob).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900">{patient.contact}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900 break-all">{patient.email}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Health Information</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-900">{patient.healthInfo}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Summary */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {incidents.length}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600">Total Appointments</div>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {incidents.filter(i => i.status === 'Completed').length}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">Completed</div>
                </div>
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    ${incidents.reduce((sum, i) => sum + (i.cost || 0), 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-600">Total Cost</div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments History */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                Appointment History
              </h3>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">
                Your complete dental appointment history and treatment records.
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {incidents.length === 0 ? (
                <li className="px-3 py-4 sm:px-4">
                  <p className="text-sm text-gray-500">No appointments found.</p>
                </li>
              ) : (
                incidents.map((incident) => (
                  <li key={incident.id} className="px-3 py-4 sm:px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {incident.title}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)} flex-shrink-0`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {incident.description}
                        </p>
                        {incident.comments && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-500 italic">
                            Notes: {incident.comments}
                          </p>
                        )}
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(incident.appointmentDate)}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ${incident.cost}
                          </p>
                        </div>
                        {incident.files && incident.files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {incident.files.map((file, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 break-all"
                                >
                                  📎 {file.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
