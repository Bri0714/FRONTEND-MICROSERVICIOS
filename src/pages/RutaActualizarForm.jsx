// src/pages/RutaActualizarForm.jsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { updateRuta, getRuta } from "../api/rutas.api";
import { updateVehiculo, getVehiculo } from "../api/vehiculos";
import { updateConductor, getConductor } from "../api/conductores";
import { getAllInstituciones } from "../api/instituciones.api";
import { toast } from "react-hot-toast";
import { Footer } from "../components/footer";

export function RutaActualizarForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID de la ruta a actualizar
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        setValue,
    } = useForm();
    const [currentStep, setCurrentStep] = useState(1);
    const [instituciones, setInstituciones] = useState([]);
    const [selectedInstituciones, setSelectedInstituciones] = useState([]);
    const [rutaId, setRutaId] = useState(null);
    const [vehiculoId, setVehiculoId] = useState(null);
    const [vehiculoPlaca, setVehiculoPlaca] = useState("");
    const [monitoraId, setMonitoraId] = useState(null);
    const [conductorId, setConductorId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showInstitucionesDropdown, setShowInstitucionesDropdown] = useState(false);
    const [showTerminosVehiculo, setShowTerminosVehiculo] = useState(false);
    const [showTerminosConductor, setShowTerminosConductor] = useState(false);

    const aceptaTerminosVehiculo = watch("acepta_terminos_vehiculo", false);
    const aceptaTerminosConductor = watch("acepta_terminos_conductor", false);

    {/* Obtener los datos de las rutas */}
    useEffect(() => {
        async function fetchRutaData() {
            try {
                setIsLoading(true);
                // Obtener datos de la ruta
                const { data: rutaData } = await getRuta(id);

                // **Depuración: Verificar rutaData**
                console.log("Datos de Ruta:", rutaData);

                setRutaId(rutaData.id);
                setValue("ruta_nombre", rutaData.ruta_nombre);
                setValue("ruta_movil", rutaData.ruta_movil);
                setValue("activa", rutaData.activa);

                // Obtener instituciones asociadas
                const { data: institucionesData } = await getAllInstituciones();
                setInstituciones(institucionesData);
                const institucionesSeleccionadas = institucionesData.filter(inst =>
                    rutaData.instituciones_ids.includes(inst.id)
                );
                setSelectedInstituciones(institucionesSeleccionadas);
            } catch (error) {
                toast.error("Error al cargar los datos de la ruta", {
                    position: "bottom-right",
                });
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRutaData();
    }, [id, setValue]);

    {/* Obtener los datos del vehículo junto con la monitora */}
    useEffect(() => {
        async function fetchVehiculoYMonitoraData() {
            try {
                setIsLoading(true);
                // Obtener datos del vehículo
                const { data: vehiculoData } = await getVehiculo(id);

                // **Depuración: Verificar vehiculoData**
                console.log("Datos de Vehículo:", vehiculoData);

                setVehiculoId(vehiculoData.id);
                setVehiculoPlaca(vehiculoData.vehiculo_placa); // Establecer la placa para el conductor
                setValue("vehiculo_placa", vehiculoData.vehiculo_placa);
                setValue("vehiculo_marca", vehiculoData.vehiculo_marca);
                setValue("vehiculo_modelo", vehiculoData.vehiculo_modelo);
                setValue("vehiculo_capacidad", vehiculoData.vehiculo_capacidad);
                // Agrega más campos del vehículo según sea necesario

                // Verificar y establecer datos de la monitora si existen
                if (vehiculoData.monitora) {
                    const monitoraData = vehiculoData.monitora;
                    console.log("Datos de Monitora:", monitoraData);

                    setMonitoraId(monitoraData.id);
                    setValue("monitora_nombre_completo", monitoraData.nombre_completo);
                    setValue("monitora_edad", monitoraData.edad);
                    setValue("monitora_telefono", monitoraData.telefono);
                    // Agrega más campos de la monitora según sea necesario
                } else {
                    console.warn("No hay datos de monitora asociados al vehículo.");
                    // Opcional: Limpiar campos de monitora si no existen
                    setValue("monitora_nombre_completo", "");
                    setValue("monitora_edad", "");
                    setValue("monitora_telefono", "");
                    // Limpia más campos de la monitora según sea necesario
                }
            } catch (error) {
                toast.error("Error al cargar los datos del vehículo y la monitora", {
                    position: "bottom-right",
                });
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVehiculoYMonitoraData();
    }, [id, setValue]);

    {/* Obtener los datos del conductor */}
    useEffect(() => {
        async function fetchConductorData() {
            try {
                setIsLoading(true);
                // Obtener datos del conductor
                const { data: conductorData } = await getConductor(id);

                // **Depuración: Verificar conductorData**
                console.log("Datos de Conductor:", conductorData);

                setConductorId(conductorData.id);
                setValue("conductor_nombre", conductorData.nombre);
                setValue("conductor_apellido", conductorData.apellido);
                setValue("conductor_edad", conductorData.edad);
                setValue("conductor_telefono", conductorData.telefono);
                setValue("fecha_exp", conductorData.fecha_exp);
                setValue("fecha_expiracion", conductorData.fecha_expiracion);
                setValue("licencia_activa", conductorData.licencia_activa);
                // Agrega más campos según sea necesario
            } catch (error) {
                toast.error("Error al cargar los datos del conductor", {
                    position: "bottom-right",
                });
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchConductorData();
    }, [id, setValue]);

    const toggleInstitucionesDropdown = () => {
        setShowInstitucionesDropdown(!showInstitucionesDropdown);
    };

    const addInstitucion = (institucion) => {
        if (!selectedInstituciones.find((inst) => inst.id === institucion.id)) {
            setSelectedInstituciones([...selectedInstituciones, institucion]);
        }
    };

    const removeInstitucion = (institucion) => {
        setSelectedInstituciones(
            selectedInstituciones.filter((inst) => inst.id !== institucion.id)
        );
    };

    // Función para procesar y mostrar los mensajes de error
    const handleErrorMessages = (errorData) => {
        for (const key in errorData) {
            const messages = errorData[key];
            if (Array.isArray(messages)) {
                messages.forEach((message) => {
                    toast.error(message, { position: "bottom-right" });
                });
            } else if (typeof messages === "object") {
                handleErrorMessages(messages);
            } else {
                toast.error(String(messages), { position: "bottom-right" });
            }
        }
    };

    const onSubmit = async (data) => {
        if (currentStep === 1) {
            // Validar que al menos una institución esté seleccionada
            if (selectedInstituciones.length === 0) {
                setError("instituciones_ids", {
                    type: "manual",
                    message: "Debe seleccionar al menos una institución",
                });
                return;
            }
            // Actualizar Ruta
            try {
                setIsLoading(true);
                const rutaData = {
                    ruta_nombre: data.ruta_nombre,
                    ruta_movil: data.ruta_movil,
                    instituciones_ids: selectedInstituciones.map((inst) => inst.id),
                    activa: data.activa || false,
                };
                await updateRuta(rutaId, rutaData);
                toast.success("Ruta actualizada exitosamente", {
                    position: "bottom-right",
                });
                setCurrentStep(2);
            } catch (error) {
                if (error.response && error.response.data) {
                    handleErrorMessages(error.response.data);
                } else {
                    toast.error("Error al actualizar la ruta", { position: "bottom-right" });
                }
            } finally {
                setIsLoading(false);
            }
        } else if (currentStep === 2) {
            // Validar datos de la Monitora y pasar al siguiente paso
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Validar aceptación de términos
            if (!data.acepta_terminos_vehiculo) {
                setError("acepta_terminos_vehiculo", {
                    type: "manual",
                    message: "Debe aceptar los términos y condiciones para continuar.",
                });
                return;
            }
            // Actualizar Vehículo y Monitora
            try {
                setIsLoading(true);
                const vehiculoData = new FormData();
                vehiculoData.append("vehiculo_placa", data.vehiculo_placa);
                vehiculoData.append("vehiculo_marca", data.vehiculo_marca);
                vehiculoData.append("vehiculo_modelo", data.vehiculo_modelo);
                vehiculoData.append("vehiculo_capacidad", data.vehiculo_capacidad);
                vehiculoData.append("ruta_id", rutaId);

                if (data.vehiculo_imagen && data.vehiculo_imagen[0]) {
                    vehiculoData.append("vehiculo_imagen", data.vehiculo_imagen[0]);
                }

                // Agregar los datos de la monitora como campos anidados
                vehiculoData.append("monitora.nombre_completo", data.monitora_nombre_completo);
                vehiculoData.append("monitora.edad", data.monitora_edad);
                vehiculoData.append("monitora.telefono", data.monitora_telefono);

                await updateVehiculo(vehiculoId, vehiculoData);
                toast.success("Vehículo y Monitora actualizados exitosamente", {
                    position: "bottom-right",
                });
                setCurrentStep(4);
            } catch (error) {
                if (error.response && error.response.data) {
                    handleErrorMessages(error.response.data);
                } else {
                    toast.error("Error al actualizar el vehículo y la monitora", {
                        position: "bottom-right",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        } else if (currentStep === 4) {
            // Validar aceptación de términos
            if (!data.acepta_terminos_conductor) {
                setError("acepta_terminos_conductor", {
                    type: "manual",
                    message: "Debe aceptar los términos y condiciones para continuar.",
                });
                return;
            }
            // Actualizar Conductor
            try {
                setIsLoading(true);
                const conductorData = new FormData();
                conductorData.append("nombre", data.conductor_nombre);
                conductorData.append("apellido", data.conductor_apellido);
                conductorData.append("edad", data.conductor_edad);
                conductorData.append("telefono", data.conductor_telefono);
                conductorData.append("fecha_exp", data.fecha_exp);
                conductorData.append("vehiculo_id", vehiculoId);
                if (data.foto && data.foto[0]) {
                    conductorData.append("foto", data.foto[0]);
                }
                await updateConductor(conductorId, conductorData);
                toast.success("Conductor actualizado exitosamente", {
                    position: "bottom-right",
                });
                navigate("/rutas");
            } catch (error) {
                if (error.response && error.response.data) {
                    handleErrorMessages(error.response.data);
                } else {
                    toast.error("Error al actualizar el conductor", {
                        position: "bottom-right",
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
            style={{ backgroundColor: "#ffffff25" }}
        >
            <div className="w-full max-w-3xl mt-24 mb-24">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-800 p-6 rounded-3xl shadow-xl w-full"
                >
                    {/* Indicadores de pasos mejorados */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {/* Paso 1 */}
                            <div className="flex flex-col items-center w-1/4">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                                        currentStep >= 1
                                            ? "bg-blue-500 border-blue-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">
                                    Ruta
                                </span>
                            </div>
                            {/* Línea */}
                            <div
                                className={`flex-auto border-t-2 mx-2 ${
                                    currentStep > 1 ? "border-blue-500" : "border-gray-300"
                                }`}
                            ></div>
                            {/* Paso 2 */}
                            <div className="flex flex-col items-center w-1/4">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                                        currentStep >= 2
                                            ? "bg-blue-500 border-blue-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">
                                    Monitora
                                </span>
                            </div>
                            {/* Línea */}
                            <div
                                className={`flex-auto border-t-2 mx-2 ${
                                    currentStep > 2 ? "border-blue-500" : "border-gray-300"
                                }`}
                            ></div>
                            {/* Paso 3 */}
                            <div className="flex flex-col items-center w-1/4">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                                        currentStep >= 3
                                            ? "bg-blue-500 border-blue-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">
                                    Vehículo
                                </span>
                            </div>
                            {/* Línea */}
                            <div
                                className={`flex-auto border-t-2 mx-2 ${
                                    currentStep > 3 ? "border-blue-500" : "border-gray-300"
                                }`}
                            ></div>
                            {/* Paso 4 */}
                            <div className="flex flex-col items-center w-1/4">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                                        currentStep >= 4
                                            ? "bg-blue-500 border-blue-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <span className="mt-2 text-white text-sm font-medium">
                                    Conductor
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Paso 1: Ruta */}
                    {currentStep === 1 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="ruta_nombre"
                                >
                                    Nombre de la Ruta
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="ruta_nombre"
                                    type="text"
                                    placeholder="Nombre de la Ruta"
                                    {...register("ruta_nombre", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.ruta_nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.ruta_nombre.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="ruta_movil"
                                >
                                    Número Móvil
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="ruta_movil"
                                    type="number"
                                    placeholder="Número Móvil"
                                    {...register("ruta_movil", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.ruta_movil && (
                                    <span className="text-red-500 text-sm">
                                        {errors.ruta_movil.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo "activa" */}
                            <div className="mb-4 flex items-center">
                                <input
                                    className="mr-2 leading-tight"
                                    id="activa"
                                    type="checkbox"
                                    {...register("activa")}
                                />
                                <label className="text-white font-semibold" htmlFor="activa">
                                    Activa
                                </label>
                            </div>

                            {/* Multi-select de Instituciones con colores corregidos */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="instituciones_ids"
                                >
                                    Instituciones
                                </label>
                                <div className="relative">
                                    <div
                                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                        onClick={toggleInstitucionesDropdown}
                                    >
                                        {selectedInstituciones.length === 0 ? (
                                            <span className="text-gray-400">
                                                Seleccione instituciones
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap">
                                                {selectedInstituciones.map((inst) => (
                                                    <div
                                                        key={inst.id}
                                                        className="flex items-center bg-blue-500 text-white rounded-full px-3 py-1 mr-2 mb-2"
                                                    >
                                                        <span>{inst.nombre}</span>
                                                        <button
                                                            type="button"
                                                            className="ml-2 focus:outline-none"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeInstitucion(inst);
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {showInstitucionesDropdown && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                                            {instituciones.map((institucion) => (
                                                <div
                                                    key={institucion.id}
                                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                                                    onClick={() => addInstitucion(institucion)}
                                                >
                                                    {institucion.nombre}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Campo oculto para manejar la validación */}
                                <input
                                    type="hidden"
                                    {...register("instituciones_ids", {
                                        validate: () => {
                                            if (selectedInstituciones.length === 0) {
                                                return "Debe seleccionar al menos una institución";
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.instituciones_ids && (
                                    <span className="text-red-500 text-sm">
                                        {errors.instituciones_ids.message}
                                    </span>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-all duration-300 ease-in-out transform ${
                                        isLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:-translate-y-1 hover:scale-105"
                                    } focus:outline-none focus:ring-4 focus:ring-blue-300`}
                                >
                                    {isLoading ? "Actualizando..." : "Actualizar Ruta"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Paso 2: Monitora */}
                    {currentStep === 2 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="monitora_nombre_completo"
                                >
                                    Nombre Completo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="monitora_nombre_completo"
                                    type="text"
                                    placeholder="Nombre Completo"
                                    {...register("monitora_nombre_completo", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.monitora_nombre_completo && (
                                    <span className="text-red-500 text-sm">
                                        {errors.monitora_nombre_completo.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="monitora_edad"
                                >
                                    Edad
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="monitora_edad"
                                    type="number"
                                    placeholder="Edad"
                                    {...register("monitora_edad", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.monitora_edad && (
                                    <span className="text-red-500 text-sm">
                                        {errors.monitora_edad.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="monitora_telefono"
                                >
                                    Teléfono
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="monitora_telefono"
                                    type="tel"
                                    placeholder="Teléfono"
                                    {...register("monitora_telefono", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.monitora_telefono && (
                                    <span className="text-red-500 text-sm">
                                        {errors.monitora_telefono.message}
                                    </span>
                                )}
                            </div>

                            {/* Botón "Atrás" y "Siguiente" */}
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
                                    disabled={isLoading}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}

                    {/* Paso 3: Vehículo */}
                    {currentStep === 3 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_placa"
                                >
                                    Placa del Vehículo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="vehiculo_placa"
                                    type="text"
                                    placeholder="Placa del Vehículo"
                                    {...register("vehiculo_placa", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.vehiculo_placa && (
                                    <span className="text-red-500 text-sm">
                                        {errors.vehiculo_placa.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_marca"
                                >
                                    Marca del Vehículo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="vehiculo_marca"
                                    type="text"
                                    placeholder="Marca del Vehículo"
                                    {...register("vehiculo_marca", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.vehiculo_marca && (
                                    <span className="text-red-500 text-sm">
                                        {errors.vehiculo_marca.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_modelo"
                                >
                                    Modelo del Vehículo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="vehiculo_modelo"
                                    type="number"
                                    placeholder="Modelo del Vehículo"
                                    {...register("vehiculo_modelo", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.vehiculo_modelo && (
                                    <span className="text-red-500 text-sm">
                                        {errors.vehiculo_modelo.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_capacidad"
                                >
                                    Capacidad del Vehículo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="vehiculo_capacidad"
                                    type="number"
                                    placeholder="Capacidad del Vehículo"
                                    {...register("vehiculo_capacidad", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.vehiculo_capacidad && (
                                    <span className="text-red-500 text-sm">
                                        {errors.vehiculo_capacidad.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Imagen del Vehículo */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_imagen"
                                >
                                    Imagen del Vehículo (PNG)
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
                                            id="vehiculo_imagen"
                                            type="file"
                                            accept="image/png"
                                            {...register("vehiculo_imagen", {
                                                validate: {
                                                    isPng: (files) => {
                                                        if (files.length > 0) {
                                                            const file = files[0];
                                                            if (file.type !== "image/png") {
                                                                return "Solo se permiten imágenes en formato PNG.";
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                },
                                            })}
                                        />
                                    </label>
                                </div>
                                {errors.vehiculo_imagen && (
                                    <span className="text-red-500 text-sm">
                                        {errors.vehiculo_imagen.message}
                                    </span>
                                )}
                            </div>

                            {/* Campo de Términos y Condiciones */}
                            <div className="mb-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="acepta_terminos_vehiculo"
                                            type="checkbox"
                                            {...register("acepta_terminos_vehiculo")}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2 text-sm w-full">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowTerminosVehiculo(!showTerminosVehiculo)
                                            }
                                            className="font-medium text-white focus:outline-none"
                                        >
                                            Acepto los{" "}
                                            <span className="text-blue-400 underline cursor-pointer">
                                                términos y condiciones
                                            </span>
                                        </button>
                                        {showTerminosVehiculo && (
                                            <div className="mt-2 bg-gray-700 p-3 rounded-lg">
                                                <p className="text-gray-300">
                                                    Declaro que la información proporcionada es verídica y que no infringe derechos de autor de terceros. Estoy consciente de las leyes vigentes en Bogotá, Colombia, que prohíben el uso no autorizado de imágenes, fotos o logos de terceros.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.acepta_terminos_vehiculo && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acepta_terminos_vehiculo.message}
                                    </span>
                                )}
                            </div>

                            {/* Botón "Atrás" y "Guardar Vehículo y Monitora" */}
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !aceptaTerminosVehiculo}
                                    className={`${
                                        aceptaTerminosVehiculo
                                            ? "bg-blue-500 hover:bg-blue-700"
                                            : "bg-gray-500 cursor-not-allowed"
                                    } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform ${
                                        aceptaTerminosVehiculo
                                            ? "hover:-translate-y-1 hover:scale-105"
                                            : ""
                                    } focus:outline-none focus:ring-4 focus:ring-blue-300`}
                                >
                                    {isLoading
                                        ? "Guardando..."
                                        : "Actualizar Vehículo y Monitora"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Paso 4: Conductor */}
                    {currentStep === 4 && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="conductor_nombre"
                                >
                                    Nombre del Conductor
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="conductor_nombre"
                                    type="text"
                                    placeholder="Nombre del Conductor"
                                    {...register("conductor_nombre", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.conductor_nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.conductor_nombre.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="conductor_apellido"
                                >
                                    Apellido del Conductor
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="conductor_apellido"
                                    type="text"
                                    placeholder="Apellido del Conductor"
                                    {...register("conductor_apellido", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.conductor_apellido && (
                                    <span className="text-red-500 text-sm">
                                        {errors.conductor_apellido.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="conductor_edad"
                                >
                                    Edad
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="conductor_edad"
                                    type="number"
                                    placeholder="Edad"
                                    {...register("conductor_edad", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.conductor_edad && (
                                    <span className="text-red-500 text-sm">
                                        {errors.conductor_edad.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="conductor_telefono"
                                >
                                    Teléfono
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="conductor_telefono"
                                    type="tel"
                                    placeholder="Teléfono"
                                    {...register("conductor_telefono", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.conductor_telefono && (
                                    <span className="text-red-500 text-sm">
                                        {errors.conductor_telefono.message}
                                    </span>
                                )}
                            </div>
                            {/* Campo de Imagen */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="foto"
                                >
                                    Foto del Conductor (PNG)
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
                                            id="foto"
                                            type="file"
                                            accept="image/png"
                                            {...register("foto", {
                                                validate: {
                                                    isPng: (files) => {
                                                        if (files.length > 0) {
                                                            const file = files[0];
                                                            if (file.type !== "image/png") {
                                                                return "Solo se permiten imágenes en formato PNG.";
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                },
                                            })}
                                        />
                                    </label>
                                </div>
                                {errors.foto && (
                                    <span className="text-red-500 text-sm">
                                        {errors.foto.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="fecha_exp"
                                >
                                    Fecha de Expedición de Licencia
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="fecha_exp"
                                    type="date"
                                    {...register("fecha_exp", {
                                        required: "Este campo es requerido",
                                    })}
                                />
                                {errors.fecha_exp && (
                                    <span className="text-red-500 text-sm">
                                        {errors.fecha_exp.message}
                                    </span>
                                )}
                            </div>
                            {/* Campo de Vehículo */}
                            <div className="mb-4">
                                <label
                                    className="block text-white text-base font-semibold mb-1"
                                    htmlFor="vehiculo_placa"
                                >
                                    Vehículo
                                </label>
                                <input
                                    className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-black leading-tight"
                                    id="vehiculo_placa"
                                    type="text"
                                    value={vehiculoPlaca}
                                    disabled
                                />
                            </div>

                            {/* Campo de Términos y Condiciones */}
                            <div className="mb-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="acepta_terminos_conductor"
                                            type="checkbox"
                                            {...register("acepta_terminos_conductor")}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2 text-sm w-full">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowTerminosConductor(!showTerminosConductor)
                                            }
                                            className="font-medium text-white focus:outline-none"
                                        >
                                            Acepto los{" "}
                                            <span className="text-blue-400 underline cursor-pointer">
                                                términos y condiciones
                                            </span>
                                        </button>
                                        {showTerminosConductor && (
                                            <div className="mt-2 bg-gray-700 p-3 rounded-lg">
                                                <p className="text-gray-300">
                                                    Declaro que la información proporcionada es verídica y que no infringe derechos de autor de terceros. Estoy consciente de las leyes vigentes en Bogotá, Colombia, que prohíben el uso no autorizado de imágenes, fotos o logos de terceros.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.acepta_terminos_conductor && (
                                    <span className="text-red-500 text-sm">
                                        {errors.acepta_terminos_conductor.message}
                                    </span>
                                )}
                            </div>

                            {/* Botón "Atrás" y "Guardar Conductor" */}
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(3)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !aceptaTerminosConductor}
                                    className={`${
                                        aceptaTerminosConductor
                                            ? "bg-blue-500 hover:bg-blue-700"
                                            : "bg-gray-500 cursor-not-allowed"
                                    } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform ${
                                        aceptaTerminosConductor
                                            ? "hover:-translate-y-1 hover:scale-105"
                                            : ""
                                    } focus:outline-none focus:ring-4 focus:ring-blue-300`}
                                >
                                    {isLoading ? "Guardando..." : "Actualizar Conductor"}
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

export default RutaActualizarForm;

