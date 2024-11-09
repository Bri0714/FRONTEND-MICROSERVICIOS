// src/components/RutaCard.jsx

import { useNavigate } from "react-router-dom";

export function RutaCard({ ruta }) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#1a252f] rounded-lg shadow-lg text-white flex flex-col items-center p-8 max-w-[400px] w-full mx-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
            <div className="mb-4 w-full h-40 bg-white flex items-center justify-center">
                {ruta.vehiculo && ruta.vehiculo.vehiculo_imagen ? (
                    <img
                        src={ruta.vehiculo.vehiculo_imagen}
                        alt={`Vehículo de ${ruta.ruta_nombre}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100";
                        }}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <span className="text-sm text-center text-black">Imagen no agregada</span>
                )}
            </div>
            <div className="flex flex-col items-center mb-4">
                <h1 className="text-xl font-bold mb-1 text-center">{ruta.ruta_nombre}</h1>
                <p className="text-sm text-[#ccc] text-center">
                    Placa:{" "}
                    {ruta.vehiculo && ruta.vehiculo.vehiculo_placa
                        ? ruta.vehiculo.vehiculo_placa
                        : "No asignado"}
                </p>
                {/* Mostrar nombre de la monitora si está disponible */}
                <p className="text-sm text-[#ccc] text-center">
                    Monitora:{" "}
                    {ruta.vehiculo && ruta.vehiculo.monitora
                        ? ruta.vehiculo.monitora.nombre_completo
                        : "No asignada"}
                </p>
            </div>
            <button
                onClick={() => navigate(`/rutas/${ruta.id}/detalles`)}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
                Ir a Ruta
            </button>
        </div>
    );
}

export default RutaCard;

