// src/components/CRUD_Pagos.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import { createPago, updatePago, deletePago } from '../api/pagos.api';
import { getEstudiante } from '../api/estudiantes';

// Configurar el elemento raíz para el modal
Modal.setAppElement('#root');

export function CRUD_Pagos({ isOpen, onClose, actionType, pagoData, estudianteId, mes, reloadPagos }) {
    const [numeroTalonario, setNumeroTalonario] = useState('');
    const [fechaDePago, setFechaDePago] = useState('');
    const [pagoMultas, setPagoMultas] = useState(false);
    const [estudianteNombre, setEstudianteNombre] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch estudiante data to get the name
        async function fetchEstudiante() {
            try {
                const response = await getEstudiante(estudianteId);
                if (response.status === 200 && response.data) {
                    setEstudianteNombre(`${response.data.estudiante_nombre} ${response.data.estudiante_apellido}`);
                }
            } catch (error) {
                console.error('Error fetching estudiante:', error);
            }
        }
        fetchEstudiante();

        // If updating, populate the fields
        if (pagoData) {
            setNumeroTalonario(pagoData.numero_talonario || '');
            setFechaDePago(pagoData.fecha_de_pago || '');
            setPagoMultas(pagoData.pago_multas || false);
        } else {
            setNumeroTalonario('');
            setFechaDePago('');
            setPagoMultas(false);
        }
    }, [estudianteId, pagoData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            numero_talonario: numeroTalonario,
            mes_a_pagar: mes,
            estudiante_id: estudianteId,
            fecha_de_pago: fechaDePago,
            estado_pago: true, // Set payment as made
        };

        if (actionType === 'create') {
            try {
                await createPago(data);
                toast.success('Pago registrado correctamente.', { position: 'bottom-right' });
                onClose();
                reloadPagos();
            } catch (error) {
                console.error('Error creating pago:', error.response ? error.response.data : error.message);
                toast.error('Error al registrar el pago No de talonario ya esta siendo usado.', { position: 'bottom-right' });
            }
        } else if (actionType === 'update') {
            try {
                await updatePago(pagoData.id, { ...data, pago_multas: pagoMultas });
                toast.success('Pago actualizado correctamente.', { position: 'bottom-right' });
                onClose();
                reloadPagos();
            } catch (error) {
                console.error('Error updating pago:', error.response ? error.response.data : error.message);
                toast.error('Error al actualizar el pago No de talonario ya esta siendo usado.', { position: 'bottom-right' });
            }
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deletePago(pagoData.id);
            toast.success('Pago eliminado correctamente.', { position: 'bottom-right' });
            onClose();
            reloadPagos();
        } catch (error) {
            console.error('Error deleting pago:', error.response ? error.response.data : error.message);
            toast.error('Error al eliminar el pago.', { position: 'bottom-right' });
        }
        setLoading(false);
    };

    // Close modal after 5 seconds when actionType is 'delete'
    useEffect(() => {
        let timer;
        if (isOpen && actionType === 'delete') {
            timer = setTimeout(() => {
                onClose();
            }, 5000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [isOpen, actionType, onClose]);

    // Modal styles
    const customStyles = {
        content: {
            backgroundColor: '#1F2937',
            padding: '2rem',
            borderRadius: '1.5rem',
            maxWidth: '600px',
            margin: 'auto',
            color: '#fff',
            maxHeight: '90vh',
            overflowY: 'auto',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
        },
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            {actionType === 'delete' ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Eliminar Pago</h2>
                    <p>¿Deseas limpiar el pago del mes {mes}?</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                        >
                            Sí
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        {actionType === 'create' && 'Registrar Pago'}
                        {actionType === 'update' && 'Actualizar Pago'}
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        {/* Estudiante */}
                        <div className="mb-4">
                            <label className="block text-base font-semibold mb-1" htmlFor="estudiante">
                                Estudiante
                            </label>
                            <input
                                type="text"
                                id="estudiante"
                                value={estudianteNombre}
                                readOnly
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-gray-700 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Mes a Pagar */}
                        <div className="mb-4">
                            <label className="block text-base font-semibold mb-1" htmlFor="mesAPagar">
                                Mes a Pagar
                            </label>
                            <input
                                type="text"
                                id="mesAPagar"
                                value={mes}
                                readOnly
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-gray-700 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Número de Talonario */}
                        <div className="mb-4">
                            <label className="block text-base font-semibold mb-1" htmlFor="numeroTalonario">
                                Número de Talonario
                            </label>
                            <input
                                type="text"
                                id="numeroTalonario"
                                value={numeroTalonario}
                                onChange={(e) => setNumeroTalonario(e.target.value)}
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Fecha de Pago */}
                        <div className="mb-4">
                            <label className="block text-base font-semibold mb-1" htmlFor="fechaDePago">
                                Fecha de Pago
                            </label>
                            <input
                                type="date"
                                id="fechaDePago"
                                value={fechaDePago}
                                onChange={(e) => setFechaDePago(e.target.value)}
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Multas Pendientes */}
                        {actionType === 'update' && pagoData && parseFloat(pagoData.multas) > 0 && (
                            <div className="mb-4">
                                <label className="block text-base font-semibold mb-1">
                                    Multas Pendientes
                                </label>
                                <input
                                    type="text"
                                    value={pagoData.multas}
                                    readOnly
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-gray-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        )}

                        {/* Pago Multas */}
                        {actionType === 'update' && (
                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="pagoMultas"
                                    checked={pagoMultas}
                                    onChange={(e) => setPagoMultas(e.target.checked)}
                                    className="mr-2"
                                />
                                <label className="text-base font-semibold" htmlFor="pagoMultas">
                                    Pago de Multas
                                </label>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                {actionType === 'create' && 'Registrar'}
                                {actionType === 'update' && 'Actualizar'}
                            </button>
                            {actionType === 'update' && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Eliminar
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
}

export default CRUD_Pagos;
