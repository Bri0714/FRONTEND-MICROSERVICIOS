// src/api/get_away.js

import axios from "axios";
import { updateVehiculo } from "./vehiculos";
import { updateConductor } from "./conductores";
import { updateRuta } from "./rutas.api";

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

// Nueva función para obtener la información completa de una ruta, vehículo y conductor
export const getRutaWithVehiculoConductor = (rutaId) => gatewayApi.get(`/rutas/${rutaId}/`);

// Nueva función para obtener la información de un vehículo y sus documentos legales
export const getVehiculoDetalles = (vehiculoId) =>
    gatewayApi.get(`/vehiculos/${vehiculoId}/`);

// Reutilizamos las funciones de update importadas de otros módulos
export { updateRuta, updateVehiculo, updateConductor };

