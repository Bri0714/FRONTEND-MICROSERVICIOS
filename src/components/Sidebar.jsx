// Sidebar.jsx
import React from "react";
import {
    FaSchool,
    FaRoute,
    FaUserGraduate,
    FaBell,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaBus,
} from "react-icons/fa";

export function Sidebar({ isOpen, toggleSidebar }) {
    const sidebarWidth = isOpen ? "w-64" : "w-16";

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-[#1a252f] text-white shadow-lg transition-all duration-500 ease-in-out z-50 ${sidebarWidth}`}
        >
            {/* Sección superior */}
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-2">
                    <FaBus size={30} className="text-yellow-500" />
                    {isOpen && (
                        <span className="text-xl font-bold font-poppins">
                            SchoolarTransPro
                        </span>
                    )}
                </div>
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
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaSchool size={20} />
                                {isOpen && <span className="font-poppins">Colegios</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaRoute size={20} />
                                {isOpen && <span className="font-poppins">Rutas</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaUserGraduate size={20} />
                                {isOpen && <span className="font-poppins">Estudiantes</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaUser size={20} />
                                {isOpen && <span className="font-poppins">Perfil</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaBell size={20} />
                                {isOpen && <span className="font-poppins">Notificaciones</span>}
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Sección inferior con Login, Register y Logout */}
                <div className="mb-4">
                    <ul className="space-y-2">
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaSignInAlt size={20} />
                                {isOpen && <span className="font-poppins">Login</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#14212b] px-4 py-2 rounded transition-all duration-300 ease-in-out">
                            <div
                                className={`flex items-center gap-4 ${isOpen ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <FaUserPlus size={20} />
                                {isOpen && <span className="font-poppins">Register</span>}
                            </div>
                        </li>
                        <li className="hover:bg-[#ff4d4d] px-4 py-2 rounded transition-all duration-300 ease-in-out">
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
