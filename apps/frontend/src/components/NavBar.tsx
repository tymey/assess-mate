import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        navigate("/");
    }

    if (!token) return null;

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex space-x-4">
                <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>
                <NavLink to="/rubrics" className="hover:underline">Rubrics</NavLink>
                <NavLink to="/students" className="hover:underline">Students</NavLink>
                <NavLink to="/tests/upload" className="hover:underline">Upload Test</NavLink>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
            </div>
        </nav>
    )
}