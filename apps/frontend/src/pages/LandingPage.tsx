import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to AssessMate</h1>
            <p className="text-lg mb-6 text-gray-700">AI-assisted grading for teachers, built with care.</p>
            <div className="space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded shadow">Login</Link>
                <Link to="/signup" className="bg-gray-700 text-white px-4 py-2 rounded shadow">Sign Up</Link>
            </div>
        </div>
    );
}