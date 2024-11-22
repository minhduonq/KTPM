'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/navbar';
import GoldPrice from '@/components/goldPrice';
import FERATE from '@/components/feRate';
import ContainerOverview from "@/components/ContainerOverview";
import EndpointStatus from "@/components/EndpointStatus";
import ChartPage from '@/components/chartPage';
import axios from 'axios';

function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('Dashboard');
    const [systemOverview, setSystemOverview] = useState({ containers: 0, endpoints: 0, alerts: 0 });

    useEffect(() => {
        if (selectedOption === 'Monitoring') {
            window.location.href = 'http://localhost:3000';
        }
    }, [selectedOption]);

    useEffect(() => {
        const fetchSystemOverview = async () => {
            try {
                const containerResponse = await axios.get('http://localhost:3003/monitor/containers-status');
                const endpointResponse = await axios.get('http://localhost:3003/monitor/endpoints-status');
                setSystemOverview({
                    containers: containerResponse.data.length,
                    endpoints: endpointResponse.data.length,
                    alerts: 0 // Giả sử bạn có API để lấy số lượng cảnh báo
                });
            } catch (error) {
                console.error('Error fetching system overview:', error);
            }
        };

        fetchSystemOverview();
    }, []);

    const renderContent = () => {
        switch (selectedOption) {
            case 'GoldPrice':
                return <GoldPrice />;
            case 'FeRate':
                return <FERATE />;
            case 'Endpoint Status':
                return <EndpointStatus />;
            case 'Container Status':
                return <ContainerOverview />;
            case 'VisitorsChart':
                return <ChartPage />;
            default:
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">System Overview</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Containers</h3>
                                <p className="text-2xl">{systemOverview.containers}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Endpoints</h3>
                                <p className="text-2xl">{systemOverview.endpoints}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Alerts</h3>
                                <p className="text-2xl">{systemOverview.alerts}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex">
            <Sidebar setSelectedOption={setSelectedOption} />
            <div className="flex-1 p-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Dashboard;