import { useState, useEffect } from 'react';
import { createRubric, updateRubric } from '../api/rubrics';
import { useNavigate } from 'react-router-dom';

interface Criterion {
    label: string;
    weight: number;
}

interface Props {
    initialRubric?: {
        id?: string;
        questionNum: number;
        sharedName?: string;
        criteria: Criterion[];
    };
}

export default function RubricForm({ initialRubric }: Props) {
    const navigate = useNavigate();
    const isEdit = !!initialRubric?.id;

    const [rubric, setRubric] = useState(
        initialRubric || {
            questionNum: 1,
            sharedName: '',
            criteria: [{ label: '', weight: 1 }],
        }
    );

    useEffect(() => {
        if (initialRubric) {
            setRubric(initialRubric);
        }
    }, [initialRubric]);

    const handleAddCriterion = () => {
        setRubric((prev) => ({
            ...prev,
            criteria: [...prev.criteria, { label: '', weight: 1 }],
        }));
    };

    const handleSubmit = async () => {
        if (isEdit && rubric.id) {
            await updateRubric(rubric.id, rubric);
        } else {
            await createRubric(rubric);
        }
        navigate('/rubrics');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">{isEdit ? 'Edit Rubric' : 'Create a New Rubric'}</h1>
            <input
                className="border p-2 mb-3 w-full"
                placeholder="Shared Name (optional)"
                value={rubric.sharedName}
                onChange={(e) => setRubric({ ...rubric, sharedName: e.target.value })}
            />
            <input
                className="border p-2 mb-3 w-full"
                type="number"
                placeholder="Question Number"
                value={rubric.questionNum}
                onChange={(e) =>
                    setRubric({ ...rubric, questionNum: parseInt(e.target.value) || 1 })
                }
            />
            {rubric.criteria.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                        className="border p-2 flex-1"
                        placeholder="Criterion"
                        value={c.label}
                        onChange={(e) => {
                            const updated = [...rubric.criteria];
                            updated[i].label = e.target.value;
                            setRubric({ ...rubric, criteria: updated });
                        }}
                    />
                    <input
                        className="border p-2 w-20"
                        type="number"
                        value={c.weight}
                        onChange={(e) => {
                            const updated = [...rubric.criteria];
                            updated[i].weight = parseInt(e.target.value) || 1;
                            setRubric({ ...rubric, criteria: updated });
                        }}
                    />
                </div>
            ))}
            <button type="button" onClick={handleAddCriterion} className="text-sm text-blue-600 mb-4">
                + Add Criterion
            </button>

            <div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {isEdit ? 'Update Rubric' : 'Save Rubric'}
                </button>
            </div>
        </div>
    );
}
