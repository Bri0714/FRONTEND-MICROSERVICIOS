// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { InstitucionFormPage } from "./pages/InstitucionFormPage";
import { RutasFormPage } from "./pages/RutasFormPage";
import { InstitucionesPage } from "./pages/InstitucionesPage";
import { RutasPage } from "./pages/RutasPage";
import { Toaster } from "react-hot-toast";
import { AdministracionColegios } from "./pages/AdministracionInstitucion";
import { MenuPrincipal } from "./pages/MenuPrincipal";
import { IndexPage } from "./pages/index";
import { Perfil } from "./pages/Perfil";
import { InstitucionDetail } from "./pages/InstitucionDetail";
import { InstitucionEstudiantesDetail } from "./pages/InstitucionEstudiantesDetail";
import { AuthProvider, useAuth } from "./components/AuthContext";
import axios from "axios"; // Agregar la importación de axios

// Establecer la URL base de tu API
axios.defaults.baseURL = "http://localhost:8000/api/";

// Interceptar solicitudes para agregar el token si existe
axios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Opcional: Manejo de errores globales de respuesta
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirigir al inicio de sesión o mostrar un mensaje al usuario
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

// Definir el componente `WithNavigation`
function WithNavigation({ children }) {
    return (
        <>
            <Navigation />
            <div>{children}</div>
        </>
    );
}

// Componente para proteger las rutas privadas
function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Mostrar un loader mientras se verifica el estado de autenticación
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
}

// Componente para rutas públicas
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return !isAuthenticated ? children : <Navigate to="/menu-principal" replace />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta pública para login y registro */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <IndexPage />
                            </PublicRoute>
                        }
                    />

                    {/* Ruta protegida para el menú principal */}
                    <Route
                        path="/menu-principal"
                        element={
                            <PrivateRoute>
                                <MenuPrincipal />
                            </PrivateRoute>
                        }
                    />

                    {/* Rutas protegidas con navegación */}
                    <Route
                        path="/instituciones"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <InstitucionesPage />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/instituciones/:id"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <InstitucionFormPage />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/instituciones/:id/detalles"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <InstitucionDetail />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    {/* Nueva ruta para InstitucionEstudiantesDetail */}
                    <Route
                        path="/instituciones/:institucionId/rutas/:rutaId/estudiantes"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <InstitucionEstudiantesDetail />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/instituciones-create"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <InstitucionFormPage />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    {/* Ruta protegida para la creacion de Rutas */}
                    <Route
                        path="/rutas-create"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <RutasFormPage />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/administrar-colegios"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <AdministracionColegios />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />

                    {/* Ruta protegida para el Perfil */}
                    <Route
                        path="/perfil"
                        element={
                            <PrivateRoute>
                                <Perfil />
                            </PrivateRoute>
                        }
                    />

                    {/*Modulo Menu Principal Rutas*/}
                    <Route
                        path="/rutas"
                        element={
                            <PrivateRoute>
                                <WithNavigation>
                                    <RutasPage />
                                </WithNavigation>
                            </PrivateRoute>
                        }
                    />

                    {/* Redirecciona a "/" si la ruta no existe */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
