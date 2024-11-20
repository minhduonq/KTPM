// app/components/ContainerUsageStream.js
'use client'; // Đánh dấu component này chạy trên client side

import { useEffect, useState } from 'react';

interface ContainerStats {
    id: string;
    name: string;
    cpuUsage: number;
    memoryUsage: number;
    memoryLimit: number;
    timestamp: string;
}

const ContainerUsageStream = () => {
    const [containerStats, setContainerStats] = useState<ContainerStats[]>([]);
    useEffect(() => {
        // Tạo kết nối tới SSE endpoint của backend
        const eventSource = new EventSource('http://localhost:3003/monitor/usage');

        // Xử lý khi có dữ liệu mới
        eventSource.onmessage = (event) => {
            const newStats = JSON.parse(event.data);
            setContainerStats((prevStats) => {
                // Cập nhật trạng thái mới với dữ liệu mới nhất
                const updatedStats = [...prevStats];
                const index = updatedStats.findIndex(stats => stats.id === newStats.id);
                if (index !== -1) {
                    updatedStats[index] = newStats;
                } else {
                    updatedStats.push(newStats);
                }
                return updatedStats;
            });
        };

        // Xử lý lỗi
        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Cleanup khi component bị unmount
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Container Usage Stream</h1>
            <ul>
                {containerStats.map((stats) => (
                    <li key={stats.id}>
                        <strong>{stats.name}</strong> (ID: {stats.id})
                        <br />
                        CPU Usage: {stats.cpuUsage}
                        <br />
                        Memory Usage: {(stats.memoryUsage / (1024 * 1024)).toFixed(2)} MB /
                        {(stats.memoryLimit / (1024 * 1024)).toFixed(2)} MB
                        <br />
                        Timestamp: {stats.timestamp}
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <iframe
                    src="http://localhost:3000"
                    width="100%"
                    height="600"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default ContainerUsageStream;
