import api from "./axiosInstance";

const BASE_URL = '/students';

export async function fetchStudents() {
    return api.get(BASE_URL).then((res) => res.data);
}

export async function createStudent(name: string) {
    return api.post(BASE_URL, { name }).then((res) => res.data);
}