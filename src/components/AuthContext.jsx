// src/components/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/AxiosConfig"; // Importa la instancia configurada de Axios

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (token) {
                    // Solicita la información del usuario autenticado
                    const response = await api.get("api/api/users/current_user/");
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                        setUser(response.data.user); // Guarda la información del usuario
                    } else {
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error verificando el estado de autenticación:", error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (token) => {
        sessionStorage.setItem("token", token);
        setIsAuthenticated(true);

        // Obtenemos la información del usuario después de iniciar sesión
        try {
            const response = await api.get("api/api/users/current_user/");
            if (response.status === 200) {
                setUser(response.data.user);
                console.log("Usuario obtenido en login:", response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error obteniendo la información del usuario:", error);
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/logout/"); // Asegúrate de que esta ruta es correcta
        } catch (error) {
            console.error("Error al cerrar sesión en el backend:", error);
        } finally {
            // Limpiar el almacenamiento de sesión y el estado de autenticación
            sessionStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, setUser, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
