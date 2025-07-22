import api from "./axiosInstance";

const BASE_URL = '/students';

export async function fetchStudents() {
    return api.get(BASE_URL).then((res) => res.data);
}

export async function createStudent(name: string) {
    return api.post(BASE_URL, { name }).then((res) => res.data);
}

export async function updateStudent(id: string, name: string) {
    return api.patch(`${BASE_URL}/${id}`, { name }).then((res) => res.data);
}

export async function deleteStudent(id: string) {
    return api.delete(`${BASE_URL}/${id}`).then((res) => res.data);
}