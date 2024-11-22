'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import icon từ Heroicons v2

interface Container {
    id: string;
    name: string;
    status: string;
}


const ContainerOverview = () => {
    const [containers, setContainers] = useState<Container[]>([]);
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

    const fetchData = async () => {
        await fetchContainerStatus();
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 10000); // Tự động reload sau mỗi 5 giây
        return () => clearInterval(intervalId); // Cleanup interval khi component bị unmount
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='p-5' style={{ overflowY: 'auto', maxHeight: '98vh' }}>
            <h2 className="text-2xl font-bold mb-4">Container Overview</h2>
            <hr className="border-t border-gray-300 mb-4" />
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
        </div>
    );
};

export default ContainerOverview;