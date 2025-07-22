import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../api/students";

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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

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

    const handleStartEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setEditingName(currentName);
    };

    const handleUpdateStudent = async () => {
        if (!editingName.trim() || !editingId) return;
        const updated = await updateStudent(editingId, editingName);
        setStudents((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setEditingId(null);
        setEditingName("");
    };

    const handleDeleteStudent = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        await deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className="min-h-screen p-6 bg-slate-100">
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-semibold mb-4">My Students</h1>

                <div className="mb-6 flex gap-2">
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

                <ul className="space-y-2">
                    {students.map((s) => (
                        <li key={s.id} className="flex items-center justify-between">
                            {editingId === s.id ? (
                                <div className="flex gap-2 w-full">
                                    <input
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="border p-1 flex-1"
                                    />
                                    <button
                                        onClick={handleUpdateStudent}
                                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="text-xs text-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center w-full">
                                    <span>{s.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStartEdit(s.id, s.name)}
                                            className="text-xs text-blue-600 underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(s.id)}
                                            className="text-xs text-red-600 underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
