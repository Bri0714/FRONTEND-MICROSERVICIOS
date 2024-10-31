// src/pages/IndexPage.js

import React, { useEffect, useState } from "react";
import LoginRegisterForm from "../components/LoginRegisterForm";
import { FaBus } from "react-icons/fa";

export function IndexPage() {
    const [title, setTitle] = useState("");
    const fullTitle = "Bienvenido a SchoolarTransPro";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullTitle.length) {
                setTitle((prev) => fullTitle.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 animate-gradient p-8 relative overflow-hidden">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-md text-center mt-8 leading-tight">
                {title}
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-500 drop-shadow-md text-center px-4">
                Optimiza el transporte escolar de una manera eficiente y segura
            </p>
            <div className="w-full max-w-md mt-20 relative z-10">
                <LoginRegisterForm />
            </div>
            {/* Animación del Bus Escolar */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-full flex space-x-8 animate-slide-car z-0">
                {[...Array(10)].map((_, index) => (
                    <FaBus key={index} size={100} className="text-yellow-500 opacity-70" />
                ))}
            </div>
        </div>
    );
}

export default IndexPage;
