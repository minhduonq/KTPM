'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/navbar';
import GoldPrice from '@/components/goldPrice';
import FERATE from '@/components/feRate';

function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('Dashboard');

    const renderContent = () => {
        switch (selectedOption) {
            case 'GoldPrice':
                return <GoldPrice />;
            case 'FeRate':
                return <FERATE />;
            case 'GoldPriceCheck':
                return <div>Gold Price Check Content</div>;
            case 'ReRateCheck':
                return <div>Re Rate Check Content</div>;
            case 'Monitoring':
                return <div>Monitoring Content</div>;
            default:
                return <div>Dashboard Content</div>;
        }
    };

    return (
        <div className="flex">
            <Sidebar setSelectedOption={setSelectedOption} />
            <div className="flex-1 p-4">
                {renderContent()}
            </div>
        </div>
    );
}

export default Dashboard;