import { useState } from 'react'

const IncidentManagement = ({ incidents, patients, onAddIncident, onUpdateIncident }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    status: 'Scheduled'
  })

  const filteredIncidents = incidents.filter(incident => {
    const patient = patients.find(p => p.id === incident.patientId)
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            name: file.name,
            url: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(filePromises).then(fileData => {
      setFormData(prev => ({
        ...prev,
        files: [...(prev.files || []), ...fileData]
      }))
    })
  }

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const incidentData = {
      ...formData,
      cost: parseFloat(formData.cost) || 0
    }
    
    if (editingIncident) {
      onUpdateIncident(editingIncident.id, incidentData)
    } else {
      onAddIncident(incidentData)
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      status: 'Scheduled',
      files: []
    })
    setShowForm(false)
    setEditingIncident(null)
  }

  const handleEdit = (incident) => {
    setEditingIncident(incident)
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments || '',
      appointmentDate: incident.appointmentDate.slice(0, 16), // Format for datetime-local
      cost: incident.cost.toString(),
      status: incident.status,
      files: incident.files || []
    })
    setShowForm(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Schedule New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments by title, description, or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingIncident ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient *
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  required
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.contact}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Routine Checkup, Root Canal"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the appointment"
                />
              </div>

              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="appointmentDate"
                  name="appointmentDate"
                  required
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  Comments/Notes
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={2}
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes or comments"
                />
              </div>

              <div>
                <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                  Attach Files
                </label>
                <input
                  type="file"
                  id="files"
                  multiple
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {formData.files && formData.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 mb-2">Attached files:</p>
                    <div className="space-y-1">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">📎 {file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {editingIncident ? 'Update' : 'Schedule'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Appointments ({filteredIncidents.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredIncidents.length === 0 ? (
            <li className="px-4 py-4">
              <p className="text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No appointments found matching your criteria.' 
                  : 'No appointments scheduled yet.'}
              </p>
            </li>
          ) : (
            filteredIncidents.map((incident) => {
              const patient = patients.find(p => p.id === incident.patientId)
              return (
                <li key={incident.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {incident.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                          <button
                            onClick={() => handleEdit(incident)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Patient: {patient?.name || 'Unknown'}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {incident.description}
                      </p>
                      {incident.comments && (
                        <p className="mt-1 text-sm text-gray-500 italic">
                          Notes: {incident.comments}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {formatDate(incident.appointmentDate)}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ${incident.cost}
                        </p>
                      </div>
                      {incident.files && incident.files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {incident.files.map((file, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
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
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}

export default IncidentManagement
