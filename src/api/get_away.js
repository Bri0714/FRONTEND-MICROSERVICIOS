// src/api/get_away.js

import axios from "axios";

const URL = process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_GATEWAY_URL
    : "http://localhost:8003/api";

const gatewayApi = axios.create({
    baseURL: `${URL}`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
gatewayApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getInstitucionWithRoutes = (institucionId) => gatewayApi.get(`/instituciones/${institucionId}/rutas/`);
// Nueva función para obtener los estudiantes por institución y ruta
export const getEstudiantesByInstitucionYRuta = (institucionId, rutaId) =>
    gatewayApi.get(`/instituciones/${institucionId}/rutas/${rutaId}/estudiantes/`);
