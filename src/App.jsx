import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import PatientDashboard from "@/pages/PatientDashboard"
import RecordDetectPage from "@/pages/RecordDetectPage"
import TherapyExercisePage from "@/pages/TherapyExercisePage"
import PatientReportPage from "@/pages/PatientReportPage"
import TherapistDashboard from "@/pages/TherapistDashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/record" element={<RecordDetectPage />} />
        <Route path="/patient/therapy" element={<TherapyExercisePage />} />
        <Route path="/patient/report" element={<PatientReportPage />} />

        {/* Therapist routes */}
        <Route path="/therapist/dashboard" element={<TherapistDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
