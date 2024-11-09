import React, { useContext } from 'react';
import { Oval } from 'react-loader-spinner';
import { LoaderContext } from './LoaderContext';
import { FaBus } from "react-icons/fa";

const Spinner = () => {
    const { loading } = useContext(LoaderContext);

    if (!loading) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-sky-950 bg-opacity-60 z-50">
            <div className="flex flex-col items-center">
                <FaBus
                    className="text-yellow-500 mb-4" // Dark yellow color for the icon
                    size={50} // Adjust the size to make it prominent
                    aria-label="Company Logo"
                />
                <Oval
                    height={80}
                    width={80}
                    color="#FBBF24" // Dark yellow
                    secondaryColor="#FCD34D" // Softer yellow
                    strokeWidth={4}
                    ariaLabel="oval-loading"
                    visible={true}
                />
                <p className="text-xl font-black text-zinc-200 mt-4">Cargando...</p>
            </div>
        </div>
    );
};

export default Spinner;
