import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
    deleteRubric,
    fetchAllRubrics,
    type Rubric,
} from "../api/rubrics";

interface RubricDB extends Rubric {
    id: string;
}

export default function RubricsPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [rubrics, setRubrics] = useState<RubricDB[]>([]);

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this rubric?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteRubric(id);
            setRubrics((prev) => prev.filter((r) => r.id !== id));
        } catch (error: unknown) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchAllRubrics().then(setRubrics).catch(() => {
                alert("Failed to fetch rubrics");
            });
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">My Rubrics</h1>
                    <Link
                        to="/rubrics/new"
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                        + New Rubric
                    </Link>
                </div>

                {rubrics.length === 0 ? (
                    <p className="text-gray-500">No rubrics yet. Create one to get started.</p>
                ) : (
                    <div className="space-y-4">
                        {rubrics.map((r, i) => (
                            <div
                                key={r.id || i}
                                className="border rounded p-4 hover:shadow transition"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="font-semibold text-lg">
                                        Q{r.questionNum}: {r.sharedName || "Untitled Rubric"}
                                    </div>
                                    <div className="space-x-2 text-sm">
                                        <Link
                                            to={`/rubrics/${r.id}/edit`}
                                            className="text-blue-600 underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="text-red-600 underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <ul className="list-disc ml-5 text-sm text-gray-700">
                                    {r.criteria.map((c: { label: string, weight: number }, j: number) => (
                                        <li key={j}>
                                            {c.label} ({c.weight} pt{c.weight !== 1 ? "s" : ""})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
