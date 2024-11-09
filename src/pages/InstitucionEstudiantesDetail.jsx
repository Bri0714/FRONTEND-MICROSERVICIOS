// src/pages/InstitucionEstudiantesDetail.js

import React, { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { Navigation } from "../components/Navigation";
import { useParams } from "react-router-dom";
import { getEstudiantesByInstitucionYRuta } from "../api/get_away";

export function InstitucionEstudiantesDetail() {
    const { institucionId, rutaId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getEstudiantesByInstitucionYRuta(institucionId, rutaId);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("No se pudo obtener la información.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [institucionId, rutaId]);

    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-8">{error}</div>;
    }

    const { institucion, vehiculo, estudiantes } = data;

    // Función para ajustar la URL de las imágenes
    function getAccessibleImageUrl(imageUrl) {
        if (!imageUrl) return null;
        // Reemplaza las URLs internas por las accesibles desde el navegador
        return imageUrl
            .replace('http://instituciones:8001', 'http://localhost:8001')
            .replace('http://vehiculos:8006', 'http://localhost:8006');
    }

    return (
        <div className="min-h-screen w-full">
            {/* Navigation */}
            <Navigation title="Estudiantes de la Ruta" />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-5xl font-extrabold text-slate-950 mb-12 text-center font-poppins mt-12">{institucion.nombre}</h1>

                {/* Información de la institución y el vehículo */}
                <div className="flex flex-col md:flex-row justify-center items-start mb-12 space-y-8 md:space-y-0 md:space-x-8">
                    {/* Institución */}
                    <div className="w-full md:w-1/2 flex flex-col items-center">
                        {/* Logo de la institución */}
                        {institucion.logo ? (
                            <img
                                src={getAccessibleImageUrl(institucion.logo)}
                                alt="Logo de la institución"
                                className="w-48 h-48 rounded-lg object-contain"
                            />
                        ) : (
                            <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Logo no disponible</span>
                            </div>
                        )}
                        {/* Datos de la institución */}
                        <div className="mt-4 text-center space-y-2">
                            <h2 className="text-2xl font-extrabold text-slate-900 font-poppins">{institucion.nombre}</h2>
                            <p className="text-xl font-mono text-gray-700">NIT: {institucion.nit}</p>
                            {/* Puedes agregar más información aquí si es necesario */}
                        </div>
                    </div>
                    {/* Vehículo */}
                    <div className="w-full md:w-1/2 flex flex-col items-center">
                        {/* Imagen del vehículo */}
                        {vehiculo.vehiculo_imagen ? (
                            <img
                                src={getAccessibleImageUrl(vehiculo.vehiculo_imagen)}
                                alt="Imagen del vehículo"
                                className="w-48 h-48 rounded-lg object-contain"
                            />
                        ) : (
                            <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Imagen no agregada</span>
                            </div>
                        )}
                        {/* Datos del vehículo y monitora */}
                        <div className="mt-4 text-center space-y-2">
                            <h2 className="text-2xl font-extrabold text-slate-900 font-poppins">Vehículo</h2>
                            <p className="text-xl font-mono text-gray-700">Placa: {vehiculo.vehiculo_placa}</p>
                            <p className="text-xl font-mono text-gray-700">Capacidad: {vehiculo.vehiculo_capacidad}</p>
                            <p className="text-xl font-mono text-gray-700">Modelo: {vehiculo.vehiculo_modelo}</p>
                            {vehiculo.monitora && (
                                <p className="text-xl font-mono text-gray-700">Monitora: {vehiculo.monitora.nombre_completo}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla de estudiantes */}
                <h2 className="text-xl font-bold mb-6 text-slate-900 font-poppins text-center md:text-left">Estudiantes Asociados</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-3 border-b text-black font-semibold">Nombre</th>
                                <th className="py-3 border-b text-black font-semibold">Edad</th>
                                <th className="py-3 border-b text-black font-semibold">Curso</th>
                                <th className="py-3 border-b text-black font-semibold">Dirección</th>
                                <th className="py-3 border-b text-black font-semibold">Acudiente</th>
                                <th className="py-3 border-b text-black font-semibold">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes && estudiantes.length > 0 ? (
                                estudiantes.map((estudiante, index) => (
                                    <tr key={index} className="transition-all duration-300 ease-in-out">
                                        <td className="py-3 border-b text-center text-black">
                                            {estudiante.nombre} {estudiante.apellido}
                                        </td>
                                        <td className="py-3 border-b text-center text-black">{estudiante.edad}</td>
                                        <td className="py-3 border-b text-center text-black">{estudiante.curso}</td>
                                        <td className="py-3 border-b text-center text-black">{estudiante.direccion}</td>
                                        <td className="py-3 border-b text-center text-black">
                                            {estudiante.acudiente.acudiente_nombre} {estudiante.acudiente.acudiente_apellido}
                                        </td>
                                        <td className="py-3 border-b text-center text-black">
                                            {estudiante.acudiente.acudiente_telefono}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-6 text-center text-black">No hay estudiantes asociados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default InstitucionEstudiantesDetail;

