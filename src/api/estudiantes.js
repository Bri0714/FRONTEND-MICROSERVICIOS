// src/api/rutas.js

import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8004"; // Asegúrate de que este puerto coincide con tu servicio de estudiantes

const estudiantesApi = axios.create({
    baseURL: `${URL}/api/estudiantes/`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
estudiantesApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllEstudiantes = () => estudiantesApi.get("/");
export const getEstudiante = (id) => estudiantesApi.get(`/${id}/`);
export const createEstudiante = (estudiante) => estudiantesApi.post("/", estudiante);
export const updateEstudiante = (id, estudiante) => estudiantesApi.put(`/${id}/`, estudiante);
export const deleteEstudiante = (id) => estudiantesApi.delete(`/${id}/`);
