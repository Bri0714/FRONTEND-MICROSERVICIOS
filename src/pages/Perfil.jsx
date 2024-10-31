// src/pages/Perfil.js

import React, { useState, useEffect } from "react";
import { Footer } from "../components/footer";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../components/AuthContext";
import api from "../api/AxiosConfig"; // Importa la instancia configurada de Axios
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export function Perfil() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, setUser, login } = useAuth(); // Agregar 'login' para actualizar el token si es necesario
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        new_password: "",
        confirm_password: "",
    });
    const [initialFormData, setInitialFormData] = useState({});
    const [errors, setErrors] = useState({});

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Ancho del Sidebar en píxeles
    const sidebarWidth = isSidebarOpen ? 256 : 64;

    useEffect(() => {
        if (user) {
            const initialData = {
                email: user.email || "",
                username: user.username || "",
            };
            setFormData({
                ...initialData,
                new_password: "",
                confirm_password: "",
            });
            setInitialFormData(initialData);
        }
    }, [user]);

    const validate = () => {
        const newErrors = {};

        // Validar el nombre de usuario si ha cambiado
        if (formData.username !== initialFormData.username) {
            if (!formData.username.trim()) {
                newErrors.username = "El nombre de usuario no puede estar vacío.";
            }
        }

        // Validar el correo electrónico si ha cambiado
        if (formData.email !== initialFormData.email) {
            if (!formData.email.trim()) {
                newErrors.email = "El correo electrónico no puede estar vacío.";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "El correo electrónico no es válido.";
            }
        }

        // Validar las contraseñas solo si se proporciona alguna
        if (formData.new_password || formData.confirm_password) {
            if (formData.new_password !== formData.confirm_password) {
                newErrors.confirm_password = "Las contraseñas no coinciden.";
            }
            if (formData.new_password && formData.new_password.length < 8) {
                newErrors.new_password =
                    "La contraseña debe tener al menos 8 caracteres.";
            }
            // Agrega más validaciones si es necesario
        }

        // Verificar que al menos un campo haya cambiado
        if (
            formData.username === initialFormData.username &&
            formData.email === initialFormData.email &&
            !formData.new_password &&
            !formData.confirm_password
        ) {
            newErrors.general = "No hay cambios para actualizar.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiar el error del campo actual
        setErrors({ ...errors, [e.target.name]: "", general: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            // Preparar los datos a enviar, solo incluyendo los campos que han cambiado
            const dataToSend = {};

            if (formData.username !== initialFormData.username) {
                dataToSend.username = formData.username;
            }
            if (formData.email !== initialFormData.email) {
                dataToSend.email = formData.email;
            }
            if (formData.new_password) {
                dataToSend.new_password = formData.new_password;
                dataToSend.confirm_password = formData.confirm_password;
            }

            const response = await api.put(
                "api/api/users/update_profile/",
                dataToSend
            );
            if (response.status === 200) {
                // Actualizar el usuario en el contexto
                setUser(response.data.user);
                // Actualizar los datos iniciales
                setInitialFormData({
                    email: response.data.user.email,
                    username: response.data.user.username,
                });
                toast.success(response.data.message);
                if (response.data.token) {
                    // Actualizar el token si se cambió la contraseña o el email
                    await login(response.data.token);
                }
                // Limpiar los campos de contraseña
                setFormData({
                    ...formData,
                    new_password: "",
                    confirm_password: "",
                });
            }
        } catch (error) {
            console.error("Error al actualizar los datos del usuario:", error);
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                // Mostrar errores en un toast
                const errorMessages = Object.values(error.response.data)
                    .flat()
                    .join(" ");
                toast.error(errorMessages);
            } else {
                toast.error("Error al actualizar el perfil.");
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* Fondo con gradiente */}
            <div className="absolute inset-0 bg-gradient-animated bg-cover bg-center animate-gradient -z-10"></div>

            {/* Contenido principal */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Área de contenido principal */}
                <div
                    className="flex-grow transition-all duration-300 ease-in-out flex flex-col"
                    style={{ marginLeft: `${sidebarWidth}px` }}
                >
                    <div className="w-full px-4 py-8 mb-8 flex-grow">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 font-poppins text-white drop-shadow-lg">
                            Perfil de Usuario
                        </h1>
                        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
                            {/* Icono de perfil */}
                            <div className="flex justify-center mb-6">
                                <FaUserCircle className="text-gray-700" size={96} />
                            </div>
                            <form onSubmit={handleSubmit}>
                                {errors.general && (
                                    <p className="text-red-500 text-sm mb-4">{errors.general}</p>
                                )}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded text-black ${errors.email ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">{errors.email}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Nombre de Usuario:
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded text-black ${errors.username ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm">{errors.username}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Nueva Contraseña:
                                    </label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        value={formData.new_password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded text-black ${errors.new_password ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.new_password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.new_password}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Confirmar Nueva Contraseña:
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded text-black ${errors.confirm_password ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.confirm_password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.confirm_password}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    Actualizar Datos
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* Agregamos margen inferior al contenedor para separar el formulario del footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Perfil;
