// src/components/RouteChangeHandler.jsx

import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LoaderContext } from './LoaderContext';

const RouteChangeHandler = () => {
    const location = useLocation();
    const { setLoading } = useContext(LoaderContext);

    useEffect(() => {
        // Mostrar el loader al iniciar la navegación
        setLoading(true);

        // Ocultar el loader después de que la nueva ruta se ha cargado
        // Puedes ajustar este tiempo o implementar una mejor lógica
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [location, setLoading]);

    return null;
};

export default RouteChangeHandler;
