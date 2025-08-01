import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import RubricsPage from "./pages/RubricsPage";
import RubricCreatePage from "./pages/RubricCreatePage";
import RubricEditPage from "./pages/RubricEditPage";
import TestUploadPage from "./pages/TestUploadPage";
import ReviewTestPage from "./pages/ReviewTestPage";
import StudentsPage from "./pages/StudentsPage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* Authenticated Routes */}
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/rubrics/:id/edit" element={<RubricEditPage />} />
                <Route path="/rubrics/new" element={<RubricCreatePage />} />
                <Route path="/rubrics" element={<RubricsPage />} />
                <Route path="/tests/upload" element={<TestUploadPage />} />
                <Route path="/tests/review" element={<ReviewTestPage />} />
                <Route path="/students" element={<StudentsPage />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
}
