import React, { useEffect, useState } from "react";
import { getAllInstituciones, deleteInstitucion } from "../api/instituciones.api";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/footer";
import { FaSearch } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

export function AdministracionColegios() {
    const [instituciones, setInstituciones] = useState([]);
    const [filteredData, setFilteredInstituciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function loadInstituciones() {
            try {
                const res = await getAllInstituciones();
                console.log("Datos recibidos:", res.data);

                // Verificar si `res.data` contiene un array directamente o si está anidado
                if (Array.isArray(res.data)) {
                    setInstituciones(res.data);
                    setFilteredInstituciones(res.data);
                } else if (res.data.instituciones) {
                    // Si los datos están anidados
                    setInstituciones(res.data.instituciones);
                    setFilteredInstituciones(res.data.instituciones);
                } else {
                    console.error("Formato de datos inesperado:", res.data);
                }
            } catch (error) {
                console.error("Error al cargar las instituciones:", error);
            }
        }
        loadInstituciones();
    }, []);

    // Filtrar las instituciones basadas en el término de búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setFilteredInstituciones(instituciones);
        } else {
            const filtered = instituciones.filter((institucion) =>
                (institucion.institucion_nombre || "").toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredInstituciones(filtered);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '<h2 class="text-blue-500 font-bold">Aviso</h2>',
            html: '<p class="text-gray-700">¿Estás seguro de eliminar esta institución? La eliminarás de cualquier servicio asociado a esta, tanto estudiantes como rutas.</p>',
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2',
                cancelButton: 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2',
                popup: 'bg-blue-50 p-6 rounded-lg shadow-lg',
            },
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Llamada a la API para eliminar la institución
                    await deleteInstitucion(id);

                    // Actualizar el estado de instituciones después de la eliminación
                    const updatedInstituciones = instituciones.filter((institucion) => institucion.id !== id);
                    setInstituciones(updatedInstituciones);
                    setFilteredInstituciones(updatedInstituciones);

                    // Mostrar mensaje de éxito
                    Swal.fire({
                        title: '<h2 class="text-green-500 font-bold">Eliminado</h2>',
                        html: '<p class="text-gray-700">La institución y los elementos asociados han sido eliminados exitosamente.</p>',
                        icon: 'success',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
                            popup: 'bg-green-50 p-6 rounded-lg shadow-lg',
                        },
                    });
                } catch (error) {
                    console.error("Error al eliminar la institución:", error);
                    // Mostrar mensaje de error
                    Swal.fire({
                        title: '<h2 class="text-red-500 font-bold">Error</h2>',
                        html: '<p class="text-gray-700">Hubo un error al intentar eliminar la institución. Por favor, inténtalo de nuevo.</p>',
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



    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcular los índices para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col pb-20">
            <h1 className="text-2xl font-bold mb-8 text-center">Administración de Colegios</h1>
            <div className="flex justify-center items-center mb-6">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Buscar colegios..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-black w-full"
                        style={{ color: "black" }}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="flex-grow flex items-center justify-center overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 border-b text-black">ID</th>
                            <th className="py-2 border-b text-black">Nombre</th>
                            <th className="py-2 border-b text-black">NIT</th>
                            <th className="py-2 border-b text-black">Dirección</th>
                            <th className="py-2 border-b text-black">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((institucion, index) => (
                                <tr key={institucion.id || index} className="transition-all duration-300 ease-in-out">
                                    <td className="py-2 border-b text-center text-black">{institucion.id || "ID no disponible"}</td>
                                    <td className="py-2 border-b text-center text-black">{institucion.institucion_nombre || "Nombre no disponible"}</td>
                                    <td className="py-2 border-b text-center text-black">{institucion.institucion_nit || "NIT no disponible"}</td>
                                    <td className="py-2 border-b text-center text-black">{institucion.institucion_direccion || "Dirección no disponible"}</td>
                                    <td className="py-2 border-b text-center">
                                        <button
                                            onClick={() => navigate(`/instituciones/${institucion.id}`)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        >
                                            Actualizar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(institucion.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-black">No se encontraron instituciones</td>
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