import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Student {
    id: string;
    userId: string;
    name: string;
}

export default function TestUploadPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            axios
                .get("/api/students", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setStudents(res.data);
                    if (res.data.length > 0) {
                        setStudentId(res.data[0].id);
                    }
                });
        }
    }, [token, navigate]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("studentId", studentId);

        await axios.post("/api/upload", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        alert("Test uploaded successfully!");
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen p-6 bg-slate-100">
            <form
                onSubmit={handleUpload}
                className="max-w-lg mx-auto bg-white p-6 shadow rounded"
            >
                <h1 className="text-xl font-semibold mb-4">Upload Student Test</h1>

                <label className="block text-sm mb-2">Select Student:</label>
                <select
                    className="border p-2 w-full mb-4"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                >
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <label className="block text-sm mb-2">Upload PDF:</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mb-4"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Upload Test
                </button>
            </form>
        </div>
    );
}
