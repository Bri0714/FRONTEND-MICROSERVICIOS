// src/pages/EstudianteActualizarForm.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getEstudiante, updateEstudiante } from '../api/estudiantes'; // Importar las funciones de la API
import { getAllInstituciones } from '../api/instituciones.api';
import { getAllRutas } from '../api/rutas.api';
import { toast } from 'react-hot-toast';
import { Footer } from '../components/footer';

export function EstudianteActualizarForm() {
    const { id } = useParams(); // Obtener el ID del estudiante desde los parámetros de la ruta
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        reset,
    } = useForm();

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [instituciones, setInstituciones] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [selectedInstitucion, setSelectedInstitucion] = useState(null);
    const [acudienteData, setAcudienteData] = useState({});
    const [showTerminos, setShowTerminos] = useState(false);

    const aceptaTerminos = watch('acepta_terminos', false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [institucionesRes, rutasRes, estudianteRes] = await Promise.all([
                    getAllInstituciones(),
                    getAllRutas(),
                    getEstudiante(id),
                ]);

                setInstituciones(institucionesRes.data);
                setRutas(rutasRes.data);

                const estudiante = estudianteRes.data;

                // Prellenar el formulario con los datos del estudiante
                reset({
                    acudiente_nombre: estudiante.acudiente.acudiente_nombre,
                    acudiente_apellido: estudiante.acudiente.acudiente_apellido,
                    acudiente_parentesco: estudiante.acudiente.acudiente_parentesco,
                    acudiente_telefono: estudiante.acudiente.acudiente_telefono,
                    estudiante_nombre: estudiante.estudiante_nombre,
                    estudiante_apellido: estudiante.estudiante_apellido,
                    estudiante_edad: estudiante.estudiante_edad,
                    estudiante_curso: estudiante.estudiante_curso,
                    estudiante_direccion: estudiante.estudiante_direccion,
                    estudiante_fecha_ingreso_ruta: estudiante.estudiante_fecha_ingreso_ruta,
                    pago_ruta: estudiante.pago_ruta.toString().replace('.', ','), // Convertir a string y reemplazar punto por coma si es necesario
                    colegio_id: estudiante.colegio_id,
                    ruta_id: estudiante.ruta_id,
                });

                setSelectedInstitucion(estudiante.colegio_id);
                setAcudienteData(estudiante.acudiente);

                setCurrentStep(2); // Comenzar en el paso 2 ya que ya tenemos los datos del acudiente
            } catch (error) {
                toast.error('Error al cargar los datos del estudiante', {
                    position: 'bottom-right',
                });
            }
        }
        fetchData();
    }, [id, reset]);

    // Función para procesar y mostrar los mensajes de error
    const handleErrorMessages = (errorData) => {
        for (const key in errorData) {
            const messages = errorData[key];
            if (Array.isArray(messages)) {
                messages.forEach((message) => {
                    toast.error(message, { position: 'bottom-right' });
                });
            } else if (typeof messages === 'object') {
                handleErrorMessages(messages);
            } else {
                toast.error(String(messages), { position: 'bottom-right' });
            }
        }
    };

    const onSubmit = async (data) => {
        if (currentStep === 1) {
            // Validar datos del Acudiente y pasar al siguiente paso
            const acudiente = {
                acudiente_nombre: data.acudiente_nombre,
                acudiente_apellido: data.acudiente_apellido,
                acudiente_parentesco: data.acudiente_parentesco,
                acudiente_telefono: data.acudiente_telefono,
            };
            setAcudienteData(acudiente);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validar aceptación de términos
            if (!data.acepta_terminos) {
                setError('acepta_terminos', {
                    type: 'manual',
                    message: 'Debe aceptar los términos y condiciones para continuar.',
                });
                return;
            }
            // Actualizar Estudiante
            try {
                setIsLoading(true);
                const formData = new FormData();

                // Agregar datos del Acudiente con notación de puntos
                formData.append('acudiente.acudiente_nombre', data.acudiente_nombre);
                formData.append('acudiente.acudiente_apellido', data.acudiente_apellido);
                formData.append('acudiente.acudiente_parentesco', data.acudiente_parentesco);
                formData.append('acudiente.acudiente_telefono', data.acudiente_telefono);

                // Agregar datos del Estudiante
                formData.append('colegio_id', data.colegio_id);
                formData.append('ruta_id', data.ruta_id);
                formData.append('estudiante_nombre', data.estudiante_nombre);
                formData.append('estudiante_apellido', data.estudiante_apellido);
                formData.append('estudiante_edad', data.estudiante_edad);
                formData.append('estudiante_curso', data.estudiante_curso);
                formData.append('estudiante_direccion', data.estudiante_direccion);
                formData.append('estudiante_fecha_ingreso_ruta', data.estudiante_fecha_ingreso_ruta);

                // Procesar pago_ruta para formato correcto
                let pagoRutaValue = data.pago_ruta;
                if (typeof pagoRutaValue === 'string') {
                    // Remover espacios y separadores de miles
                    pagoRutaValue = pagoRutaValue.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
                }
                formData.append('pago_ruta', pagoRutaValue);

                if (data.estudiante_foto && data.estudiante_foto[0]) {
                    formData.append('estudiante_foto', data.estudiante_foto[0]);
                }

                await updateEstudiante(id, formData);
                toast.success('Estudiante actualizado exitosamente', {
                    position: 'bottom-right',
                });
                navigate('/estudiantes');
            } catch (error) {
                if (error.response && error.response.data) {
                    handleErrorMessages(error.response.data);
                } else {
                    toast.error('Error al actualizar el estudiante', {
                        position: 'bottom-right',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className="flex flex-col items-center w-full px-4"
            style={{ backgroundColor: '#ffffff25' }}
        >
            <div className="w-full max-w-3xl mt-24 mb-24">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-800 p-6 rounded-3xl shadow-xl w-full"
                >
                    {/* Indicadores de pasos */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {/* Paso 1 */}
                            <div className="flex flex-col items-center w-1/2">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}
                                >
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">Acudiente</span>
                            </div>
                            {/* Línea */}
                            <div
                                className={`flex-auto border-t-2 mx-2 ${currentStep > 1 ? 'border-blue-500' : 'border-gray-300'
                                    }`}
                            ></div>
                            {/* Paso 2 */}
                            <div className="flex flex-col items-center w-1/2">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}
                                >
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">Estudiante</span>
                            </div>
                        </div>
                    </div>

                    {/* Paso 1: Acudiente */}
                    {currentStep === 1 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="acudiente_nombre"
                                >
                                    Nombre del Acudiente
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="acudiente_nombre"
                                    type="text"
                                    placeholder="Nombre del Acudiente"
                                    {...register('acudiente_nombre', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.acudiente_nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acudiente_nombre.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="acudiente_apellido"
                                >
                                    Apellido del Acudiente
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="acudiente_apellido"
                                    type="text"
                                    placeholder="Apellido del Acudiente"
                                    {...register('acudiente_apellido', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.acudiente_apellido && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acudiente_apellido.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="acudiente_parentesco"
                                >
                                    Parentesco
                                </label>
                                <select
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="acudiente_parentesco"
                                    {...register('acudiente_parentesco', {
                                        required: 'Este campo es requerido',
                                    })}
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Madre">Madre</option>
                                    <option value="Tio">Tío</option>
                                    <option value="Abuelo">Abuelo</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {errors.acudiente_parentesco && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acudiente_parentesco.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="acudiente_telefono"
                                >
                                    Teléfono del Acudiente
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="acudiente_telefono"
                                    type="tel"
                                    placeholder="Teléfono del Acudiente"
                                    {...register('acudiente_telefono', {
                                        required: 'Este campo es requerido',
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Ingrese un número de teléfono válido',
                                        },
                                    })}
                                />
                                {errors.acudiente_telefono && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acudiente_telefono.message}
                                    </span>
                                )}
                            </div>

                            {/* Botón "Siguiente" */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-all duration-300 ease-in-out transform ${isLoading
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:-translate-y-1 hover:scale-105'
                                        } focus:outline-none focus:ring-4 focus:ring-blue-300`}
                                >
                                    {isLoading ? 'Cargando...' : 'Siguiente'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Paso 2: Estudiante */}
                    {currentStep === 2 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_nombre"
                                >
                                    Nombre del Estudiante
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_nombre"
                                    type="text"
                                    placeholder="Nombre del Estudiante"
                                    {...register('estudiante_nombre', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.estudiante_nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_nombre.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_apellido"
                                >
                                    Apellido del Estudiante
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_apellido"
                                    type="text"
                                    placeholder="Apellido del Estudiante"
                                    {...register('estudiante_apellido', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.estudiante_apellido && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_apellido.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_edad"
                                >
                                    Edad del Estudiante
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_edad"
                                    type="number"
                                    placeholder="Edad del Estudiante"
                                    {...register('estudiante_edad', {
                                        required: 'Este campo es requerido',
                                        min: {
                                            value: 1,
                                            message: 'La edad debe ser mayor a 0',
                                        },
                                    })}
                                />
                                {errors.estudiante_edad && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_edad.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_curso"
                                >
                                    Curso del Estudiante
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_curso"
                                    type="text"
                                    placeholder="Curso del Estudiante"
                                    {...register('estudiante_curso', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.estudiante_curso && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_curso.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Institución */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="colegio_id"
                                >
                                    Institución
                                </label>
                                <select
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="colegio_id"
                                    {...register('colegio_id', {
                                        required: 'Debe seleccionar una institución',
                                    })}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setSelectedInstitucion(selectedId);
                                    }}
                                >
                                    <option value="">Seleccione una institución</option>
                                    {instituciones.map((institucion) => (
                                        <option key={institucion.id} value={institucion.id}>
                                            {institucion.institucion_nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.colegio_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.colegio_id.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Ruta */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="ruta_id"
                                >
                                    Ruta
                                </label>
                                <select
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="ruta_id"
                                    {...register('ruta_id', {
                                        required: 'Debe seleccionar una ruta',
                                    })}
                                >
                                    <option value="">Seleccione una ruta</option>
                                    {rutas
                                        .filter((ruta) =>
                                            selectedInstitucion
                                                ? ruta.instituciones_ids.includes(
                                                    parseInt(selectedInstitucion)
                                                )
                                                : true
                                        )
                                        .map((ruta) => (
                                            <option key={ruta.id} value={ruta.id}>
                                                {ruta.ruta_nombre}
                                            </option>
                                        ))}
                                </select>
                                {errors.ruta_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.ruta_id.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_direccion"
                                >
                                    Dirección del Estudiante
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_direccion"
                                    type="text"
                                    placeholder="Dirección del Estudiante"
                                    {...register('estudiante_direccion', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.estudiante_direccion && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_direccion.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Pago de la Ruta */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="pago_ruta"
                                >
                                    Pago de la Ruta
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="pago_ruta"
                                    type="text"
                                    placeholder="Ejemplo: 250.000"
                                    {...register('pago_ruta', {
                                        required: 'Este campo es requerido',
                                        pattern: {
                                            value: /^[0-9.,]+$/,
                                            message: 'Ingrese un monto válido',
                                        },
                                    })}
                                />
                                {errors.pago_ruta && (
                                    <span className="text-red-500 text-sm">
                                        {errors.pago_ruta.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Fecha de Ingreso a la Ruta */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_fecha_ingreso_ruta"
                                >
                                    Fecha de Ingreso a la Ruta
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="estudiante_fecha_ingreso_ruta"
                                    type="date"
                                    {...register('estudiante_fecha_ingreso_ruta', {
                                        required: 'Este campo es requerido',
                                    })}
                                />
                                {errors.estudiante_fecha_ingreso_ruta && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_fecha_ingreso_ruta.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Foto del Estudiante */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="estudiante_foto"
                                >
                                    Foto del Estudiante (PNG)
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center w-full h-32 border-4 border-dashed border-blue-500 rounded-2xl cursor-pointer hover:bg-gray-700">
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
                                            className="hidden"
                                            id="estudiante_foto"
                                            type="file"
                                            accept="image/png"
                                            {...register('estudiante_foto', {
                                                validate: {
                                                    isPng: (files) => {
                                                        if (files.length > 0) {
                                                            const file = files[0];
                                                            if (file.type !== 'image/png') {
                                                                return 'Solo se permiten imágenes en formato PNG.';
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                },
                                            })}
                                        />
                                    </label>
                                </div>
                                {errors.estudiante_foto && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estudiante_foto.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Términos y Condiciones */}
                            <div className="mb-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="acepta_terminos"
                                            type="checkbox"
                                            {...register('acepta_terminos')}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2 text-sm w-full">
                                        <button
                                            type="button"
                                            onClick={() => setShowTerminos(!showTerminos)}
                                            className="font-medium text-white focus:outline-none"
                                        >
                                            Acepto los{' '}
                                            <span className="text-blue-400 underline cursor-pointer">
                                                términos y condiciones
                                            </span>
                                        </button>
                                        {showTerminos && (
                                            <div className="mt-2 bg-gray-700 p-3 rounded-lg">
                                                <p className="text-gray-300">
                                                    Declaro que la información proporcionada es verídica y
                                                    que no infringe derechos de autor de terceros. Estoy
                                                    consciente de las leyes vigentes en Bogotá, Colombia,
                                                    que prohíben el uso no autorizado de imágenes, fotos o
                                                    logos de terceros.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.acepta_terminos && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acepta_terminos.message}
                                    </span>
                                )}
                            </div>

                            {/* Botones "Atrás" y "Actualizar Estudiante" */}
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !aceptaTerminos}
                                    className={`${aceptaTerminos
                                            ? 'bg-blue-500 hover:bg-blue-700'
                                            : 'bg-gray-500 cursor-not-allowed'
                                        } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform ${aceptaTerminos ? 'hover:-translate-y-1 hover:scale-105' : ''
                                        } focus:outline-none focus:ring-4 focus:ring-blue-300`}
                                >
                                    {isLoading ? 'Actualizando...' : 'Actualizar Estudiante'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default EstudianteActualizarForm;
