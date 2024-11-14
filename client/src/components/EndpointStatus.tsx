'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Endpoint {
    id: string;
    name: string;
    url: string;
    status: string;
    checkedAt: string;
}

const EndpointStatus = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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

        fetchEndpointStatus();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Endpoint Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Checked At</th>
                    </tr>
                </thead>
                <tbody>
                    {endpoints.map((endpoint) => (
                        <tr key={endpoint.id}>
                            <td>{endpoint.id}</td>
                            <td>{endpoint.name}</td>
                            <td>{endpoint.url}</td>
                            <td>{endpoint.status}</td>
                            <td>{endpoint.checkedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EndpointStatus;