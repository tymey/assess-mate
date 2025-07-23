import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Your Dashboard</h1>
            </div>

            <div className="grid gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <div className="flex justify-between items-center mb-2">
                        <span>📄 Recent Tests</span>
                        <Link to="/tests/upload" className="text-blue-600 underline text-sm">
                            + Upload Test
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600">
                        View and manage recent student test submissions.
                    </p>
                </div>

                <div className="p-4 bg-white shadow rounded">
                    <div className="flex justify-between items-center mb-2">
                        <span>📝 Rubrics</span>
                        <Link to="/rubrics/new" className="text-blue-600 underline text-sm">
                            + Create New Rubric
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600">
                        Manage your grading rubrics.
                    </p>
                </div>

                <div className="p-4 bg-white shadow rounded">
                    <div className="flex justify-between items-center mb-2">
                        <span>👥 Students</span>
                        <Link to="/students" className="text-blue-600 underline text-sm">
                            + Manage Students
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600">
                        Add, view, and manage your students.
                    </p>
                </div>

                <div className="p-4 bg-white shadow rounded">
                    <span>📊 Feedback Trends</span>
                </div>
            </div>
        </div>
    );
}
