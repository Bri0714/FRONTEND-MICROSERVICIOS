// src/pages/InstitucionDetail.js

import React, { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { Navigation } from "../components/Navigation";
import { useParams, useNavigate } from "react-router-dom";
import { getInstitucion } from "../api/instituciones.api";
import { getInstitucionWithRoutes } from "../api/get_away";

export function InstitucionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [institucion, setInstitucion] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para ajustar la URL de las imágenes
    function getAccessibleImageUrl(imageUrl) {
        if (!imageUrl) return null;
        // Reemplaza 'http://conductores:8004' con la URL accesible desde el navegador
        return imageUrl.replace('http://conductores:8005', 'http://localhost:8005');
    }

    useEffect(() => {
        async function fetchInstitucion() {
            try {
                const response = await getInstitucion(id);
                setInstitucion(response.data);

                const rutasResponse = await getInstitucionWithRoutes(id);
                setRutas(rutasResponse.data.rutas);
            } catch (error) {
                console.error("Error fetching institucion data:", error);
                setError("No se pudo encontrar la institución.");
            } finally {
                setLoading(false);
            }
        }
        fetchInstitucion();
    }, [id]);

    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-8">{error}</div>;
    }

    return (
        <div className="min-h-screen w-full">
            {/* Navigation */}
            <Navigation title="Colegios" />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-5xl font-extrabold text-slate-950 mb-12 text-center font-poppins mt-12">
                    {institucion.institucion_nombre}
                </h1>
                <div className="flex flex-col items-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-7xl">
                        <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-6 md:space-y-0 md:space-x-8">
                            {institucion.institucion_logo ? (
                                <img
                                    src={institucion.institucion_logo}
                                    alt="Institucion logo"
                                    className="w-56 h-56 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-56 h-56 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Imagen no agregada</span>
                                </div>
                            )}
                            <div className="flex flex-col text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-extrabold text-slate-900 font-poppins">
                                    {institucion.institucion_nombre}
                                </h2>
                                <p className="text-xl font-mono text-gray-700">
                                    NIT: {institucion.institucion_nit}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Dirección: {institucion.institucion_direccion}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Teléfono: {institucion.institucion_telefono}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Contacto: {institucion.institucion_contactos}
                                </p>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-6 text-slate-900 font-poppins text-center md:text-left">
                            Rutas Asociadas
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto bg-white border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Nombre Ruta
                                        </th>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Código Ruta
                                        </th>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Placa Vehículo
                                        </th>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Conductor
                                        </th>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Teléfono
                                        </th>
                                        <th className="px-4 py-3 border-b text-black font-semibold text-left">
                                            Más
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rutas && rutas.length > 0 ? (
                                        rutas.map((ruta, index) => (
                                            <tr key={index} className="transition-all duration-300 ease-in-out">
                                                <td className="px-4 py-3 border-b text-black">
                                                    {ruta.ruta_nombre}
                                                </td>
                                                <td className="px-4 py-3 border-b text-black">
                                                    {ruta.ruta_movil}
                                                </td>
                                                <td className="px-4 py-3 border-b text-black">
                                                    {ruta.vehiculo && typeof ruta.vehiculo === "object"
                                                        ? ruta.vehiculo.placa
                                                        : "-"}
                                                </td>
                                                <td className="px-4 py-3 border-b text-black">
                                                    <div className="flex items-center space-x-2">
                                                        {ruta.conductor && typeof ruta.conductor === "object" ? (
                                                            <>
                                                                {ruta.conductor.foto ? (
                                                                    <img
                                                                        src={getAccessibleImageUrl(ruta.conductor.foto)}
                                                                        alt="Conductor"
                                                                        className="w-16 h-16 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        <span className="text-xs text-gray-500">
                                                                            NA
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <span>{ruta.conductor.nombre}</span>
                                                            </>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 border-b text-black">
                                                    {ruta.conductor && typeof ruta.conductor === "object"
                                                        ? ruta.conductor.telefono
                                                        : "-"}
                                                </td>
                                                <td className="px-4 py-3 border-b text-black">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/instituciones/${institucion.id}/rutas/${ruta.id}/estudiantes`
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Ver
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-6 text-center text-black">
                                                No hay rutas asociadas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default InstitucionDetail;

