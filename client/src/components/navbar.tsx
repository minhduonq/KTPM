import React, { useState } from 'react';

function Sidebar({ setSelectedOption }) {
    const [showSubMenu, setShowSubMenu] = useState(false);

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4">
            <h2 className="text-lg font-bold mb-4">Navigation</h2>
            <ul className="space-y-2">
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedOption('Dashboard')}
                >
                    Dashboard
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedOption('GoldPrice')}
                >
                    Gold Price
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedOption('FeRate')}
                >
                    Fe Rate
                </li>
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                    onClick={() => setShowSubMenu(!showSubMenu)}
                >
                    System Health Check
                    <span className="text-sm">{showSubMenu ? '▲' : '▼'}</span>
                </li>
                {showSubMenu && (
                    <ul className="ml-4 mt-2 space-y-2">
                        <li
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => setSelectedOption('GoldPriceCheck')}
                        >
                            Gold Price Check
                        </li>
                        <li
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => setSelectedOption('ReRateCheck')}
                        >
                            Re Rate Check
                        </li>
                    </ul>
                )}
                <li
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedOption('Monitoring')}
                >
                    Monitoring
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
