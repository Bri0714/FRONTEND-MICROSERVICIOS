// src/pages/EstudianteDetailPagos.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEstudianteDetalles } from '../api/get_away';
import { AiOutlineUser } from 'react-icons/ai';
import { Footer } from '../components/footer';
import { Navigation } from '../components/Navigation';
import { FaCheckCircle, FaExclamationTriangle, FaHourglassHalf } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CRUD_Pagos from '../components/CRUD_Pagos';

export function EstudianteDetailPagos() {
    const { id } = useParams();
    const [estudiante, setEstudiante] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMes, setSelectedMes] = useState(null);
    const [modalAction, setModalAction] = useState(null);
    const [selectedPagoData, setSelectedPagoData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const estudianteId = parseInt(id, 10);
        if (isNaN(estudianteId)) {
            setError('ID de estudiante inválido.');
            setLoading(false);
            return;
        }

        fetchEstudianteDetalles(estudianteId);
    }, [id]);

    const fetchEstudianteDetalles = async (estudianteId) => {
        try {
            const response = await getEstudianteDetalles(estudianteId);
            if (response.data.estudiante && response.data.pagos) {
                // Adjust the photo URL to be accessible from the browser
                const adjustedEstudiante = {
                    ...response.data.estudiante,
                    estudiante_foto: response.data.estudiante.estudiante_foto
                        ? response.data.estudiante.estudiante_foto.replace('http://estudiantes:8004', 'http://localhost:8004')
                        : null,
                };
                setEstudiante(adjustedEstudiante);
                setPagos(response.data.pagos);
            } else {
                setEstudiante(response.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener los detalles del estudiante:', err);
            setError('No se pudo obtener la información del estudiante.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <div className="flex-grow flex items-center justify-center mt-16">
                    <div>Cargando...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <div className="flex-grow flex items-center justify-center mt-16">
                    <div>Error: {error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!estudiante) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <div className="flex-grow flex items-center justify-center mt-16">
                    <div>No se encontró información del estudiante.</div>
                </div>
                <Footer />
            </div>
        );
    }

    // Meses desde Febrero hasta Noviembre
    const allMonths = [
        { name: 'Febrero', index: 2 },
        { name: 'Marzo', index: 3 },
        { name: 'Abril', index: 4 },
        { name: 'Mayo', index: 5 },
        { name: 'Junio', index: 6 },
        { name: 'Julio', index: 7 },
        { name: 'Agosto', index: 8 },
        { name: 'Septiembre', index: 9 },
        { name: 'Octubre', index: 10 },
        { name: 'Noviembre', index: 11 },
    ];

    // Mapear pagos por mes
    const paymentsByMonth = {};

    pagos.forEach((pago) => {
        paymentsByMonth[pago.mes_a_pagar] = pago;
    });

    // Generar los meses con el estado del pago
    const monthsWithStatus = allMonths.map((month) => {
        const payment = paymentsByMonth[month.name];
        return {
            ...month,
            pago: payment,
        };
    });

    const handleMonthClick = (month) => {
        const pago = paymentsByMonth[month.name];
        setSelectedMes(month.name);
        if (pago) {
            if (parseFloat(pago.multas) > 0) {
                // Show warning for pending fines
                toast.error(`Multa pendiente de ${pago.multas}`, { position: 'top-center', duration: 2000 });
                // Open modal to update payment
                setModalAction('update');
                setSelectedPagoData(pago);
                setIsModalOpen(true);
            } else if (pago.estado_pago) {
                // Payment has been made; open update form
                setModalAction('update');
                setSelectedPagoData(pago);
                setIsModalOpen(true);
            } else {
                // Payment is pending; open create form
                setModalAction('create');
                setSelectedPagoData(null);
                setIsModalOpen(true);
            }
        } else {
            // Option to create payment
            setModalAction('create');
            setSelectedPagoData(null);
            setIsModalOpen(true);
        }
    };
    

    const reloadPagos = () => {
        setLoading(true);
        fetchEstudianteDetalles(estudiante.id);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navigation />

            {/* Contenido Principal */}
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row mt-16">
                {/* Sidebar con información del estudiante */}
                <div className="w-full md:w-1/3 md:pr-8 mb-8 md:mb-0">
                    <div
                        className="bg-white text-black shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-50"
                    >
                        {/* Foto del Estudiante */}
                        <div className="flex justify-center mb-4">
                            {estudiante.estudiante_foto ? (
                                <img
                                    src={estudiante.estudiante_foto}
                                    alt={`${estudiante.estudiante_nombre} {estudiante.estudiante_apellido}`}
                                    className="w-32 h-32 object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                    <AiOutlineUser className="text-gray-500 text-6xl" />
                                </div>
                            )}
                        </div>
                        {/* Información del Estudiante */}
                        <h2 className="text-2xl font-extrabold text-center mb-2">
                            {estudiante.estudiante_nombre} {estudiante.estudiante_apellido}
                        </h2>
                        <p className="text-blue-800 text-center text-5xl font-black mb-4">{estudiante.estudiante_curso}</p>
                        <div className="text-gray-800 space-y-2">
                            <p>
                                <strong>Edad:</strong> {estudiante.estudiante_edad}
                            </p>
                            <p>
                                <strong>Institución:</strong> {estudiante.institucion.nombre}
                            </p>
                            <p>
                                <strong>Fecha de Ingreso a la Ruta:</strong> {estudiante.estudiante_fecha_ingreso_ruta}
                            </p>
                            <p>
                                <strong>Dirección:</strong> {estudiante.estudiante_direccion}
                            </p>
                        </div>
                        {/* Estado */}
                        <div className="mt-4 text-center">
                            <span
                                className={`px-4 py-2 rounded text-white font-semibold inline-block ${estudiante.estudiante_estado ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            >
                                {estudiante.estudiante_estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Calendario */}
                <div className="w-full md:w-2/3">
                    <div className="bg-white shadow-card-hover rounded-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-900 hover:text-white mb-8 group">
                        <h2 className="text-2xl font-extrabold mb-4 text-center text-black group-hover:text-white">Pagos</h2>
                        {/* Grid de Meses */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {monthsWithStatus.map((month, index) => {
                                const pago = month.pago;
                                let bgColor = 'bg-gray-200';
                                let statusText = 'No generado';
                                let icon = <FaHourglassHalf className="text-gray-600 text-4xl" />;
                                if (pago) {
                                    if (parseFloat(pago.multas) > 0) {
                                        // Tiene multas
                                        bgColor = 'bg-red-400';
                                        statusText = 'Vencido';
                                        icon = <FaExclamationTriangle className="text-white text-4xl" />;
                                    } else if (pago.estado_pago) {
                                        // Pago realizado y sin multas
                                        bgColor = 'bg-green-400';
                                        statusText = 'Pagado';
                                        icon = <FaCheckCircle className="text-white text-4xl" />;
                                    } else {
                                        // Pago pendiente
                                        bgColor = 'bg-yellow-400';
                                        statusText = 'Pendiente';
                                        icon = <FaHourglassHalf className="text-white text-4xl" />;
                                    }
                                } else {
                                    // No hay registro de pago
                                    bgColor = 'bg-red-400';
                                    statusText = 'No generado';
                                    icon = <FaExclamationTriangle className="text-white text-4xl" />;
                                }
                                return (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg ${bgColor} text-white flex flex-col items-center justify-center`}
                                        onClick={() => handleMonthClick(month)}
                                    >
                                        {icon}
                                        <span className="text-lg font-semibold mt-2">{month.name}</span>
                                        <span>{statusText}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Modal para CRUD de Pagos */}
            {isModalOpen && (
                <CRUD_Pagos
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    actionType={modalAction}
                    pagoData={selectedPagoData}
                    estudianteId={estudiante.id}
                    mes={selectedMes}
                    reloadPagos={reloadPagos}
                />
            )}
        </div>
    );
}

export default EstudianteDetailPagos;
