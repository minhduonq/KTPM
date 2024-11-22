'use client';
import { useEffect, useState } from "react";
import axios from 'axios';

interface ContainerUsage {
    id: string;
    name: string;
    memory_usage: number;
    cpu_usage: number;
}

const ContainerUsage = () => {
    const [usageData, setUsageData] = useState<ContainerUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsageData = async () => {
            try {
                const response = await axios.get('http://localhost:3003/monitor/usage');
                setUsageData(response.data);
            } catch (error) {
                setError('Errpr fetching container usage data')
            } finally {
                setLoading(false);
            }
        };
        fetchUsageData();
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className='p-5' style={{ overflowY: 'auto', maxHeight: '98vh' }}>
            <h2 className="text-2xl font-bold mb-4">Container Usage</h2>
            <hr className="border-t border-gray-300 mb-4" />
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 rounded-t-lg">
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Memory Usage (MB)</th>
                        <th className="py-2 px-4 border-b">CPU Usage</th>
                    </tr>
                </thead>
                <tbody>
                    {usageData.map((container) => (
                        <tr key={container.id} className="bg-white">
                            <td className="py-2 px-4 border-b">{container.id}</td>
                            <td className="py-2 px-4 border-b">{container.name}</td>
                            <td className="py-2 px-4 border-b">{container.memory_usage.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{container.cpu_usage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContainerUsage;