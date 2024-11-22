'use client';
import React from 'react';
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon, ServerIcon, CogIcon } from '@heroicons/react/24/outline'; // Import các icon từ Heroicons
import { FaDocker } from "react-icons/fa";
interface SidebarProps {
    setSelectedOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedOption }) => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4">
            <div className="mb-4">
                <img src="/logo.svg" alt="logo" className="w-full mx-auto" />
            </div>
            <ul className="space-y-2">
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('Dashboard')}
                >
                    <HomeIcon className="h-5 w-5" />
                    Dashboard
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('GoldPrice')}
                >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    Gold Price
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('FeRate')}
                >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    Fe Rate
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('Endpoint Status')}
                >
                    <ServerIcon className="h-5 w-5" />
                    Endpoint Status
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('Container Status')}
                >
                    <FaDocker className="h-5 w-5" />
                    Container Status
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('Monitoring')}
                >
                    <CogIcon className="h-5 w-5" />
                    Monitoring
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => setSelectedOption('VisitorsChart')}
                >
                    <ChartBarIcon className="h-5 w-5" />
                    Visitors Chart
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;