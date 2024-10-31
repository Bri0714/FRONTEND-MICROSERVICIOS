// src/components/Sidebar.js

import React from "react";
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

export function Sidebar({ isOpen, toggleSidebar }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const sidebarWidth = isOpen ? "w-64" : "w-16";

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-[#1a252f] text-white shadow-lg transition-all duration-500 ease-in-out z-50 ${sidebarWidth}`}
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
                                to="/menu-principal" // Redirige al menú principal
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaRoute size={20} />
                                {isOpen && <span className="font-poppins">Rutas</span>}
                            </Link>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <Link
                                to="/menu-principal" // Redirige al menú principal
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
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <Link
                                to="/menu-principal" // Redirige al menú principal
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaBell size={20} />
                                {isOpen && (
                                    <span className="font-poppins">Notificaciones</span>
                                )}
                            </Link>
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
    );
}

export default Sidebar;