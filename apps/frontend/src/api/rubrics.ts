import api from "./axiosInstance";

const BASE_URL = '/rubrics';

export interface Rubric {
    questionNum: number;
    sharedName?: string;
    criteria: { label: string; weight: number }[];
}

export async function fetchAllRubrics() {
    return api.get(BASE_URL).then((res) => res.data);
}

export async function getRubricByID(id: string) {
    return api.get(`${BASE_URL}/${id}`).then((res) => res.data);
}

export async function createRubric(rubric: Rubric) {
    return api.post(BASE_URL, rubric).then((res) => res.data);
}

export async function deleteRubric(id: string) {
    return api.delete(`${BASE_URL}/${id}`).then((res) => res.data);
}

export async function updateRubric(id: string, rubric: Rubric) {
    return api.put(`${BASE_URL}/${id}`, rubric).then((res) => res.data);
}