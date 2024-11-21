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
import { getAllInstituciones } from "../api/instituciones.api";
import { getAllRutas } from "../api/rutas.api"; // Importar la API de rutas
import Swal from 'sweetalert2'; // Importar SweetAlert para mensajes

export function Sidebar({ isOpen, toggleSidebar }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 7;
    //estado para instituciones y rutas
    const [instituciones, setInstituciones] = useState([]);
    const [rutas, setRutas] = useState([]);

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    // Toggle del panel de notificaciones
    const toggleNotificationsPanel = () => {
        setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
    };

    // Agregar una notificación para conductores
    const addNotification = (conductor) => {
        setNotifications((prevNotifications) => {
            // Evitar duplicados
            const exists = prevNotifications.find((notif) => notif.id === conductor.id && notif.type === 'conductor');
            if (exists) return prevNotifications;
            return [
                ...prevNotifications,
                {
                    id: conductor.id,
                    type: 'conductor',
                    nombre: `${conductor.nombre} ${conductor.apellido}`,
                    fecha: conductor.fecha_expiracion,
                    mensaje: `El conductor ${conductor.nombre} ${conductor.apellido} tiene vencida la licencia de conducción.`,
                },
            ];
        });
    };

    // Agregar una notificación para rutas
    const addRutaNotification = (ruta) => {
        setNotifications((prevNotifications) => {
            // Evitar duplicados
            const exists = prevNotifications.find((notif) => notif.id === ruta.id && notif.type === 'ruta');
            if (exists) return prevNotifications;
            return [
                ...prevNotifications,
                {
                    id: ruta.id,
                    type: 'ruta',
                    nombre: ruta.ruta_nombre,
                    fecha: ruta.fecha_actualizacion || 'N/A', // Ajusta según los campos disponibles
                    mensaje: `La ruta ${ruta.ruta_nombre} está inactiva.`,
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

    // Obtener rutas inactivas al montar el componente
    useEffect(() => {
        const fetchRutas = async () => {
            try {
                const rutasRes = await getAllRutas();
                const rutasData = rutasRes.data;

                rutasData.forEach((ruta) => {
                    // Si la ruta no está activa, agregar una notificación
                    if (!ruta.activa) {
                        addRutaNotification(ruta);
                    }
                });
            } catch (error) {
                console.error("Error al obtener rutas:", error);
            }
        };

        fetchRutas();
    }, []);

    // Polling para actualizar notificaciones cada 60 segundos
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // Actualizar conductores
                const conductoresRes = await getAllConductores();
                const conductoresData = conductoresRes.data;

                conductoresData.forEach((conductor) => {
                    if (!conductor.licencia_activa) {
                        addNotification(conductor);
                    } else {
                        // Si el conductor está activo, eliminar la notificación si existe
                        setNotifications((prevNotifications) =>
                            prevNotifications.filter(
                                (notif) => !(notif.id === conductor.id && notif.type === 'conductor')
                            )
                        );
                    }
                });

                // Actualizar rutas
                const rutasRes = await getAllRutas();
                const rutasData = rutasRes.data;

                rutasData.forEach((ruta) => {
                    if (!ruta.activa) {
                        addRutaNotification(ruta);
                    } else {
                        // Si la ruta está activa, eliminar la notificación si existe
                        setNotifications((prevNotifications) =>
                            prevNotifications.filter(
                                (notif) => !(notif.id === ruta.id && notif.type === 'ruta')
                            )
                        );
                    }
                });
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        }, 60000); // Verificar cada 60 segundos

        return () => clearInterval(interval);
    }, []);

    // Manejar el cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

        // Fetch de Instituciones y Rutas
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const [institucionesRes, rutasRes] = await Promise.all([
                        getAllInstituciones(),
                        getAllRutas(),
                    ]);
                    setInstituciones(institucionesRes.data);
                    setRutas(rutasRes.data);
                } catch (error) {
                    console.error("Error al obtener instituciones o rutas:", error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al cargar los datos. Por favor, inténtalo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
                            popup: 'bg-red-50 p-6 rounded-lg shadow-lg',
                        },
                    });
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchData();
        }, []);

    // Determinar si los módulos están habilitados
    const rutasEnabled = instituciones.length > 0;
    const estudiantesEnabled = rutas.length > 0 && rutasEnabled;

    // Manejar el click en módulos bloqueados
    const handleModuleClick = (moduleName) => {
        let message = "";
        if (moduleName === "Rutas") {
            message = "Debes crear al menos una institución antes de acceder a Rutas.";
        } else if (moduleName === "Estudiantes") {
            message = "Debes crear al menos una ruta antes de acceder a Estudiantes.";
        }

        Swal.fire({
            title: 'Acceso Restringido',
            text: message,
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
                popup: 'bg-blue-50 p-6 rounded-lg shadow-lg',
            },
        });
    };


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
                            {/* Enlaces a módulos */}
                            {rutasEnabled ? (
                                <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                    <Link
                                        to="/rutas"
                                        className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"}`}
                                    >
                                        <FaRoute size={20} />
                                        {isOpen && <span className="font-poppins">Rutas</span>}
                                    </Link>
                                </li>
                            ) : (
                                <li
                                    className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out cursor-not-allowed opacity-50"
                                    onClick={() => handleModuleClick("Rutas")}
                                >
                                    <div className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"}`}>
                                        <FaRoute size={20} />
                                        {isOpen && <span className="font-poppins">Rutas</span>}
                                    </div>
                                </li>
                            )}

                            {estudiantesEnabled ? (
                                <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                                    <Link
                                        to="/estudiantes"
                                        className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"}`}
                                    >
                                        <FaUserGraduate size={20} />
                                        {isOpen && <span className="font-poppins">Estudiantes</span>}
                                    </Link>
                                </li>
                            ) : (
                                <li
                                    className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out cursor-not-allowed opacity-50"
                                    onClick={() => handleModuleClick("Estudiantes")}
                                >
                                    <div className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"}`}>
                                        <FaUserGraduate size={20} />
                                        {isOpen && <span className="font-poppins">Estudiantes</span>}
                                    </div>
                                </li>
                            )}

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
                toggleNotificationsPanel={toggleNotificationsPanel} // Pasar la función
            />
        </>
    );

};

export default Sidebar;
