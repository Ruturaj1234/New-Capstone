import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onManageClick }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`h-screen p-4 transition-all duration-300 ease-in-out ${isOpen ? 'bg-orange-600' : 'bg-gray-800'} w-1/4`}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white mb-4">Dashboard</h2>
                <button onClick={toggleMenu} className="text-white focus:outline-none">
                    <svg className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="transition-all duration-300 ease-in-out">
                    <button onClick={onManageClick} className="block mb-2 text-white hover:text-gray-300">
                        Manage Clerks & Employees
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
