// src/api/conductores.js

import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8005"; 

const conductoresApi = axios.create({
    baseURL: `${URL}/api/conductores/`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
conductoresApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllConductores = () => conductoresApi.get("/");
export const getConductor = (id) => conductoresApi.get(`/${id}/`);
export const createConductor = (conductor) => conductoresApi.post("/", conductor);
export const updateConductor = (id, conductor) =>
    conductoresApi.put(`/${id}/`, conductor);
export const deleteConductor = (id) => conductoresApi.delete(`/${id}/`);
