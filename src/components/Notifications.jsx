// src/components/Notifications.jsx

import React from "react";
import Pagination from "./Pagination";

const Notifications = ({
    isNotificationsPanelOpen,
    isSidebarOpen,
    notifications,
    removeNotification,
    clearNotifications,
    currentPage,
    paginate,
    notificationsPerPage,
    totalPages,
    toggleNotificationsPanel,
}) => {
    if (!isNotificationsPanelOpen) return null;

    // Calcular los índices para la paginación
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    return (
        <div
            className="fixed top-0 bg-white bg-opacity-95 shadow-lg z-[110] overflow-y-auto transition-transform duration-500 ease-in-out"
            style={{
                left: isSidebarOpen ? "16rem" : "4rem",
                width: "30%",
                maxWidth: "400px",
                minWidth: "250px",
                maxHeight: "calc(100% - 2rem)", // Ajusta la altura máxima para evitar que sobrepase el footer
                transform: isNotificationsPanelOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.5s ease-in-out",
            }}
        >
            {/* Encabezado del Panel */}
            <div className="flex justify-between items-center px-4 py-4 border-b">
                <h2 className="text-lg text-slate-950 font-semibold">Notificaciones</h2>
                <button
                    onClick={toggleNotificationsPanel}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    ✖
                </button>
            </div>

            {/* Contenido del Panel */}
            <div className="p-4" style={{ overflowY: "auto", maxHeight: "calc(100% - 4rem)" }}>
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500">No hay notificaciones pendientes.</p>
                ) : (
                    <>
                        <ul className="space-y-4">
                            {currentNotifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                                    onClick={() => removeNotification(notif.id)}
                                >
                                    <p className="text-sm text-gray-700">
                                        El Conductor <strong>{notif.nombre}</strong>, tiene vencida la licencia de conducción.
                                    </p>
                                    <p className="text-xs text-gray-500">Fecha de expiración: {notif.fecha}</p>
                                </li>
                            ))}
                        </ul>
                        {/* Paginador */}
                        {totalPages > 1 && (
                            <Pagination
                                itemsPerPage={notificationsPerPage}
                                totalItems={notifications.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        )}
                        {/* Botón para Limpiar Notificaciones */}
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={clearNotifications}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                            >
                                Limpiar Notificaciones
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Notifications;
