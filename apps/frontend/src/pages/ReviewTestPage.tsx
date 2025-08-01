import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

interface Rubric {
    questionNum: number;
    sharedName?: string;
    criteria: {
        label: string,
        weight: number,
    }[];
}

interface Question {
    questionNum: number;
    text: string;
    boxedAnswer: string;
    rubric: Rubric;
    aiScore?: string;
    aiFeedback?: string;
    teacherScore?: string;
    teacherFeedback?: string;
    alignment?: number;
    [key: string]: string | number | Rubric | undefined;
}

export default function ReviewTestPage() {
    const { state } = useLocation();
    const initialQuestions = state?.questions || [];

    const [questions, setQuestions] = useState<Question[]>(() =>
        initialQuestions.map((q: Question) => ({
            ...q,
            aiScore: "",
            aiFeedback: "",
            teacherScore: "",
            teacherFeedback: "",
            alignment: 5,
        }))
    );

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const handleGrade = async (index: number) => {
        const q = questions[index];

        console.log('Q:', q);

        try {
            const res = await axios.post("/api/grade", {
                questionNum: q.questionNum,
                boxedAnswer: q.boxedAnswer,
                text: q.text,
                rubric: q.rubric,
            }, {
                headers: { Authorization: `Bearer ${token}`, }
            });

            const updated = [...questions];
            updated[index].aiScore = res.data.score;
            updated[index].aiFeedback = res.data.feedback;
            setQuestions(updated);
        } catch (err) {
            console.error("Grading failed", err);
        }
    };

    const handleChange = (index: number, field: string, value: string | number) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleSaveSession = async () => {
        try {
            const assessmentId = state?.assessmentId;
            if (!assessmentId) {
                alert("Missing assessment ID");
                return;
            }

            const res = await axios.post("/api/grading-session", {
                assessmentId,
                questions,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Grading session saved!");
            navigate("/dashboard");
            console.log("Saved session ID:", res.data.id);
        } catch (error) {
            console.error("Failed to save session", error);
            alert("Error saving grading session");
        }
    };

    const handleRefineTone = async () => {
        try {
            const res = await axios.post("/api/tone/refine", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Tone refinement complete! AI will use updated feedback tone going forward.");
            console.log("Refined toneContext:", res.data.toneContext);
        } catch (error) {
            console.error("Tone refinement failed:", error);
            alert("Failed to refine tone. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Review Test Results</h1>

            <button
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleRefineTone}
            >
                Refine Tone
            </button>

            {questions.map((q, index: number) => (
                <div key={index} className="bg-white shadow p-4 rounded mb-4">
                    <h2 className="font-semibold mb-2">Question {q.questionNum}</h2>
                    <p className="text-sm mb-1"><strong>Boxed Answer:</strong> {q.boxedAnswer}</p>
                    <p className="text-sm mb-1"><strong>Student Work:</strong> {q.text}</p>
                    <p className="text-sm mb-2"><strong>Rubric:</strong> {typeof q.rubric === "string" ? q.rubric : JSON.stringify(q.rubric)}</p>

                    <button onClick={() => handleGrade(index)} className="text-blue-600 underline text-sm mb-2">
                        Grade with AI
                    </button>

                    {q.aiScore && (
                        <>
                            <div className="text-sm mb-2">
                                <strong>AI Score:</strong> {q.aiScore} <br />
                                <strong>AI Feedback:</strong> {q.aiFeedback}
                            </div>

                            <label className="block text-sm font-medium">Your Score:</label>
                            <input value={q.teacherScore} onChange={(e) => handleChange(index, "teacherScore", e.target.value)} className="border p-1 w-full mb-2" />

                            <label className="block text-sm font-medium">Your Feedback:</label>
                            <textarea value={q.teacherFeedback} onChange={(e) => handleChange(index, "teacherFeedback", e.target.value)} className="border p-1 w-full mb-2" />

                            <label className="block text-sm font-medium">Tone Alignment (1–10):</label>
                            <input type="number" min={1} max={10} value={q.alignment} onChange={(e) => handleChange(index, "alignment", e.target.value)} className="border p-1 w-full mb-2" />
                        </>
                    )}
                </div>
            ))}
            <button
                onClick={handleSaveSession}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save Grading Session
            </button>

        </div>
    );
}
