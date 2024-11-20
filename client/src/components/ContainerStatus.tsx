// 'use client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Container {
//     id: string;
//     name: string;
//     status: string;
// }

// const ContainerStatus = () => {
//     const [containers, setContainers] = useState<Container[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');


//     const fetchContainerStatus = async () => {
//         try {
//             const response = await axios.get('http://localhost:3003/monitor/containers-status');
//             setContainers(response.data);
//         } catch (error) {
//             setError('Error fetching container status');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchContainerStatus();

//         const intervalId = setInterval(fetchContainerStatus, 5000);
//         return () => clearInterval(intervalId);
//     }, []);


//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <div className='p-5' style={{ overflowY: 'auto', maxHeight: '98vh' }} >
//             <h2 className="text-2xl font-bold mb-4">Container Status</h2>
//             <hr className="border-t border-gray-300 mb-4" />
//             <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                 <thead>
//                     <tr className="bg-gray-200 rounded-t-lg">
//                         <th className="py-2 px-4 border-b">ID</th>
//                         <th className="py-2 px-4 border-b">Name</th>
//                         <th className="py-2 px-4 border-b">Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {containers.map((container) => (
//                         <tr
//                             key={container.id}
//                             className={
//                                 container.status === 'running'
//                                     ? 'bg-green-500 text-white'
//                                     : 'bg-red-500 text-white'
//                             }
//                         >
//                             <td className="py-2 px-4 border-b">{container.id}</td>
//                             <td className="py-2 px-4 border-b">{container.name}</td>
//                             <td className="py-2 px-4 border-b">{container.status}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ContainerStatus;

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

    useEffect(() => {
        fetchContainerStatus();

        const intervalId = setInterval(fetchContainerStatus, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='p-5' style={{ overflowY: 'auto', maxHeight: '98vh' }}>
            <h2 className="text-2xl font-bold mb-4">Container Status</h2>
            <hr className="border-t border-gray-300 mb-4" />
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 rounded-t-lg">
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {containers.map((container) => (
                        <tr key={container.id}>
                            <td className="py-2 px-4 border-b">{container.id}</td>
                            <td className="py-2 px-2 border-b">{container.name}</td>
                            <td className="py-2 px-4 border-b flex items-center gap-2">
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

export default ContainerStatus;