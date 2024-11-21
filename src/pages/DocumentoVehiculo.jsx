// src/pages/DocumentoVehiculo.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDocumento,
    createDocumento,
    updateDocumento,
    deleteDocumento
} from '../api/documentos.api';
import { getVehiculo } from '../api/vehiculos';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/footer';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configurar el worker de PDF.js para usar un CDN compatible
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

// Importa el worker correctamente para Vite usando ?url
import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url';

// Configura el worker para que coincida con la versión de react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Configurar el elemento raíz para el modal
Modal.setAppElement('#root');

export function DocumentoVehiculo() {
    const { vehiculoId, docType } = useParams();
    const [documentoData, setDocumentoData] = useState(null);
    const [vehiculoPlaca, setVehiculoPlaca] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fechaExpedicion, setFechaExpedicion] = useState('');
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        const fetchBlobUrl = async () => {
            if (documentoData && documentoData.vista_previa) {
                try {
                    // Añadir timestamp para evitar caching
                    const response = await fetch(`${documentoData.vista_previa}?t=${new Date().getTime()}`);
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        setBlobUrl(url);
                    } else {
                        console.error("Failed to fetch the PDF");
                        setBlobUrl(null);
                    }
                } catch (error) {
                    console.error("Error fetching blob URL:", error);
                    setBlobUrl(null);
                }
            }
        };

        fetchBlobUrl();
    }, [documentoData]);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch documento data
                const responseDocumento = await getDocumento(`?vehiculo_id=${vehiculoId}&tipo_documento=${docType}`);
                if (responseDocumento.status === 200 && responseDocumento.data.length > 0) {
                    setDocumentoData(responseDocumento.data[0]);
                    setFechaExpedicion(responseDocumento.data[0].fecha_expedicion || '');
                } else {
                    setDocumentoData(null);
                    setFechaExpedicion('');
                }

                // Fetch vehicle data to get the plate
                const responseVehiculo = await getVehiculo(vehiculoId);
                if (responseVehiculo.status === 200 && responseVehiculo.data) {
                    setVehiculoPlaca(responseVehiculo.data.placa); // Asumiendo que 'placa' es el número de placa
                } else {
                    setVehiculoPlaca(''); // Manejar según sea necesario
                }
            } catch (error) {
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [vehiculoId, docType, isModalOpen]);

    useEffect(() => {
        if (documentoData && documentoData.vista_previa) {
            console.log("Vista Previa URL:", documentoData.vista_previa);
        }
    }, [documentoData]);

    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setBlobUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            toast.error('Solo se permiten documentos en formato PDF.', { position: 'bottom-right' });
        }
    };

    const handleCreateOrUpdate = async () => {
        if (!fechaExpedicion) {
            toast.error('La fecha de expedición es requerida.', { position: 'bottom-right' });
            return;
        }

        const formData = new FormData();
        formData.append('vehiculo_id', vehiculoId);
        formData.append('tipo_documento', docType);
        formData.append('fecha_expedicion', fechaExpedicion);
        if (file) formData.append('vista_previa', file);

        try {
            if (documentoData) {
                await updateDocumento(documentoData.id, formData);
                toast.success('Documento actualizado correctamente.', { position: 'bottom-right' });
            } else {
                await createDocumento(formData);
                toast.success('Documento creado correctamente.', { position: 'bottom-right' });
            }
            setIsModalOpen(false);
            // Refrescar los datos después de la actualización/creación
            setLoading(true);
            const responseDocumento = await getDocumento(`?vehiculo_id=${vehiculoId}&tipo_documento=${docType}`);
            if (responseDocumento.status === 200 && responseDocumento.data.length > 0) {
                setDocumentoData(responseDocumento.data[0]);
                setFechaExpedicion(responseDocumento.data[0].fecha_expedicion || '');
            } else {
                setDocumentoData(null);
                setFechaExpedicion('');
            }

            const responseVehiculo = await getVehiculo(vehiculoId);
            if (responseVehiculo.status === 200 && responseVehiculo.data) {
                setVehiculoPlaca(responseVehiculo.data.placa);
            } else {
                setVehiculoPlaca('');
            }
            setLoading(false);
            setFile(null); // Resetear el archivo seleccionado
        } catch (error) {
            console.error(error);
            toast.error('Error al crear/actualizar el documento.', { position: 'bottom-right' });
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!documentoData) {
            toast.error('No hay documento para eliminar.', { position: 'bottom-right' });
            return;
        }
        try {
            await deleteDocumento(documentoData.id);
            setDocumentoData(null);
            toast.success('Documento eliminado correctamente.', { position: 'bottom-right' });
            // Actualizar vehiculoPlaca si es necesario
        } catch (error) {
            toast.error('Error al eliminar el documento.', { position: 'bottom-right' });
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        console.log("PDF cargado con", numPages, "páginas");
        setNumPages(numPages);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-100">
                <Navigation title="Detalles del Documento" />
                <div className="text-center py-8">Cargando...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-gray-100">
                <Navigation title="Detalles del Documento" />
                <div className="text-center py-8 text-red-500">{error}</div>
                <Footer />
            </div>
        );
    }


    return (
        <div className="min-h-screen w-full bg-gray-100">
            <Navigation title="Detalles del Documento" />
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-extrabold text-slate-950 mb-8 text-center font-poppins mt-12">
                    Detalles del Documento - {docType}
                </h1>
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 font-poppins">
                            Vehículo: {documentoData ? documentoData.vehiculo : 'Documento no agregado'}
                        </h2>
                        <p className="text-sm font-mono text-gray-700">
                            Tipo de Documento: {docType}
                        </p>
                        <p className="text-sm font-mono text-gray-700">
                            Fecha de Expedición: {documentoData ? documentoData.fecha_expedicion : 'Documento no agregado'}
                        </p>
                        <p className="text-sm font-mono text-gray-700">
                            Fecha de Expiración: {documentoData ? documentoData.fecha_expiracion : 'Documento no agregado'}
                        </p>
                        <div className={`p-4 rounded-lg text-white text-center font-bold ${documentoData?.estado === 'Vigente' ? 'bg-green-500' : (documentoData?.estado === 'Vencido' ? 'bg-red-500' : 'bg-gray-500')}`}>
                            Estado: {documentoData ? documentoData.estado : 'Documento no agregado'}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        {documentoData && documentoData.vista_previa ? (
                            <div className="flex justify-center items-center w-full h-96">
                                <Document
                                    file={blobUrl || documentoData.vista_previa}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={(error) => console.error("Error al cargar el PDF:", error)}
                                    className="max-w-full h-full rounded-lg border-2 border-gray-300 shadow-md overflow-auto"
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={400} />
                                    ))}
                                </Document>
                            </div>
                        ) : (
                            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                                <span className="text-gray-500">Documento no agregado</span>
                            </div>
                        )}
                    </div>

                </div>
                <div className="flex justify-center mt-8 space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!!documentoData}
                        className={`${documentoData ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                            } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-300`}
                    >
                        Crear Documento
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!documentoData}
                        className={`${!documentoData ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-700'
                            } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-yellow-300`}
                    >
                        Actualizar Documento
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!documentoData}
                        className={`${!documentoData ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-700'
                            } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-red-300`}
                    >
                        Eliminar Documento
                    </button>
                </div>
            </div>
            <Footer />

            {/* Modal para crear/actualizar documento */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Formulario de Documento"
                className="bg-gray-800 p-8 rounded-3xl shadow-xl max-w-2xl mx-auto outline-none w-11/12 md:w-3/4 lg:w-1/2 overflow-auto max-h-screen flex flex-col"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <h2 className="text-2xl font-bold mb-4 text-white">
                    {documentoData ? 'Actualizar Documento' : 'Crear Documento'}
                </h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdate(); }} className="flex-1 flex flex-col">
                    {/* Agrupar campos horizontalmente en pantallas grandes */}
                    <div className="flex flex-col lg:flex-row lg:space-x-4">
                        {/* Campo de Vehículo (Placa) */}
                        <div className="mb-4 flex-1">
                            <label className="block text-white text-base font-semibold mb-1" htmlFor="vehiculoPlaca">
                                Vehículo (Placa)
                            </label>
                            <input
                                type="text"
                                id="vehiculoPlaca"
                                value={documentoData ? documentoData.vehiculo : vehiculoPlaca}
                                readOnly
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-300 bg-gray-700 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Campo de Tipo de Documento */}
                        <div className="mb-4 flex-1">
                            <label className="block text-white text-base font-semibold mb-1" htmlFor="tipoDocumento">
                                Tipo de Documento
                            </label>
                            <input
                                type="text"
                                id="tipoDocumento"
                                value={docType}
                                readOnly
                                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-300 bg-gray-700 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Campo de Fecha de Expedición */}
                    <div className="mb-4">
                        <label className="block text-white text-base font-semibold mb-1" htmlFor="fechaExpedicion">
                            Fecha de Expedición
                        </label>
                        <input
                            type="date"
                            id="fechaExpedicion"
                            value={fechaExpedicion}
                            onChange={(e) => setFechaExpedicion(e.target.value)}
                            className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Campo de Subida de Archivo */}
                    <div className="mb-4">
                        <label className="block text-white text-base font-semibold mb-1" htmlFor="file">
                            Subir documento (PDF solamente)
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-blue-500 rounded-2xl cursor-pointer hover:bg-gray-700">
                            <div className="flex flex-col items-center justify-center pt-7">
                                <svg
                                    className="w-8 h-8 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16l-4-4m0 0l4-4m-4 4h18M13 5l7 7-7 7"
                                    />
                                </svg>
                                <p className="text-sm text-white pt-1 tracking-wider">
                                    Seleccionar archivo
                                </p>
                            </div>
                            <input
                                type="file"
                                id="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {file && (
                            <p className="text-white mt-2 text-sm">
                                Archivo seleccionado: {file.name}
                            </p>
                        )}
                        {/* Mostrar enlace para ver el archivo actual si no se selecciona uno nuevo */}
                        {documentoData && documentoData.vista_previa && !file && (
                            <p className="text-white mt-2 text-sm">
                                Archivo actual: <a href={documentoData.vista_previa} target="_blank" rel="noopener noreferrer" className="underline">Ver PDF</a>
                            </p>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end space-x-4 mt-auto">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            {documentoData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default DocumentoVehiculo;

