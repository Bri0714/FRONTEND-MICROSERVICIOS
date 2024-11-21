// src/components/ResetPasswordForm.js

import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export function ResetPasswordForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const search = location.search.replace(/&amp;/g, '&'); // Reemplaza &amp; con &
    const queryParams = new URLSearchParams(search);
    const uid = queryParams.get('uid') || '';
    const token = queryParams.get('token') || '';

    // Logs para verificar los valores capturados
    console.log("UID:", uid);
    console.log("Token:", token);

    const [formData, setFormData] = useState({
        new_password: "",
        confirm_password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/api/password-reset-confirm/", // URL correcta
                {
                    uid: uid,
                    token: token,
                    new_password: formData.new_password, // Campo correcto
                    confirm_password: formData.confirm_password, // Campo correcto
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("La contraseña ha sido restablecida exitosamente.", {
                    duration: 3000,
                    onClose: () => navigate("/", { replace: true }), // Redirige al login
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error Response:", error.response.data);
                const data = error.response.data;
                let errorMessage = "";

                // Extraer mensajes de error específicos si existen
                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors.join(" ");
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (typeof data === "string") {
                    errorMessage = data;
                } else {
                    // Combinar todos los mensajes de error
                    errorMessage = Object.values(data)
                        .flat()
                        .join(" ");
                }

                setError(errorMessage);
            } else if (error.request) {
                setError("Error: No se recibió respuesta del servidor.");
            } else {
                setError("Error: Ocurrió un error al realizar la solicitud.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transition-transform duration-700 ease-in-out transform scale-100 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-4">
                        Restablecer Contraseña
                    </h2>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                name="new_password" // Nombre correcto
                                value={formData.new_password}
                                onChange={handleChange}
                                placeholder="Nueva Contraseña"
                                className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                required
                                pattern="(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}"
                                title="Debe tener al menos 8 caracteres, una letra mayúscula, un carácter especial y un número"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Confirmar Contraseña
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                name="confirm_password" // Nombre correcto
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirmar Contraseña"
                                className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-6 bg-blue-600 text-white font-poppins rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Restablecer Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordForm;
