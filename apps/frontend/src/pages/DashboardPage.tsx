import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const handleLogout = () => {
        setToken(null);
        navigate("/");
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Your Dashboard</h1>
                <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
                    Logout
                </button>
            </div>

            <div className="grid gap-4">
                <div className="p-4 bg-white shadow rounded">📄 Recent Tests</div>
                <div className="p-4 bg-white shadow rounded">📝 Rubrics</div>
                <div className="p-4 bg-white shadow rounded">📊 Feedback Trends</div>
            </div>
        </div>
    );
}