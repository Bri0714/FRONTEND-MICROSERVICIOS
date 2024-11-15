// src/pages/AdministracionRutas.jsx

import React, { useEffect, useState } from "react";
import { getAllRutas, deleteRuta } from "../api/rutas.api";
import { getAllVehiculos } from "../api/vehiculos";
import { getAllConductores } from "../api/conductores";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/footer";
import { FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import Pagination from "../components/Pagination";


export function AdministracionRutas() {
    const [rutas, setRutas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("ruta_nombre"); // Valor por defecto
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                // Obtener todas las rutas, vehículos y conductores simultáneamente
                const [rutasRes, vehiculosRes, conductoresRes] = await Promise.all([
                    getAllRutas(),
                    getAllVehiculos(),
                    getAllConductores(),
                ]);

                console.log("Rutas:", rutasRes.data);
                console.log("Vehículos:", vehiculosRes.data);
                console.log("Conductores:", conductoresRes.data);

                const rutasData = rutasRes.data;
                const vehiculosData = vehiculosRes.data;
                const conductoresData = conductoresRes.data;

                // Combinar los datos
                const combined = rutasData.map((ruta) => {
                    // Encontrar el vehículo asociado a la ruta
                    const vehiculo = vehiculosData.find(
                        (veh) => veh.ruta_id === ruta.id
                    );

                    // Encontrar el conductor asociado al vehículo usando la placa
                    const conductor = vehiculo
                        ? conductoresData.find(
                            (cond) => cond.vehiculo === vehiculo.vehiculo_placa
                        )
                        : null;

                    console.log("Ruta:", ruta);
                    console.log("Vehículo asociado:", vehiculo);
                    console.log("Conductor asociado:", conductor);

                    return {
                        id: ruta.id,
                        nombre_ruta: ruta.ruta_nombre || "N/A",
                        // Mapear el estado de la ruta basado en 'activa'
                        estado_ruta: ruta.activa ? "Activo" : "Inactivo",
                        vehiculo: vehiculo
                            ? {
                                placa: vehiculo.vehiculo_placa || "N/A",
                                marca: vehiculo.vehiculo_marca || "N/A",
                                modelo: vehiculo.vehiculo_modelo || "N/A",
                            }
                            : {
                                placa: "N/A",
                                marca: "N/A",
                                modelo: "N/A",
                            },
                        conductor: conductor
                            ? {
                                nombre: `${conductor.nombre} ${conductor.apellido}` || "N/A",
                                foto: conductor.foto || "N/A",
                                // Mapear el estado del conductor basado en 'licencia_activa'
                                estado_conductor: conductor.licencia_activa ? "Activo" : "Inactivo",
                                fecha_expiracion_licencia: conductor.fecha_expiracion || "N/A",
                            }
                            : {
                                nombre: "N/A",
                                foto: null,
                                estado_conductor: "N/A",
                            },
                    };
                });

                console.log("Datos Combinados:", combined);

                setRutas(rutasData);
                setVehiculos(vehiculosData);
                setConductores(conductoresData);
                setCombinedData(combined);
                setFilteredData(combined);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        }

        loadData();

        // Configurar un intervalo para actualizar los datos cada 24 horas (86400000 ms)
        const intervalId = setInterval(() => {
            loadData();
        }, 900000); // Cada 5 minutos (300000 ms)

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    // Filtrar las rutas basadas en el término de búsqueda y la opción de filtro
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === "") {
            setFilteredData(combinedData);
        } else {
            const filtered = combinedData.filter((ruta) => {
                switch (filterOption) {
                    case "nombre_conductor":
                        return ruta.conductor.nombre
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "placa":
                        return ruta.vehiculo.placa
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "marca":
                        return ruta.vehiculo.marca
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "estado_ruta":
                        return ruta.estado_ruta
                            .toLowerCase() === value.toLowerCase();
                    case "estado_conductor":
                        return ruta.conductor.estado_conductor
                            .toLowerCase() === value.toLowerCase();
                    case "fecha_expiracion_licencia":
                        return ruta.conductor.fecha_expiracion_licencia
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "modelo":
                        return ruta.vehiculo.modelo
                            .toString()
                            .includes(value.toLowerCase());
                    case "ruta_nombre":
                    default:
                        return ruta.nombre_ruta
                            .toLowerCase()
                            .includes(value.toLowerCase());
                }
            });
            setFilteredData(filtered);
        }
    };

    // Manejar el cambio en la opción de filtrado
    const handleFilterOptionChange = (e) => {
        setFilterOption(e.target.value);
        setSearchTerm(""); // Resetear el término de búsqueda al cambiar el filtro
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcular los índices para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Manejar el filtrado avanzado cuando cambia la opción de filtro o el término de búsqueda
    useEffect(() => {
        handleAdvancedFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOption, searchTerm]);


    const handleAdvancedFilter = () => {
        if (searchTerm === "") {
            setFilteredData(combinedData);
            return;
        }

        const filtered = combinedData.filter((ruta) => {
            switch (filterOption) {
                case "nombre_conductor":
                    return ruta.conductor.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "placa":
                    return ruta.vehiculo.placa
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "marca":
                    return ruta.vehiculo.marca
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "estado_ruta":
                    return ruta.estado_ruta
                        .toLowerCase() === searchTerm.toLowerCase();
                case "estado_conductor":
                    return ruta.conductor.estado_conductor
                        .toLowerCase() === searchTerm.toLowerCase();
                case "fecha_expiracion_licencia":
                    return ruta.conductor.fecha_expiracion_licencia
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "modelo":
                    return ruta.vehiculo.modelo
                        .toString()
                        .includes(searchTerm.toLowerCase());
                case "ruta_nombre":
                default:
                    return ruta.nombre_ruta
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
            }
        });
        setFilteredData(filtered);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '<h2 class="text-blue-500 font-bold">Aviso</h2>',
            html: '<p class="text-gray-700">¿Estás seguro de eliminar esta ruta? Si la eliminas, se eliminarán el vehículo asociado a la ruta, el conductor asociado al vehículo, y los estudiantes asociados a esa ruta sin importar la institución.</p>',
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2',
                cancelButton: 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2',
                popup: 'bg-blue-50 p-6 rounded-lg shadow-lg',
            },
            confirmButtonText: 'Sí, estoy seguro',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRuta(id);
                    const updatedData = combinedData.filter((ruta) => ruta.id !== id);
                    setCombinedData(updatedData);
                    setFilteredData(updatedData);
                    Swal.fire({
                        title: '<h2 class="text-green-500 font-bold">Eliminado</h2>',
                        html: '<p class="text-gray-700">La ruta y los elementos asociados han sido eliminados exitosamente.</p>',
                        icon: 'success',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
                            popup: 'bg-green-50 p-6 rounded-lg shadow-lg',
                        },
                    });
                } catch (error) {
                    console.error("Error al eliminar la ruta:", error);
                    Swal.fire({
                        title: '<h2 class="text-red-500 font-bold">Error</h2>',
                        html: '<p class="text-gray-700">Hubo un error al intentar eliminar la ruta. Por favor, inténtalo de nuevo.</p>',
                        icon: 'error',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
                            popup: 'bg-red-50 p-6 rounded-lg shadow-lg',
                        },
                    });
                }
            }
        });
    };

    // Actualizar una ruta (redireccionar)
    const handleUpdate = (id) => {
        navigate(`/rutas/${id}/editar`); // Asegúrate de tener esta ruta configurada
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col pb-20">
            <h1 className="text-2xl font-bold mb-8 text-center">Administración de Rutas</h1>

            {/* Barra de búsqueda y opciones de filtrado */}
            <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative w-full max-w-md">
                    {filterOption === "estado_ruta" || filterOption === "estado_conductor" ? (
                        <select
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border border-gray-300 rounded-lg py-2 px-4 text-black w-full"
                            style={{ color: "black" }}
                        >
                            <option value="">Selecciona una opción...</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder={`Buscar por ${filterOption === "ruta_nombre" ? "Nombre de Ruta" : "otro criterio"}...`}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-black w-full"
                                style={{ color: "black" }}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="filter" className="text-black">
                        Filtrar por:
                    </label>
                    <select
                        id="filter"
                        value={filterOption}
                        onChange={handleFilterOptionChange}
                        className="border border-gray-300 rounded-lg py-2 px-3 text-black"
                    >
                        <option value="ruta_nombre">Nombre de Ruta</option>
                        <option value="nombre_conductor">Nombre del Conductor</option>
                        <option value="placa">Placa del Vehículo</option>
                        <option value="marca">Marca del Vehículo</option>
                        <option value="modelo">Modelo del Vehículo</option>
                        <option value="estado_conductor">Estado del Conductor</option>
                        <option value="estado_ruta">Estado de la Ruta</option>
                    </select>
                </div>
            </div>

            {/* Tabla de Rutas */}
            <div className="flex-grow flex items-center justify-center overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 border-b text-black">Nombre de la Ruta</th>
                            <th className="py-2 border-b text-black">Placa del Vehículo</th>
                            <th className="py-2 border-b text-black">Marca</th>
                            <th className="py-2 border-b text-black">Modelo</th>
                            <th className="py-2 border-b text-black">Estado de la Ruta</th>
                            <th className="py-2 border-b text-black">Nombre del Conductor</th>
                            <th className="py-2 border-b text-black">Foto del Conductor</th>
                            <th className="py-2 border-b text-black">Fecha expiración Licencia</th>
                            <th className="py-2 border-b text-black">Estado del Conductor</th>
                            <th className="py-2 border-b text-black">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((ruta, index) => {
                                console.log("Ruta en renderizado:", ruta); // Depuración
                                return (
                                    <tr key={ruta.id || index} className="transition-all duration-300 ease-in-out hover:bg-gray-100">
                                        <td className="py-2 border-b text-center text-black">{ruta.nombre_ruta}</td>
                                        <td className="py-2 border-b text-center text-black">{ruta.vehiculo.placa}</td>
                                        <td className="py-2 border-b text-center text-black">{ruta.vehiculo.marca}</td>
                                        <td className="py-2 border-b text-center text-black">{ruta.vehiculo.modelo}</td>
                                        <td className="py-2 border-b text-center">
                                            <span className={`px-2 py-1 rounded ${ruta.estado_ruta === "Activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                                {ruta.estado_ruta}
                                            </span>
                                        </td>
                                        <td className="py-2 border-b text-center text-black">{ruta.conductor.nombre}</td>
                                        <td className="py-2 border-b text-center text-black">
                                            {ruta.conductor.foto && ruta.conductor.foto !== "N/A" ? (
                                                <img
                                                    src={ruta.conductor.foto}
                                                    alt={ruta.conductor.nombre}
                                                    className="w-12 h-12 object-cover rounded-full mx-auto"
                                                />
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {ruta.conductor.fecha_expiracion_licencia}
                                        </td>
                                        <td className="py-2 border-b text-center">
                                            <span className={`px-2 py-1 rounded ${ruta.conductor.estado_conductor === "Activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                                {ruta.conductor.estado_conductor}
                                            </span>
                                        </td>
                                        <td className="py-2 border-b text-center">
                                            <button
                                                onClick={() => navigate(`/rutas/${ruta.id}`)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-1 rounded mr-2 mb-2"
                                            >
                                                Actualizar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ruta.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-4 text-center text-black">
                                    No se encontraron rutas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginador */}
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            <Footer />
        </div>
    );
}
