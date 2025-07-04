import { useMemo } from 'react'

const Dashboard = ({ patients, incidents, onTabChange }) => {
  const stats = useMemo(() => {
    const totalPatients = patients.length
    const totalIncidents = incidents.length
    const completedIncidents = incidents.filter(i => i.status === 'Completed').length
    const scheduledIncidents = incidents.filter(i => i.status === 'Scheduled').length
    const totalRevenue = incidents.reduce((sum, i) => sum + (i.cost || 0), 0)
    
    return {
      totalPatients,
      totalIncidents,
      completedIncidents,
      scheduledIncidents,
      totalRevenue
    }
  }, [patients, incidents])

  const recentIncidents = useMemo(() => {
    return incidents
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
      .slice(0, 5)
  }, [incidents])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div 
          className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onTabChange('patients')}
        >
          <div className="p-3 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">👥</span>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Patients
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.totalPatients}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onTabChange('incidents')}
        >
          <div className="p-3 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">📅</span>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Appointments
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.totalIncidents}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-3 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✅</span>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {stats.completedIncidents}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-3 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">💰</span>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    ${stats.totalRevenue}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() => onTabChange('patients')}
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">👤</span>
            Add New Patient
          </button>
          <button
            onClick={() => onTabChange('incidents')}
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">📅</span>
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Appointments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentIncidents.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-gray-500">
              No appointments found
            </div>
          ) : (
            recentIncidents.map((incident) => {
              const patient = patients.find(p => p.id === incident.patientId)
              return (
                <div key={incident.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {incident.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)} flex-shrink-0`}>
                          {incident.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-gray-600">
                        Patient: {patient?.name || 'Unknown'}
                      </p>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(incident.appointmentDate)}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ${incident.cost}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {recentIncidents.length > 0 && (
          <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => onTabChange('incidents')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all appointments →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
