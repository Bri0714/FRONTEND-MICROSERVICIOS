// src/pages/MenuPrincipal.js

import React, { useState, useEffect } from "react";
import { Footer } from "../components/footer";
import { Sidebar } from "../components/Sidebar";
import { FaSchool, FaRoute, FaUserGraduate } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useAuth } from "../components/AuthContext"; // Importamos el contexto de autenticación
import { getAllInstituciones } from "../api/instituciones.api"; // Importar la API de instituciones
import { getAllRutas } from "../api/rutas.api"; // Importar la API de rutas
import Swal from 'sweetalert2'; // Importar SweetAlert para mensajes

export function MenuPrincipal() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useAuth(); // Obtenemos la información del usuario desde el contexto

    // Estados para Instituciones y Rutas
    const [instituciones, setInstituciones] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    // Ancho del Sidebar en píxeles
    const sidebarWidth = isSidebarOpen ? 256 : 64; // 256px para w-64, 64px para w-16

    // Obtenemos el nombre del usuario, y si no está disponible, usamos 'Usuario'
    const userName = user ? user.username : "Usuario";

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
        <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* Fondo con gradiente */}
            <div className="absolute inset-0 bg-gradient-animated bg-cover bg-center animate-gradient -z-10"></div>

            {/* Contenido principal */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Área de contenido principal */}
                <div
                    className="flex-grow transition-all duration-300 ease-in-out"
                    style={{ marginLeft: `${sidebarWidth}px` }}
                >
                    <div className="w-full h-full">
                        <div className="w-full px-4 py-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-extrabold text-center mb-8 font-poppins text-white drop-shadow-lg">
                                Bienvenido, <span className="text-yellow-400">{userName}</span>
                            </h1>

                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="loader">Cargando...</div> {/* Puedes reemplazar esto con un spinner */}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Tarjeta para Colegios */}
                                    <a
                                        href="/instituciones"
                                        className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 ease-in-out p-6 md:p-8 lg:p-10 transform hover:scale-105 hover:bg-blue-100"
                                    >
                                        <div className="flex items-center justify-center mb-4 md:mb-6">
                                            <FaSchool size={60} className="text-blue-600" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 font-poppins text-gray-800">
                                            Colegios
                                        </h2>
                                        <p className="text-gray-600 text-center mb-2 md:mb-4">
                                            Gestiona la información de los colegios.
                                        </p>
                                    </a>

                                    {/* Tarjeta para Rutas */}
                                    {rutasEnabled ? (
                                        <a
                                            href="/rutas"
                                            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 ease-in-out p-6 md:p-8 lg:p-10 transform hover:scale-105 hover:bg-green-100"
                                        >
                                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                                <FaRoute size={60} className="text-green-600" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 font-poppins text-gray-800">
                                                Rutas
                                            </h2>
                                            <p className="text-gray-600 text-center mb-2 md:mb-4">
                                                Administra las rutas de transporte.
                                            </p>
                                        </a>
                                    ) : (
                                        <div
                                            onClick={() => handleModuleClick("Rutas")}
                                            className="bg-white rounded-3xl shadow-xl cursor-not-allowed opacity-50 transition-transform duration-300 ease-in-out p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center"
                                        >
                                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                                <FaRoute size={60} className="text-green-600" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 font-poppins text-gray-800">
                                                Rutas
                                            </h2>
                                            <p className="text-gray-600 text-center mb-2 md:mb-4">
                                                Administra las rutas de transporte.
                                            </p>
                                        </div>
                                    )}

                                    {/* Tarjeta para Estudiantes */}
                                    {estudiantesEnabled ? (
                                        <a
                                            href="/estudiantes"
                                            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 ease-in-out p-6 md:p-8 lg:p-10 transform hover:scale-105 hover:bg-purple-100"
                                        >
                                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                                <FaUserGraduate size={60} className="text-purple-600" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 font-poppins text-gray-800">
                                                Estudiantes
                                            </h2>
                                            <p className="text-gray-600 text-center mb-2 md:mb-4">
                                                Gestiona los datos de los estudiantes.
                                            </p>
                                        </a>
                                    ) : (
                                        <div
                                            onClick={() => handleModuleClick("Estudiantes")}
                                            className="bg-white rounded-3xl shadow-xl cursor-not-allowed opacity-50 transition-transform duration-300 ease-in-out p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center"
                                        >
                                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                                <FaUserGraduate size={60} className="text-purple-600" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 font-poppins text-gray-800">
                                                Estudiantes
                                            </h2>
                                            <p className="text-gray-600 text-center mb-2 md:mb-4">
                                                Gestiona los datos de los estudiantes.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Entidades Reguladoras */}
                            <div
                                className="mt-12 md:mt-16 lg:mt-20 bg-white bg-opacity-90 p-4 md:p-6 rounded-2xl w-full max-w-xl mx-auto shadow-lg"
                                style={{ minHeight: "200px" }}
                            >
                                {/* Slider */}
                                <Slider {...sliderSettings} className="w-full h-full">
                                    {/* Slide 1 */}
                                    <div className="flex items-center justify-center h-full">
                                        <img
                                            src="/public/secretaria de movilidad.png"
                                            alt="Secretaría de Movilidad de Bogotá"
                                            className="w-auto max-h-32 object-contain mx-auto"
                                        />
                                    </div>
                                    {/* Slide 2 */}
                                    <div className="flex items-center justify-center h-full">
                                        <img
                                            src="/public/supertransporte-min.png"
                                            alt="Superintendencia de Puertos y Transporte"
                                            className="w-auto max-h-32 object-contain mx-auto"
                                        />
                                    </div>
                                    {/* Slide 3 */}
                                    <div className="flex items-center justify-center h-full">
                                        <img
                                            src="/public/Logo_Ministerio_de_Transporte_Colombia_2022-2026.png"
                                            alt="Ministerio de Transporte de Colombia"
                                            className="w-auto max-h-32 object-contain mx-auto"
                                        />
                                    </div>
                                    {/* Slide 4 */}
                                    <div className="flex items-center justify-center h-full">
                                        <img
                                            src="/public/logo-secretaria-de-educacion-de-bogota.png"
                                            alt="Secretaría de Educación de Bogotá"
                                            className="w-auto max-h-32 object-contain mx-auto"
                                        />
                                    </div>
                                </Slider>
                            </div>
                        </div>
                        <Footer className="mt-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MenuPrincipal;
