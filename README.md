# Dental Center Management Dashboard

A modern, responsive web application for managing dental center operations, built with React, Vite, and Tailwind CSS. This frontend-only application uses localStorage for data persistence and provides separate interfaces for administrators (dentists) and patients.

## Features

### Admin Dashboard (Dentist)
- **Patient Management**: Add, edit, and view patient records
- **Appointment Management**: Schedule, edit, and track dental appointments
- **File Upload**: Attach treatment files and documents to appointments
- **Dashboard Overview**: View statistics and recent appointments
- **Search & Filter**: Find patients and appointments quickly

### Patient Dashboard
- **Personal Information**: View personal details and health information
- **Appointment History**: Track all dental appointments and treatments
- **Treatment Records**: View attached files and documents
- **Appointment Summary**: See statistics and costs


## Tech Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 4.1.11
- **State Management**: React hooks 
- **Data Storage**: Browser localStorage

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Dental Center Management"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

##  Demo Credentials

### Admin Access (Dentist)
- **Email**: `admin@entnt.in`
- **Password**: `admin123`

### Patient Access
- **Email**: `john@entnt.in`
- **Password**: `patient123`




##  Data Structure

### Users
```javascript
{
  id: "1",
  role: "Admin" | "Patient",
  email: "admin@entnt.in",
  password: "admin123",
  patientId: "p1" 
}
```

### Patients
```javascript
{
  id: "p1",
  name: "John Doe",
  dob: "1990-05-10",
  contact: "1234567890",
  email: "john@entnt.in",
  healthInfo: "No allergies"
}
```

### Appointments (Incidents)
```javascript
{
  id: "i1",
  patientId: "p1",
  title: "Toothache",
  description: "Upper molar pain",
  comments: "Sensitive to cold",
  appointmentDate: "2025-07-01T10:00:00",
  cost: 80,
  status: "Completed" | "Scheduled" | "Cancelled",
  files: [
    { name: "invoice.pdf", url: "base64string-or-blob-url" }
  ]
}
```

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### File Upload System
- Multiple file selection support
- Base64 encoding for localStorage compatibility
- File preview and management interface
- Support for various file types (PDF, images, etc.)

### Search and Filtering
- Real-time search across patients and appointments
- Status-based filtering for appointments
- Case-insensitive search functionality
- Responsive search interface
