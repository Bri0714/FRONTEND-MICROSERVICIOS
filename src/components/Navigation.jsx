// src/components/Navigation.js

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname !== "/menu-principal" && location.pathname !== "/") {
      navigate(-1);
    }
  };

  // Mapeo de rutas a títulos y botones
  const routeInfo = [
    {
      path: "/menu-principal",
      title: "Instituciones",
      createText: "Crear Institución",
      createLink: "/instituciones-create",
    },
    {
      path: "/instituciones",
      title: "Colegios",
      createText: "Crear Colegio",
      createLink: "/instituciones-create",
    },
    {
      path: "/rutas",
      title: "Rutas",
      createText: "Crear Ruta",
      createLink: "/rutas-create",
    },
    {
      path: "/estudiantes",
      title: "Estudiantes",
      createText: "Crear Estudiante",
      createLink: "/estudiantes-create",
    },
    // Agrega más rutas si es necesario
  ];

  const currentPath = location.pathname;

  // Buscar la primera ruta cuyo path es un prefijo del currentPath
  const matchedRoute = routeInfo.find(route => currentPath.startsWith(route.path));

  const { title, createText, createLink } = matchedRoute || {
    title: "Colegios",
    createText: "Crear Colegio",
    createLink: "/instituciones-create",
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-blue-500 shadow-lg z-50 w-full flex justify-between items-center px-4">
      <div className="flex flex-row justify-between items-center w-full max-w-7xl mx-auto py-3 px-3">
        <button
          onClick={handleBack}
          className="bg-blue-700 text-white font-bold p-2 rounded-lg transition-all duration-500 ease-in-out transform hover:bg-blue-600 hover:-translate-y-1 hover:scale-105"
        >
          Atrás
        </button>
        <Link 
          to="/menu-principal" 
          className="text-white font-extrabold text-2xl md:text-3xl hover:text-gray-200 transition-colors duration-300 text-center"
        >
          {title}
        </Link>
        <Link to={createLink}>
          <button className="bg-blue-700 text-white font-bold p-2 rounded-lg transition-all duration-500 ease-in-out transform hover:bg-blue-600 hover:-translate-y-1 hover:scale-105">
            {createText}
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
