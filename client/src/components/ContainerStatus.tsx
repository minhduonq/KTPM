'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Container {
    id: string;
    name: string;
    status: string;
}

const ContainerStatus = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContainerStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3003/monitor/containers-status');
                setContainers(response.data);
            } catch (error) {
                setError('Error fetching container status');
            } finally {
                setLoading(false);
            }
        };

        fetchContainerStatus();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Container Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {containers.map((container) => (
                        <tr key={container.id}>
                            <td>{container.id}</td>
                            <td>{container.name}</td>
                            <td>{container.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerStatus;