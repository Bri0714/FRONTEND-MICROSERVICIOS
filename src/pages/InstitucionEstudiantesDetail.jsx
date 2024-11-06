// src/pages/InstitucionEstudiantesDetail.js
import React from "react";
import { Footer } from "../components/footer";
import { Navigation } from "../components/Navigation";
import { useParams } from "react-router-dom";

export function InstitucionEstudiantesDetail() {
    const { id } = useParams();

    return (
        <div className="min-h-screen w-full">
            {/* Navigation */}
            <Navigation title="Colegios" />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8 text-center">Estudiantes de la Ruta {id}</h1>
                <div className="flex flex-col items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <h2 className="text-lg font-bold mb-4">Estudiantes Asociados</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 border-b text-black">ID Estudiante</th>
                                        <th className="py-2 border-b text-black">Nombre</th>
                                        <th className="py-2 border-b text-black">Acudiente</th>
                                        <th className="py-2 border-b text-black">Teléfono</th>
                                        <th className="py-2 border-b text-black">Dirección</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="transition-all duration-300 ease-in-out">
                                        <td className="py-2 border-b text-center text-black">1</td>
                                        <td className="py-2 border-b text-center text-black">Brian Amezcuita Parada</td>
                                        <td className="py-2 border-b text-center text-black">Katherine Parada</td>
                                        <td className="py-2 border-b text-center text-black">3014104216</td>
                                        <td className="py-2 border-b text-center text-black">Cra 96 G No 22-52</td>
                                    </tr>
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default InstitucionEstudiantesDetail;
