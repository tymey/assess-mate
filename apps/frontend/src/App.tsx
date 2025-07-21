import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
    return (
      <BrowserRouter>
          <nav className="p-4 flex gap-4 justify-center bg-gray-100">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
      </BrowserRouter>
    );
}
