// src/components/Sidebar.jsx

import React, { useState, useEffect } from "react";
import {
    FaSchool,
    FaRoute,
    FaUserGraduate,
    FaBell,
    FaUser,
    FaSignOutAlt,
    FaBus,
} from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Notifications from "./Notifications"; // Importar el componente de Notificaciones
import { getAllConductores } from "../api/conductores"; // Importar la API de conductores

export function Sidebar({ isOpen, toggleSidebar }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 7;

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    // Toggle del panel de notificaciones
    const toggleNotificationsPanel = () => {
        setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
    };

    // Agregar una notificación
    const addNotification = (conductor) => {
        setNotifications((prevNotifications) => {
            // Evitar duplicados
            const exists = prevNotifications.find((notif) => notif.id === conductor.id);
            if (exists) return prevNotifications;
            return [
                ...prevNotifications,
                {
                    id: conductor.id,
                    nombre: `${conductor.nombre} ${conductor.apellido}`,
                    fecha: conductor.fecha_expiracion,
                    mensaje: `El conductor ${conductor.nombre} ${conductor.apellido} tiene vencida la licencia de conducción.`,
                },
            ];
        });
    };

    // Eliminar una notificación
    const removeNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notif) => notif.id !== id)
        );
    };

    // Limpiar todas las notificaciones
    const clearNotifications = () => {
        setNotifications([]);
    };

    // Obtener conductores inactivos al montar el componente
    useEffect(() => {
        const fetchConductores = async () => {
            try {
                const conductoresRes = await getAllConductores();
                const conductoresData = conductoresRes.data;

                conductoresData.forEach((conductor) => {
                    // Si la licencia está inactiva, agregar una notificación
                    if (!conductor.licencia_activa) {
                        addNotification(conductor);
                    }
                });
            } catch (error) {
                console.error("Error al obtener conductores:", error);
            }
        };

        fetchConductores();
    }, []);

    // Polling para actualizar notificaciones cada 60 segundos
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const conductoresRes = await getAllConductores();
                const conductoresData = conductoresRes.data;

                conductoresData.forEach((conductor) => {
                    if (!conductor.licencia_activa) {
                        addNotification(conductor);
                    } else {
                        // Si el conductor está activo, eliminar la notificación si existe
                        removeNotification(conductor.id);
                    }
                });
            } catch (error) {
                console.error("Error al obtener conductores:", error);
            }
        }, 60000); // Verificar cada 60 segundos

        return () => clearInterval(interval);
    }, [notifications]);

    // Manejar el cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-full bg-[#1a252f] text-white shadow-lg transition-all duration-500 ease-in-out z-50 ${isOpen ? "w-64" : "w-16"
                    }`}
            >
                {/* Sección superior */}
                <div className="flex items-center justify-between px-4 py-4">
                    <Link to="/menu-principal" className="flex items-center gap-2">
                        <FaBus size={30} className="text-yellow-500" />
                        {isOpen && (
                            <span className="text-xl font-bold font-poppins">
                                SchoolarTransPro
                            </span>
                        )}
                    </Link>
                    <button onClick={toggleSidebar} className="focus:outline-none">
                        <div className="rounded-full bg-[#14212b] p-2">
                            {isOpen ? "◀" : "▶"}
                        </div>
                    </button>
                </div>

                {/* Contenedor principal con flexbox */}
                <div className="flex flex-col h-[calc(100%-80px)] justify-between">
                    {/* Sección del menú principal */}
                    <div>
                        <ul className="space-y-2 mt-4">
                            {/* Enlace a Instituciones */}
                            <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                <Link
                                    to="/instituciones"
                                    className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                        }`}
                                >
                                    <FaSchool size={20} />
                                    {isOpen && <span className="font-poppins">Colegios</span>}
                                </Link>
                            </li>
                            {/* Enlaces a módulos no implementados que redirigen al menú principal */}
                            <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                <Link
                                    to="/rutas" // Redirige al menú principal
                                    className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                        }`}
                                >
                                    <FaRoute size={20} />
                                    {isOpen && <span className="font-poppins">Rutas</span>}
                                </Link>
                            </li>
                            <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                <Link
                                    to="/estudiantes" // Redirige al modulo estudiantes
                                    className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                        }`}
                                >
                                    <FaUserGraduate size={20} />
                                    {isOpen && <span className="font-poppins">Estudiantes</span>}
                                </Link>
                            </li>
                            {/* Enlace al Perfil */}
                            <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                <Link
                                    to="/perfil"
                                    className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                        }`}
                                >
                                    <FaUser size={20} />
                                    {isOpen && <span className="font-poppins">Perfil</span>}
                                </Link>
                            </li>
                            {/* Botón de Notificaciones */}
                            {/* Botón de Notificaciones */}
                            <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out relative">
                                <button
                                    onClick={toggleNotificationsPanel}
                                    className="flex items-center gap-4 w-full focus:outline-none"
                                >
                                    <FaBell size={20} />
                                    {isOpen && <span className="font-poppins">Notificaciones</span>}
                                    <span className="absolute -top-1 right-4 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                        {notifications.length > 0 ? notifications.length : 0}
                                    </span>
                                </button>
                            </li>

                        </ul>
                    </div>

                    {/* Sección inferior con Logout */}
                    <div className="mb-4">
                        <ul className="space-y-2">
                            <li
                                className="hover:bg-[#ff4d4d] px-4 py-2 rounded transition-all duration-300 ease-in-out cursor-pointer"
                                onClick={handleLogout}
                            >
                                <div
                                    className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                        }`}
                                >
                                    <FaSignOutAlt size={20} className="text-red-600" />
                                    {isOpen && <span className="font-poppins">Logout</span>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Panel de Notificaciones */}
            <Notifications
                isNotificationsPanelOpen={isNotificationsPanelOpen}
                isSidebarOpen={isOpen}
                notifications={notifications}
                removeNotification={removeNotification}
                clearNotifications={clearNotifications}
                currentPage={currentPage}
                paginate={paginate}
                notificationsPerPage={notificationsPerPage}
                totalPages={Math.ceil(notifications.length / notificationsPerPage)}
                toggleNotificationsPanel={toggleNotificationsPanel} // Pasar la funció
            />
        </>
    );

};

export default Sidebar;
