import axios from "axios";

const URL = process.env.NODE_ENV === "production"
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:8001/api";

const institucionesApi = axios.create({
  baseURL: `${URL}/instituciones`,
});

export const getAllInstituciones = () => institucionesApi.get("/");
export const getInstitucion = (id) => institucionesApi.get(`/${id}`);
export const createInstitucion = (institucion) => institucionesApi.post("/", institucion);
export const updateInstitucion = (id, institucion) => institucionesApi.put(`/${id}/`, institucion);
export const deleteInstitucion = (id) => institucionesApi.delete(`/${id}`);
