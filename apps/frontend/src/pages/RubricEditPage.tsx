import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRubricByID, type Rubric } from "../api/rubrics";
import RubricForm from "../components/RubricForm";
import { useAuth } from "../context/AuthContext";

interface RubricDB extends Rubric {
    id: string;
}

export default function RubricEditPage() {
    const { token } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [rubric, setRubric] = useState<RubricDB | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        getRubricByID(id!)
            .then(setRubric)
            .catch(() => {
                alert("Rubric not found or unauthorized.");
                navigate("/rubrics");
            })
            .finally(() => setLoading(false));
    }, [id, token, navigate]);

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="min-h-screen p-6 bg-slate-100">
            {rubric ? (
                <RubricForm initialRubric={rubric} />
            ) : null}
        </div>
    );
}
