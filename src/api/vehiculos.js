// src/api/vehiculos.js

import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8006"; // Asegúrate de que este puerto coincide con tu servicio de vehículos

const vehiculosApi = axios.create({
    baseURL: `${URL}/api/vehiculos/`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
vehiculosApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllVehiculos = () => vehiculosApi.get("/");
export const getVehiculo = (id) => vehiculosApi.get(`/${id}/`);
export const createVehiculo = (vehiculo) => vehiculosApi.post("/", vehiculo);
export const updateVehiculo = (id, vehiculo) =>
    vehiculosApi.put(`/${id}/`, vehiculo);
export const deleteVehiculo = (id) => vehiculosApi.delete(`/${id}/`);
