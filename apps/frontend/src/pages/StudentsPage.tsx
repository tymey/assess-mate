import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchStudents, createStudent } from "../api/students";

interface Student {
    id: string;
    userId: string;
    name: string;
}

export default function StudentsPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [newStudentName, setNewStudentName] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchStudents().then(setStudents);
        }
    }, [token, navigate]);

    const handleAddStudent = async () => {
        if (!newStudentName.trim()) return;

        const student = await createStudent(newStudentName);
        setStudents((prev) => [...prev, student]);
        setNewStudentName("");
    };

    return (
        <div className="min-h-screen p-6 bg-slate-100">
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-semibold mb-4">My Students</h1>

                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="New student name"
                        className="border p-2 flex-1"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                    />
                    <button
                        onClick={handleAddStudent}
                        className="bg-blue-600 text-white px-4 rounded"
                    >
                        Add
                    </button>
                </div>

                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                    {students.map((s) => (
                        <li key={s.id}>{s.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
