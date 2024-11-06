'use client'
import  ContainerUsageStream from '@/components/usage'

export default function Home() {

    return(
        <div>
              <h1>Container Usage Monitoring</h1>
              <ContainerUsageStream />
        </div>
    )    
}
/*
 const [isConnected, setConnectedState] = useState(false);
    const [containerStats, setContainerStats] = useState<{[key: string]: ContainerStats}>({});
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const startMonitoring = useCallback(() => {
        // Đóng kết nối cũ nếu tồn tại
        if (eventSource) {
            eventSource.close();
        }

        const newEventSource = new EventSource('http://localhost:3003/monitor/usage');
        newEventSource.onopen = () => {
            setConnectedState(true);
            console.log('SSE Connection opened');
        };

        newEventSource.onmessage = (event) => {
            try {
              const newStats: ContainerStats = JSON.parse(event.data);
              
              // Giới hạn số lượng dữ liệu (VD: giữ max 50 renpm run 
                const updatedStats = { ...prev };
                
                // Nếu container chưa tồn tại, thêm mới
                if (!updatedStats[newStats.id]) {
                  updatedStats[newStats.id] = newStats;
                }
      
                return updatedStats;
              });
            } catch (error) {
              console.error('Error parsing stats:', error);
            }
        };

        newEventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            stopMonitoring();
        };
        setEventSource(newEventSource);
    }, []);
   
    const stopMonitoring = useCallback(() => {
        if (eventSource) {
          eventSource.close();
          setEventSource(null);
          setConnectedState(false);
          console.log('SSE Connection closed');
        }
    }, [eventSource]);

    // Hàm xóa toàn bộ stats
    const clearStats = () => {
        setContainerStats({});
    };


    return (
        <div className="p-4 space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={startMonitoring}
              disabled={isConnected}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Start Monitoring
            </Button>
            <Button 
              onClick={stopMonitoring}
              disabled={!isConnected}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Stop Monitoring
            </Button>
            <Button 
              onClick={clearStats}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Clear Stats
            </Button>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(containerStats).map(container => (
              <Card key={container.id}>
                <CardHeader>
                  <CardTitle>{container.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>CPU Usage: {container.cpuUsage}</p>
                  <p>Memory: {(container.memoryUsage / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Memory Limit: {(container.memoryLimit / 1024 / 1024).toFixed(2)} MB</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
*/