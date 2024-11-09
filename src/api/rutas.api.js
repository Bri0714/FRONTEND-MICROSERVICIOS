// src/api/rutas.js

import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8002"; // Asegúrate de que este puerto coincide con tu servicio de rutas

const rutasApi = axios.create({
  baseURL: `${URL}/api/rutas/`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
rutasApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllRutas = () => rutasApi.get("/");
export const getRuta = (id) => rutasApi.get(`/${id}/`);
export const createRuta = (ruta) => rutasApi.post("/", ruta);
export const updateRuta = (id, ruta) => rutasApi.put(`/${id}/`, ruta);
export const deleteRuta = (id) => rutasApi.delete(`/${id}/`);
