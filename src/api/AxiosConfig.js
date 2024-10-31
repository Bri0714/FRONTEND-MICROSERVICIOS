// src/api/axiosConfig.js

import axios from 'axios';

// Crear una instancia de Axios con la configuración base
const api = axios.create({
    baseURL: 'http://localhost:8000/', // Asegúrate de que este sea el URL correcto de tu backend
});

// Agregar un interceptor para incluir el token JWT en todas las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // O donde estés almacenando el token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
