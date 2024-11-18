// src/pages/EstudiantesList.jsx

import React, { useEffect, useState } from "react";
import {
    getAllEstudiantes,
    deleteEstudiante,
} from "../api/estudiantes";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/footer";
import { FaSearch } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi"; // Nuevo icono para Revisión Pago
import { AiOutlineUser } from "react-icons/ai"; // Icono para cuando no hay foto
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import { Navigation } from "../components/Navigation";

export function EstudiantesList() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("estudiante_nombre");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                // Obtener todos los estudiantes
                const estudiantesRes = await getAllEstudiantes();
                const estudiantesData = estudiantesRes.data;

                console.log("Estudiantes:", estudiantesData);

                setEstudiantes(estudiantesData);
                setFilteredData(estudiantesData);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        }

        loadData();

        // Actualizar datos cada 5 minutos
        const intervalId = setInterval(() => {
            loadData();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

    // Funciones de búsqueda y filtrado
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === "") {
            setFilteredData(estudiantes);
        } else {
            const filtered = estudiantes.filter((estudiante) => {
                switch (filterOption) {
                    case "institucion_nombre":
                        return estudiante.institucion.nombre
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "vehiculo_placa":
                        return estudiante.vehiculo_placa
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    case "estudiante_estado":
                        return (
                            (estudiante.estudiante_estado ? "activo" : "inactivo") ===
                            value.toLowerCase()
                        );
                    case "estudiante_nombre":
                    default:
                        return (
                            `${estudiante.estudiante_nombre} ${estudiante.estudiante_apellido}`
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        );
                }
            });
            setFilteredData(filtered);
        }
    };

    const handleFilterOptionChange = (e) => {
        setFilterOption(e.target.value);
        setSearchTerm("");
        setFilteredData(estudiantes);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        handleAdvancedFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOption, searchTerm]);

    const handleAdvancedFilter = () => {
        if (searchTerm === "") {
            setFilteredData(estudiantes);
            return;
        }

        const filtered = estudiantes.filter((estudiante) => {
            switch (filterOption) {
                case "institucion_nombre":
                    return estudiante.institucion.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "vehiculo_placa":
                    return estudiante.vehiculo_placa
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                case "estudiante_estado":
                    return (
                        (estudiante.estudiante_estado ? "activo" : "inactivo") ===
                        searchTerm.toLowerCase()
                    );
                case "estudiante_nombre":
                default:
                    return (
                        `${estudiante.estudiante_nombre} ${estudiante.estudiante_apellido}`
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    );
            }
        });
        setFilteredData(filtered);
    };

    const handleDelete = async (id, estudiante) => {
        Swal.fire({
            title: '<h2 class="text-blue-500 font-bold">Aviso</h2>',
            html: `<p class="text-gray-700">¿Estás seguro de eliminar al estudiante <strong>${estudiante.estudiante_nombre} ${estudiante.estudiante_apellido}</strong> perteneciente a la institución <strong>${estudiante.institucion.nombre}</strong>, con ruta <strong>${estudiante.ruta.nombre}</strong> y vehículo de placa <strong>${estudiante.vehiculo_placa}</strong>?</p>`,
            icon: "warning",
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2",
                cancelButton:
                    "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2",
                popup: "bg-blue-50 p-6 rounded-lg shadow-lg",
            },
            confirmButtonText: "Sí, estoy seguro",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEstudiante(id);
                    const updatedData = estudiantes.filter(
                        (estudiante) => estudiante.id !== id
                    );
                    setEstudiantes(updatedData);
                    setFilteredData(updatedData);
                    Swal.fire({
                        title: '<h2 class="text-green-500 font-bold">Eliminado</h2>',
                        html:
                            '<p class="text-gray-700">El estudiante ha sido eliminado exitosamente.</p>',
                        icon: "success",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton:
                                "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
                            popup: "bg-green-50 p-6 rounded-lg shadow-lg",
                        },
                    });
                } catch (error) {
                    console.error("Error al eliminar el estudiante:", error);
                    Swal.fire({
                        title: '<h2 class="text-red-500 font-bold">Error</h2>',
                        html:
                            '<p class="text-gray-700">Hubo un error al intentar eliminar al estudiante. Por favor, inténtalo de nuevo.</p>',
                        icon: "error",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton:
                                "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
                            popup: "bg-red-50 p-6 rounded-lg shadow-lg",
                        },
                    });
                }
            }
        });
    };

    // Función para manejar la revisión de pago (actualmente no redirige)
    const handleRevisionPago = (id) => {
        // Por ahora, no hace nada
        // navigate(`/estudiantes/${id}/pagos`);
    };

    // Función para manejar la actualización
    const handleUpdate = (id) => {
        navigate(`/estudiantes/${id}/editar`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navegación */}
            <Navigation />

            {/* Contenedor Principal */}
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col pb-20">
                <h1 className="text-2xl font-bold mb-8 text-center">
                    Administración de Estudiantes
                </h1>

                {/* Barra de búsqueda y opciones de filtrado */}
                <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative w-full max-w-md">
                        {filterOption === "estudiante_estado" ? (
                            <select
                                value={searchTerm}
                                onChange={handleSearch}
                                className="border border-gray-300 rounded-lg py-2 px-4 text-black w-full"
                                style={{ color: "black" }}
                            >
                                <option value="">Selecciona una opción...</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder={`Buscar por ${
                                        filterOption === "estudiante_nombre"
                                            ? "Nombre de Estudiante"
                                            : filterOption === "institucion_nombre"
                                            ? "Nombre de Institución"
                                            : filterOption === "vehiculo_placa"
                                            ? "Placa del Vehículo"
                                            : "otro criterio"
                                    }...`}
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
                            <option value="estudiante_nombre">Nombre de Estudiante</option>
                            <option value="institucion_nombre">Nombre de Institución</option>
                            <option value="vehiculo_placa">Placa del Vehículo</option>
                            <option value="estudiante_estado">Estado del Estudiante</option>
                        </select>
                    </div>
                </div>

                {/* Tabla de Estudiantes */}
                <div className="flex-grow flex items-center justify-center overflow-x-auto">
                    <table className="w-full  bg-white border mx-auto">
                        <thead>
                            <tr>
                                <th className="py-2 border-b text-black">Foto</th>
                                <th className="py-2 border-b text-black">Nombre Completo</th>
                                <th className="py-2 border-b text-black">Curso</th>
                                <th className="py-2 border-b text-black">Ruta</th>
                                <th className="py-2 border-b text-black">Placa del Vehículo</th>
                                <th className="py-2 border-b text-black">Institución</th>
                                <th className="py-2 border-b text-black">Estado</th>
                                <th className="py-2 border-b text-black">Acciones</th>
                                <th className="py-2 border-b text-black">Revisión Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((estudiante, index) => (
                                    <tr
                                        key={estudiante.id || index}
                                        className="transition-all duration-300 ease-in-out hover:bg-gray-100"
                                    >
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.estudiante_foto ? (
                                                <img
                                                    src={estudiante.estudiante_foto}
                                                    alt={`${estudiante.estudiante_nombre} ${estudiante.estudiante_apellido}`}
                                                    className="w-12 h-12 object-cover rounded-full mx-auto"
                                                />
                                            ) : (
                                                // Mostrar un icono cuando no hay foto
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                                    <AiOutlineUser className="text-gray-500 text-2xl" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.estudiante_nombre}{" "}
                                            {estudiante.estudiante_apellido}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.estudiante_curso}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.ruta.nombre}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.vehiculo_placa}
                                        </td>
                                        <td className="py-2 border-b text-center text-black">
                                            {estudiante.institucion.nombre}
                                        </td>
                                        <td className="py-2 border-b text-center">
                                            <span
                                                className={`px-2 py-1 rounded ${
                                                    estudiante.estudiante_estado
                                                        ? "bg-green-500 text-white"
                                                        : "bg-red-500 text-white"
                                                }`}
                                            >
                                                {estudiante.estudiante_estado ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-2 border-b text-center">
                                            <button
                                                onClick={() => navigate(`/estudiantes/${estudiante.id}`)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-1 rounded mr-2 mb-2"
                                            >
                                                Actualizar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(estudiante.id, estudiante)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                        <td className="py-2 border-b text-center">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => handleRevisionPago(estudiante.id)}
                                            >
                                                <FiDollarSign className="inline-block text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="py-4 text-center text-black">
                                        No se encontraron estudiantes
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
            </main>

            {/* Pie de página */}
            <Footer />
        </div>
    );
}

export default EstudiantesList;
