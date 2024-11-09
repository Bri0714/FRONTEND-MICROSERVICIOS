// src/components/RutasList.jsx

import React, { useEffect, useState } from "react";
import { getAllRutas } from "../api/rutas.api";
import { getAllVehiculos } from "../api/vehiculos";
import { RutaCard } from "./RutaCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { Footer } from "./footer";

export function RutasList() {
    const [rutas, setRutas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Cambiamos rutasPerPage a itemsPerPage
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                const rutasRes = await getAllRutas();
                const vehiculosRes = await getAllVehiculos();

                const rutasData = rutasRes.data;
                const vehiculosData = vehiculosRes.data;

                // Combinar rutas y vehículos basados en ruta.id y vehiculo.ruta_id
                const combined = rutasData.map((ruta) => {
                    const vehiculo = vehiculosData.find((v) => v.ruta_id === ruta.id);
                    return { ...ruta, vehiculo };
                });

                setCombinedData(combined);
            } catch (error) {
                console.error("Error al cargar las rutas o vehículos:", error);
            }
        }
        loadData();
    }, []);

    const indexOfLastRuta = currentPage * itemsPerPage;
    const indexOfFirstRuta = indexOfLastRuta - itemsPerPage;
    const currentRutas = combinedData.slice(indexOfFirstRuta, indexOfLastRuta);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container mx-auto px-4 pt-24 pb-24 min-h-screen">
                <div className="grid gap-6 items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                    {currentRutas.length > 0 ? (
                        currentRutas.map((ruta) => <RutaCard key={ruta.id} ruta={ruta} />)
                    ) : (
                        <div className="col-span-full text-center text-white">
                            No se encontraron rutas.
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center mt-8">
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={combinedData.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                    <button
                        onClick={() => navigate("/administrar-rutas")}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Administración de rutas
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RutasList;

