// src/components/LoginRegisterForm.js

import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export function LoginRegisterForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        password2: "",
    });
    const [error, setError] = useState("");
    const [emailForReset, setEmailForReset] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Obtener la función 'login' del contexto

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForgotPasswordChange = (e) => {
        setEmailForReset(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Solicitud de inicio de sesión
                const response = await axios.post(
                    "http://localhost:8000/api/login/",
                    {
                        email: formData.email,
                        password: formData.password,
                    }
                );

                if (response.status === 200) {
                    login(response.data.token); // Usar la función 'login' del contexto
                    navigate("/menu-principal", { replace: true });
                }
            } else {
                // Solicitud de registro
                if (formData.password !== formData.password2) {
                    setError("Error: Las contraseñas no coinciden.");
                    return;
                }
                const response = await axios.post(
                    "http://localhost:8000/api/register/",
                    {
                        email: formData.email,
                        username: formData.username,
                        password: formData.password,
                        password2: formData.password2,
                    }
                );

                if (response.status === 201) {
                    toast.success("Usuario creado correctamente", {
                        duration: 3000,
                        onClose: () => navigate("/", { replace: true }),
                    });
                }
            }
        } catch (error) {
            handleAxiosError(error);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/api/password_reset/", // Endpoint correcto
                {
                    email: emailForReset,
                }
            );
    
            if (response.status === 200) {
                toast.success("Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.", {
                    duration: 5000,
                    onClose: () => {
                        setIsForgotPassword(false);
                        setEmailForReset("");
                    },
                });
            }
        } catch (error) {
            handleAxiosError(error);
        }
    };
    
    const handleAxiosError = (error) => {
        if (error.response) {
            const data = error.response.data;

            let errorMessage = "";

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
    };

    return (
        <div className="flex items-center justify-center min-h-10">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transition-transform duration-700 ease-in-out transform scale-100 hover:scale-105 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-4">
                        {isLogin
                            ? "Iniciar Sesión"
                            : isForgotPassword
                                ? "Restablecer Contraseña"
                                : "Crear Cuenta"}
                    </h2>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {!isForgotPassword ? (
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Usuario
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                                    <FaUser className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Nombre de usuario"
                                        className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                                <FaEnvelope className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Correo Electrónico"
                                    className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                                <FaLock className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Contraseña"
                                    className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                    required
                                    pattern="(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}"
                                    title="Debe tener al menos 8 caracteres, una letra mayúscula, un carácter especial y un número"
                                />
                            </div>
                        </div>
                        {!isLogin && (
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Confirmar Contraseña
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                                    <FaLock className="text-gray-500 mr-2" />
                                    <input
                                        type="password"
                                        name="password2"
                                        value={formData.password2}
                                        onChange={handleChange}
                                        placeholder="Confirmar Contraseña"
                                        className="w-full py-2 px-1 outline-none rounded-full text-slate-950"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 mt-6 bg-blue-600 text-white font-poppins rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            {isLogin ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-full px-3 shadow-inner">
                                <FaEnvelope className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    name="emailForReset"
                                    value={emailForReset}
                                    onChange={handleForgotPasswordChange}
                                    placeholder="Correo Electrónico"
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
                )}

                <p className="mt-8 text-center text-gray-600">
                    {isForgotPassword ? (
                        <button
                            onClick={() => setIsForgotPassword(false)}
                            className="text-blue-600 font-poppins hover:underline focus:outline-none"
                        >
                            Volver a Iniciar Sesión
                        </button>
                    ) : isLogin ? (
                        <>
                            ¿No tienes cuenta?{" "}
                            <button
                                onClick={toggleForm}
                                className="text-blue-600 font-poppins hover:underline focus:outline-none"
                            >
                                Crear una cuenta
                            </button>
                        </>
                    ) : (
                        <>
                            ¿Ya tienes cuenta?{" "}
                            <button
                                onClick={toggleForm}
                                className="text-blue-600 font-poppins hover:underline focus:outline-none"
                            >
                                Iniciar sesión
                            </button>
                        </>
                    )}
                </p>

                {isLogin && (
                    <p className="mt-4 text-center text-gray-600">
                        <button
                            onClick={() => setIsForgotPassword(true)}
                            className="text-blue-600 font-poppins hover:underline focus:outline-none"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </p>
                )}

            </div>
        </div>
    );
}

export default LoginRegisterForm;
