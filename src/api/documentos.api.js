// src/api/get_away.js
// src/api/rutas.js

import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8008"; // Asegúrate de que este puerto coincide con tu servicio de rutas

const documentosAPI = axios.create({
    baseURL: `${URL}/api/documentos/`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
documentosAPI.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllDocumentos = () => documentosApi.get("/");
export const getDocumento = (queryString) => documentosAPI.get(`${queryString}`);
export const createDocumento = (documento) => documentosAPI.post("/", documento);
export const updateDocumento = (id, documento) => documentosAPI.put(`/${id}/`, documento);
export const deleteDocumento = (id) => documentosAPI.delete(`/${id}/`);
