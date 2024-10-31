// src/api/instituciones.api.js

import axios from "axios";

const URL = process.env.NODE_ENV === "production"
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:8001/api";

const institucionesApi = axios.create({
  baseURL: `${URL}/instituciones`,
});

// Agregar un interceptor para incluir el token JWT en las solicitudes
institucionesApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllInstituciones = () => institucionesApi.get("/");
export const getInstitucion = (id) => institucionesApi.get(`/${id}`);
export const createInstitucion = (institucion) => institucionesApi.post("/", institucion);
export const updateInstitucion = (id, institucion) => institucionesApi.put(`/${id}/`, institucion);
export const deleteInstitucion = (id) => institucionesApi.delete(`/${id}`);
