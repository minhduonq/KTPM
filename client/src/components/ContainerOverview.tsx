'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import icon từ Heroicons v2

interface Container {
    id: string;
    name: string;
    status: string;
}

interface ContainerUsage {
    id: string;
    name: string;
    memory_usage: number;
    cpu_usage: number;
}

const ContainerOverview = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [usageData, setUsageData] = useState<ContainerUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchContainerStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3003/monitor/containers-status');
            setContainers(response.data);
        } catch (error) {
            setError('Error fetching container status');
        }
    };

    const fetchUsageData = async () => {
        try {
            const response = await axios.get('http://localhost:3003/monitor/usage');
            setUsageData(response.data);
        } catch (error) {
            setError('Error fetching container usage data');
        }
    };

    const fetchData = async () => {
        await fetchContainerStatus();
        await fetchUsageData();
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000); // Tự động reload sau mỗi 5 giây
        return () => clearInterval(intervalId); // Cleanup interval khi component bị unmount
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='p-5' style={{ overflowY: 'auto', maxHeight: '98vh' }}>
            <h2 className="text-2xl font-bold mb-4">Container Overview</h2>
            <hr className="border-t border-gray-300 mb-4" />
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Container Status</h3>
                <button onClick={fetchContainerStatus} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <ArrowPathIcon className="h-5 w-5 text-gray-700" />
                </button>
            </div>
            <table className="min-w-full bg-white mb-8 border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-r border-gray-300">ID</th>
                        <th className="py-2 px-4 border-r border-gray-300">Name</th>
                        <th className="py-2 px-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {containers.map((container) => (
                        <tr key={container.id} className="bg-white border-b border-gray-300">
                            <td className="py-2 px-4 border-r border-gray-300">{container.id}</td>
                            <td className="py-2 px-4 border-r border-gray-300">{container.name}</td>
                            <td className="py-2 px-4 flex items-center gap-2">
                                <span
                                    className={
                                        container.status === 'running'
                                            ? 'w-3 h-3 rounded-full bg-green-500'
                                            : 'w-3 h-3 rounded-full bg-red-500'
                                    }
                                ></span>
                                <span>{container.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Container Usage</h3>
                <button onClick={fetchUsageData} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <ArrowPathIcon className="h-5 w-5 text-gray-700" />
                </button>
            </div>
            <table className="min-w-full bg-white border border-r border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 rounded-t-lg">
                        <th className="py-2 px-4 border-r border-b border-gray-300">ID</th>
                        <th className="py-2 px-4 border-r border-b border-gray-300">Name</th>
                        <th className="py-2 px-4 border-r border-b border-gray-300">Memory Usage (MB)</th>
                        <th className="py-2 px-4 border-r border-b border-gray-300" >CPU Usage</th>
                    </tr>
                </thead>
                <tbody>
                    {usageData.map((container) => (
                        <tr key={container.id} className="bg-white">
                            <td className="py-2 px-4 border-r border-b border-gray-300">{container.id}</td>
                            <td className="py-2 px-4 border-r border-b border-gray-300">{container.name}</td>
                            <td className="py-2 px-4 border-r border-b border-gray-300">{container.memory_usage.toFixed(2)}</td>
                            <td className="py-2 px-4 border-r border-b border-gray-300">{container.cpu_usage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerOverview;