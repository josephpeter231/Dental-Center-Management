import { useState } from 'react'

const PatientManagement = ({ patients, onAddPatient, onUpdatePatient }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    healthInfo: ''
  })

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingPatient) {
      onUpdatePatient(editingPatient.id, formData)
    } else {
      onAddPatient(formData)
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      contact: '',
      email: '',
      healthInfo: ''
    })
    setShowForm(false)
    setEditingPatient(null)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      email: patient.email || '',
      healthInfo: patient.healthInfo
    })
    setShowForm(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
        >
          Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients by name, email, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl mobile-modal max-w-md w-full max-h-screen overflow-y-auto">
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="px-4 py-3 sm:px-6 sm:py-4 space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="healthInfo" className="block text-sm font-medium text-gray-700">
                  Health Information
                </label>
                <textarea
                  id="healthInfo"
                  name="healthInfo"
                  rows={3}
                  value={formData.healthInfo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Allergies, medical conditions, etc."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-4 px-4 sm:-mx-6 sm:px-6 -mb-3 pb-3 sm:-mb-4 sm:pb-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {editingPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patients List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
          <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
            Patients ({filteredPatients.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredPatients.length === 0 ? (
            <li className="px-3 py-4 sm:px-4">
              <p className="text-sm text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
              </p>
            </li>
          ) : (
            filteredPatients.map((patient) => (
              <li key={patient.id} className="px-3 py-4 sm:px-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {patient.name}
                      </h4>
                      <button
                        onClick={() => handleEdit(patient)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-center"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="mt-1 grid grid-cols-1 gap-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        DOB: {formatDate(patient.dob)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Contact: {patient.contact}
                      </p>
                      {patient.email && (
                        <p className="text-xs sm:text-sm text-gray-600 break-all">
                          Email: {patient.email}
                        </p>
                      )}
                    </div>
                    {patient.healthInfo && (
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Health: {patient.healthInfo}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default PatientManagement
