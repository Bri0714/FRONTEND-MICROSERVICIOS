import React, { useEffect, useState } from "react";
import { getAllInstituciones } from "../api/instituciones.api";
import { InstitucionCard } from "./InstitucionCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { Footer } from "./footer";

export function InstitucionesList() {
  const [instituciones, setInstituciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const institutionsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInstituciones() {
      try {
        const res = await getAllInstituciones();
        console.log("Datos recibidos:", res.data);
        setInstituciones(res.data);
      } catch (error) {
        console.error("Error al cargar las instituciones:", error);
      }
    }
    loadInstituciones();
  }, []);

  const indexOfLastInstitution = currentPage * institutionsPerPage;
  const indexOfFirstInstitution = indexOfLastInstitution - institutionsPerPage;
  const currentInstitutions = instituciones.slice(
    indexOfFirstInstitution,
    indexOfLastInstitution
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-24 min-h-screen">
        <div className="grid gap-6 items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {currentInstitutions.length > 0 ? (
            currentInstitutions.map((institucion) => (
              <InstitucionCard
                key={institucion.id}
                institucion={institucion}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-white">
              No se encontraron instituciones.
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-8">
          <Pagination
            institutionsPerPage={institutionsPerPage}
            totalInstitutions={instituciones.length}
            paginate={paginate}
            currentPage={currentPage}
          />
          <button
            onClick={() => navigate("/administrar-colegios")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg"
          >
            Administración de colegios
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
