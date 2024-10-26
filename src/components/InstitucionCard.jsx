import { useNavigate } from "react-router-dom";

export function InstitucionCard({ institucion }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1a252f] rounded-lg shadow-lg text-white flex flex-col items-center p-8 max-w-[400px] w-full mx-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
      {institucion.institucion_logo ? (
        <img
          src={institucion.institucion_logo}
          alt={`${institucion.institucion_nombre} logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/100";
          }}
          className="h-24 w-24 rounded-full object-cover mb-4 border-2 border-blue-500"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center mb-4 border-2 border-blue-500">
          <span className="text-xs text-white text-center">Imagen no agregada</span>
        </div>
      )}
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-xl font-bold mb-1 text-center">
          {institucion.institucion_nombre}
        </h1>
        <p className="text-sm text-[#ccc] text-center">
          NIT: {institucion.institucion_nit}
        </p>
      </div>
      <button
        onClick={() => navigate(`/instituciones/${institucion.id}`)}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        Ir a institución
      </button>
    </div>
  );
}


