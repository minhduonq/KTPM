'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/navbar';
import GoldPrice from '@/components/goldPrice';
import FERATE from '@/components/feRate';
import Monitor from '../monitor/page';
import ContainerStatus from "@/components/ContainerStatus";
import EndpointStatus from "@/components/EndpointStatus";
function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('Dashboard');

    const renderContent = () => {
        switch (selectedOption) {
            case 'GoldPrice':
                return <GoldPrice />;
            case 'FeRate':
                return <FERATE />;
            case 'Endpoint Status':
                return <EndpointStatus />;
            case 'Container Status':
                return <ContainerStatus />;
            case 'Monitoring':
                return <Monitor />;
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