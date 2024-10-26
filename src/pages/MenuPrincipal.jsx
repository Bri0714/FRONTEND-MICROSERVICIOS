import React, { useState } from "react";
import { Footer } from "../components/footer";
import { Sidebar } from "../components/Sidebar";
import { FaSchool, FaRoute, FaUserGraduate } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export function MenuPrincipal() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userName = "Usuario"; // Placeholder para el nombre del usuario registrado

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
                                {/* Tarjeta para Estudiantes */}
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
                            </div>

                            {/* Entidades Reguladoras (Título eliminado) */}
                            <div
                                className="mt-12 md:mt-16 lg:mt-20 bg-white bg-opacity-90 p-4 md:p-6 rounded-2xl w-full max-w-xl mx-auto shadow-lg"
                                style={{ minHeight: "200px" }}
                            >
                                {/* Slider sin título */}
                                <Slider {...sliderSettings} className="w-full h-full">
                                    {/* Ajustes en las imágenes para mejor visualización */}
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

