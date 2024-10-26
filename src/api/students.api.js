import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8004";

const studentsApi = axios.create({
  baseURL: `${URL}/api/estudiantes`,
});

export const getAllStudents = () => studentsApi.get("/");
export const getStudent = (id) => studentsApi.get(`/${id}`);
export const createStudent = (student) => studentsApi.post("/", student);
export const updateStudent = (id, student) => studentsApi.put(`/${id}/`, student);
export const deleteStudent = (id) => studentsApi.delete(`/${id}`);