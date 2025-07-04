// Mock data initialization and authentication utilities
const STORAGE_KEYS = {
  USERS: 'dental_users',
  PATIENTS: 'dental_patients',
  INCIDENTS: 'dental_incidents',
  CURRENT_USER: 'dental_current_user'
}

const mockData = {
  users: [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No allergies",
      email: "john@entnt.in"
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-07-01T10:00:00",
      cost: 80,
      status: "Completed",
      files: [
        { name: "invoice.pdf", url: "data:application/pdf;base64,sample-pdf-data" },
        { name: "xray.png", url: "data:image/png;base64,sample-image-data" }
      ]
    }
  ]
}

export const initializeMockData = () => {
  // Initialize data only if not already present
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockData.users))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockData.patients))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(mockData.incidents))
  }
}

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    const userSession = { ...user }
    delete userSession.password // Don't store password in session
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession))
    return userSession
  }
  return null
}

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

// Data access functions
export const getPatients = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]')
}

export const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients))
}

export const getIncidents = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
}

export const saveIncidents = (incidents) => {
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))
}

export const addPatient = (patient) => {
  const patients = getPatients()
  const newPatient = {
    ...patient,
    id: `p${Date.now()}`,
  }
  patients.push(newPatient)
  savePatients(patients)
  return newPatient
}

export const updatePatient = (patientId, updates) => {
  const patients = getPatients()
  const index = patients.findIndex(p => p.id === patientId)
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updates }
    savePatients(patients)
    return patients[index]
  }
  return null
}

export const addIncident = (incident) => {
  const incidents = getIncidents()
  const newIncident = {
    ...incident,
    id: `i${Date.now()}`,
  }
  incidents.push(newIncident)
  saveIncidents(incidents)
  return newIncident
}

export const updateIncident = (incidentId, updates) => {
  const incidents = getIncidents()
  const index = incidents.findIndex(i => i.id === incidentId)
  if (index !== -1) {
    incidents[index] = { ...incidents[index], ...updates }
    saveIncidents(incidents)
    return incidents[index]
  }
  return null
}
