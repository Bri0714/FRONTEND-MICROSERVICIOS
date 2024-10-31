import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Verificar si la ruta anterior en el historial es la página principal ("/")
    if (location.pathname !== "/") {
      navigate(-1); // Navega a la página anterior en el historial solo si no es "/"
    }
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
          Instituciones
        </Link>
        <Link to="/instituciones-create">
          <button className="bg-blue-700 text-white font-bold p-2 rounded-lg transition-all duration-500 ease-in-out transform hover:bg-blue-600 hover:-translate-y-1 hover:scale-105">
            Crear Institución
          </button>
        </Link>
      </div>
    </nav>
  );
}
