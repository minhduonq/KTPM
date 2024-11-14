'use client'
import ContainerUsageStream from '@/components/usage';

type ContainerStats = {
  containerId: string;
  cpuUsage: number;
  memoryUsage: number;
};
import { useCallback, useState } from 'react';

export default function Home() {
  const [isConnected, setConnectedState] = useState(false);
  const [containerStats, setContainerStats] = useState<{ [key: string]: ContainerStats }>({});
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const startMonitoring = useCallback(() => {
    // Đóng kết nối cũ nếu tồn tại
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource('http://localhost:3003/monitor/usage');
    setEventSource(newEventSource);

    newEventSource.onopen = () => {
      setConnectedState(true);
    };

    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setContainerStats((prevStats) => ({
        ...prevStats,
        [data.containerId]: data,
      }));
    };

    newEventSource.onerror = () => {
      setConnectedState(false);
      newEventSource.close();
    };
  }, [eventSource]);

  return (
    <div>
      <h1>Container Usage Monitoring</h1>
      <ContainerUsageStream />
    </div>
  );
}