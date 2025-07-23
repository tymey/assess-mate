// src/pages/TestUploadPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Assessment {
    id: string;
    studentId: string;
    pdfUrl: string;
}

interface Student {
    id: string;
    userId: string;
    name: string;
}

interface OcrResults {
    questionNum: number;
    text: string;
    boxedAnswer: string;
}

export default function TestUploadPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [ocrResults, setOcrResults] = useState<OcrResults[] | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            axios
                .get("/api/students", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setStudents(res.data);
                    if (res.data.length > 0) setStudentId(res.data[0].id);
                });
        }
    }, [token, navigate]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("studentId", studentId);

        try {
            const upload: { data: { assessment: Assessment, message: string } } = await axios.post("/api/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const res = await axios.post("/api/ocr", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/tests/review", {
                state: { questions: res.data.questions, assessmentId: upload.data.assessment.id},
            });
            setOcrResults(res.data.questions); // Assume backend returns { questions: [...] }
        } catch (err) {
            alert("OCR failed");
            console.error(err);
        }
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
                    Run OCR
                </button>
            </form>

            {ocrResults && (
                <div className="max-w-2xl mx-auto mt-6 bg-white shadow p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">OCR Results</h2>
                    {ocrResults.map((q, i) => (
                        <div key={i} className="mb-4 border-b pb-2">
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Q{q.questionNum}:</strong>
                            </p>
                            <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
                                {q.text}
                            </pre>
                            <p className="text-sm mt-1 text-blue-800">
                                <strong>Boxed Answer:</strong> {q.boxedAnswer || "N/A"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
