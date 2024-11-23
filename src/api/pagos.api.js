// src/api/instituciones.api.js

import axios from "axios";

const URL = process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8009/api";

const pagosApi = axios.create({
    baseURL: `${URL}/pagos`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
pagosApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllPagos = () => pagosApi.get("/");
export const getPago = (id) => pagosApi.get(`/${id}`);
export const createPago = (pago) => pagosApi.post("/", pago);
export const updatePago = (id, pago) => pagosApi.put(`/${id}/`, pago);
export const deletePago = (id) => pagosApi.delete(`/${id}`);