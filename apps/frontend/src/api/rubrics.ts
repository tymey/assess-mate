import axios from "axios";

const BASE_URL = '/api/rubrics';

interface Rubric {
    questionNum: number;
    sharedName?: string;
    criteria: { label: string; weight: number }[];
}

export async function fetchAllRubrics(token: string) {
    return axios.get(BASE_URL, { headers: { 'Authorization': `Bearer ${token}` } });
}

export async function createRubric(token: string, rubric: Rubric) {
    return axios.post(BASE_URL, rubric, { headers: { 'Authorization': `Bearer ${token}` } })
}