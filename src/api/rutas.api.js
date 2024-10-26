
import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8002";

const rutasApi = axios.create({
  baseURL: `${URL}/api/rutas/`,
});

export const getAllRutas = () => rutasApi.get("/");
export const getRuta = (id) => rutasApi.get(`/${id}/`);
export const createRuta = (ruta) => rutasApi.post("/", ruta);
export const updateRuta = (id, ruta) => rutasApi.put(`/${id}/`, ruta);
export const deleteRuta = (id) => rutasApi.delete(`/${id}/`);
