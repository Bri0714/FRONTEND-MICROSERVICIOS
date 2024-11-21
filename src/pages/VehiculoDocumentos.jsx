// src/pages/VehiculoDocumentos.jsx

import React, { useEffect, useState } from 'react';
import { getVehiculoDetalles } from '../api/get_away'; // Asegúrate de tener esta función definida
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/footer';

// Importa los iconos necesarios
import {
    FaFileAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCarCrash,
    FaShieldAlt,
    FaClipboardList,
} from 'react-icons/fa';

export function VehiculoDocumentos() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehiculoData, setVehiculoData] = useState(null);
    const [documentos, setDocumentos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para ajustar la URL de la imagen si es necesario
    function getAccessibleImageUrl(imageUrl) {
        if (!imageUrl) return null;
        // Reemplaza 'http://vehiculos:8006' con la URL accesible desde el navegador
        return imageUrl.replace('http://vehiculos:8006', 'http://localhost:8006');
    }

    useEffect(() => {
        async function fetchVehiculoData() {
            try {
                const response = await getVehiculoDetalles(id);
                if (response.status === 200) {
                    setVehiculoData(response.data.vehiculo);
                    setDocumentos(response.data.documentos);
                } else {
                    console.error('Error fetching vehicle data');
                    setError('No se pudo obtener la información del vehículo.');
                }
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        }
        fetchVehiculoData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen w-full">
                <Navigation title="Documentos del Vehículo" />
                <div className="text-center py-8">Cargando...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full">
                <Navigation title="Documentos del Vehículo" />
                <div className="text-center py-8 text-red-500">{error}</div>
                <Footer />
            </div>
        );
    }

    if (!vehiculoData) {
        return (
            <div className="min-h-screen w-full">
                <Navigation title="Documentos del Vehículo" />
                <div className="text-center py-8">No se encontró información del vehículo.</div>
                <Footer />
            </div>
        );
    }
    const handleCardClick = (docType) => {
        if (vehiculoData && vehiculoData.id) {
            console.log("Vehiculo ID:", vehiculoData.id); // Para verificar que el ID se está pasando correctamente
            navigate(`/vehiculo/${vehiculoData.id}/documento/${docType}`);
        } else {
            console.error("Vehículo ID no disponible, no se puede navegar a los detalles del documento");
        }
    };

    return (
        <div className="min-h-screen w-full">
            <Navigation title="Documentos del Vehículo" />
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-extrabold text-slate-950 mb-8 text-center font-poppins mt-12">
                    Documentos del Vehículo {vehiculoData.placa}
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
                        {vehiculoData.imagen ? (
                            <img
                                src={getAccessibleImageUrl(vehiculoData.imagen)}
                                alt="Vehículo"
                                className="w-2/5 h-auto rounded object-cover"
                            />
                        ) : (
                            <div className="w-32 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Sin imagen</span>
                            </div>
                        )}
                        <div className="flex flex-col text-center md:text-left space-y-2">
                            <h2 className="text-lg font-bold text-slate-900 font-poppins">
                                Placa: {vehiculoData.placa}
                            </h2>
                            <p className="text-sm font-mono text-gray-700">
                                Marca: {vehiculoData.marca}
                            </p>
                            <p className="text-sm font-mono text-gray-700">
                                Modelo: {vehiculoData.modelo}
                            </p>
                        </div>
                    </div>

                    {/* Tarjetas para Documentos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {['SOAT', 'Tecnomecanica', 'Poliza'].map((docType) => {
                            const docData = documentos[docType];
                            let estado = 'No registrado';
                            let statusColor = 'bg-gray-500';
                            let IconComponent = FaFileAlt; // Icono por defecto
                            let SpecificIcon;

                            // Asignar iconos específicos según el tipo de documento
                            switch (docType) {
                                case 'SOAT':
                                    SpecificIcon = FaShieldAlt;
                                    break;
                                case 'Tecnomecanica':
                                    SpecificIcon = FaCarCrash;
                                    break;
                                case 'Poliza':
                                    SpecificIcon = FaClipboardList;
                                    break;
                                default:
                                    SpecificIcon = FaFileAlt;
                            }

                            if (typeof docData === 'string') {
                                // Documento no registrado
                                estado = 'No registrado';
                                statusColor = 'bg-gray-500';
                                IconComponent = FaExclamationTriangle;
                            } else {
                                // Datos del documento disponibles
                                estado = docData.estado ? docData.estado : 'Desconocido';
                                if (estado === 'Vigente') {
                                    statusColor = 'bg-green-500';
                                    IconComponent = FaCheckCircle;
                                } else if (estado === 'Por vencer') {
                                    statusColor = 'bg-yellow-500';
                                    IconComponent = FaExclamationTriangle;
                                } else {
                                    statusColor = 'bg-red-500';
                                    IconComponent = FaExclamationTriangle;
                                }
                            }

                            return (
                                <div
                                    key={docType}
                                    onClick={() => handleCardClick(docType)}
                                    className="bg-white text-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-slate-400 hover:bg-slate-100"
                                >
                                    <SpecificIcon className="text-4xl mb-2 text-slate-700" />
                                    <IconComponent className="text-3xl mb-2 animate-pulse" />
                                    <h3 className="text-md font-semibold mb-1 text-center">{docType}</h3>
                                    <div
                                        className={`w-full py-1 text-center text-xs font-medium rounded ${statusColor} text-white`}
                                    >
                                        {estado}
                                    </div>
                                    {typeof docData === 'string' && (
                                        <p className="text-xs mt-2 text-red-600">Documento no registrado</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default VehiculoDocumentos;
