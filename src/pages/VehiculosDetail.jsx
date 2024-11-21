// src/pages/VehiculoDetail.jsx

import React, { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { Navigation } from "../components/Navigation";
import { useParams, useNavigate } from "react-router-dom";
import { getRutaWithVehiculoConductor } from "../api/get_away";
import axios from "axios";

export function VehiculoDetail() {
    const { id } = useParams();
    const [rutaData, setRutaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para ajustar la URL de las imágenes
    function getAccessibleImageUrl(imageUrl) {
        if (!imageUrl) return null;
        // Reemplaza 'http://vehiculos:8006' con la URL accesible desde el navegador
        return imageUrl.replace('http://vehiculos:8006', 'http://localhost:8006');
    }

    useEffect(() => {
        async function fetchRutaData() {
            try {
                const response = await getRutaWithVehiculoConductor(id);
                setRutaData(response.data);
            } catch (error) {
                console.error("Error fetching ruta data:", error);
                setError("No se pudo encontrar la ruta o vehículo.");
            } finally {
                setLoading(false);
            }
        }
        fetchRutaData();
    }, [id]);

    const handleGpsLocation = async () => {
        try {
            // Hacer la solicitud al backend intermediario para iniciar sesión con Puppeteer
            const response = await axios.get("http://localhost:3001/api/gps/login");

            if (response.status === 200) {
                alert("Inicio de sesión en GPS exitoso. Revisa el navegador para ver el dashboard.");
            } else {
                console.error("Error al iniciar sesión en GPS:", response);
                alert("No se pudo iniciar sesión en el sistema GPS.");
            }
        } catch (error) {
            console.error("Error en la autenticación del GPS:", error);
            alert("No se pudo conectar al sistema GPS.");
        }
    };


    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-8">{error}</div>;
    }

    return (
        <div className="min-h-screen w-full">
            {/* Navigation */}
            <Navigation title="Vehículos" />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-5xl font-extrabold text-slate-950 mb-12 text-center font-poppins mt-12">
                    {rutaData.ruta.nombre} - {rutaData.vehiculo.marca}
                </h1>
                <div className="flex flex-col items-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
                        <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-6 md:space-y-0 md:space-x-8">
                            {rutaData.vehiculo.imagen ? (
                                <img
                                    src={getAccessibleImageUrl(rutaData.vehiculo.imagen)}
                                    alt="Vehículo"
                                    className="w-3/4 h-auto rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-3/4 h-64 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Este vehículo no tiene imagen</span>
                                </div>
                            )}
                            <div className="flex flex-col text-center md:text-left space-y-4">
                                <h2 className="text-2xl font-extrabold text-slate-900 font-poppins">
                                    Placa: {rutaData.vehiculo.placa}
                                </h2>
                                <p className="text-xl font-mono text-gray-700">
                                    Modelo: {rutaData.vehiculo.modelo}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Capacidad: {rutaData.vehiculo.capacidad} pasajeros
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Conductor: {rutaData.conductor.nombre}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Teléfono del conductor: {rutaData.conductor.telefono}
                                </p>
                                <p className="text-xl font-mono text-gray-700">
                                    Estado del vehículo:
                                    <span className={`inline-block px-4 py-2 rounded text-white ${rutaData.ruta.estado ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {rutaData.ruta.estado ? 'Activa' : 'Inactiva'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        {/* Botones para Documentación y Ubicación en vivo */}
                        <div className="flex flex-col md:flex-row justify-center items-center mt-10 space-y-4 md:space-y-0 md:space-x-8">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => navigate(`/vehiculos/${rutaData.vehiculo.id}`)}
                            >
                                Documentación
                            </button>

                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleGpsLocation}
                            >
                                Ubicación en vivo (GPS)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default VehiculoDetail;

