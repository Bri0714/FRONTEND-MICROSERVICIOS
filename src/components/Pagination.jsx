// src/components/Pagination.jsx

import React from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center mt-6">
            <ul className="flex list-none">
                {pageNumbers.map((number) => (
                    <li key={number} className={`mx-1 ${number === currentPage ? "font-bold" : ""}`}>
                        <button
                            onClick={() => paginate(number)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
