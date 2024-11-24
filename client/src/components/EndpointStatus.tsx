'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import icon từ Heroicons v2

interface Endpoint {
    id: string;
    name: string;
    url: string;
    status: string;
    message: string;
    checkedAt: string;
}

const EndpointStatus = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEndpointStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3003/monitor/endpoints-status');
            setEndpoints(response.data);
        } catch (error) {
            setError('Error fetching endpoint status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEndpointStatus();
        const intervalId = setInterval(fetchEndpointStatus, 30000); // Tự động reload sau mỗi 10 giây
        return () => clearInterval(intervalId); // Cleanup interval khi component bị unmount
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='p-5' style={{ overflowY: 'auto', maxHeight: '100vh' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Endpoint Status</h2>
                <button title='button' onClick={fetchEndpointStatus} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <ArrowPathIcon className="h-5 w-5 text-gray-700" />
                </button>
            </div>
            <hr className="border-t border-gray-300 mb-4" />
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 rounded-t-lg">
                        <th className="py-2 px-4 border-b text-center">Name</th>
                        <th className="py-2 px-4 border-b text-center">URL</th>
                        <th className="py-2 px-4 border-b text-center">Status</th>
                        <th className="py-2 px-4 border-b text-center">Message</th>
                        <th className="py-2 px-4 border-b text-center">Checked At</th>
                    </tr>
                </thead>
                <tbody>
                    {endpoints.map((endpoint) => (
                        <tr key={endpoint.id} className="bg-white border-b">
                            <td className="py-2 px-4 text-center align-middle">{endpoint.name}</td>
                            <td className="py-2 px-4 text-center align-middle">{endpoint.url}</td>
                            <td className="py-2 px-4 flex items-center gap-2 text-center align-middle">
                                <span
                                    className={
                                        endpoint.status !== 'healthy'
                                            ? 'w-3 h-3 rounded-full bg-red-500'
                                            : 'w-3 h-3 rounded-full bg-green-500'
                                    }
                                ></span>
                                <span>{endpoint.status}</span>
                            </td>
                            <td className="py-2 px-4 text-center align-middle"> <span className={endpoint.status !== 'healthy' ? 'text-red-500': 'text-green-500'}>{endpoint.message}</span></td>
                            <td className="py-2 px-4 text-center align-middle">{endpoint.checkedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EndpointStatus;
