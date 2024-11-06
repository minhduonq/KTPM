const Docker = require('dockerode');
const docker = new Docker();

exports.Containers_Usage_Stream = async (req, res) => {
    // Đảm bảo chỉ thiết lập headers một lần
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const activeStreams = [];

    try {
        const containers = await docker.listContainers();
        
        // Sử dụng Promise.all để xử lý các stream đồng thời
        await Promise.all(containers.map(async (container) => {
            const containerInstance = docker.getContainer(container.Id);
            
            try {
                // Sử dụng stream() thay vì stats()
                const statsStream = await containerInstance.stats({ stream: true });
                
                statsStream.on('data', (chunk) => {
                    try {
                        const stats = JSON.parse(chunk.toString());
                        const processedStats = {
                            id: container.Id,
                            name: container.Names[0],
                            cpuUsage: stats.cpu_stats?.cpu_usage?.total_usage || 0,
                            memoryUsage: stats.memory_stats?.usage || 0,
                            memoryLimit: stats.memory_stats?.limit || 0,
                            timestamp: new Date().toISOString()
                        };
                        
                        // Ghi dữ liệu SSE
                        res.write(`data: ${JSON.stringify(processedStats)}\n\n`);
                    } catch(parseError) {
                        console.error('Error parsing stats:', parseError);
                    }
                });

                statsStream.on('error', (err) => {
                    console.error(`Stream error for container ${container.Id}:`, err);
                });

                statsStream.on('end', () => {
                    console.log(`Stream ended for container ${container.Id}`);
                });

                activeStreams.push(statsStream);
            } catch (streamError) {
                console.error(`Error creating stream for container ${container.Id}:`, streamError);
            }
        }));

        // Xử lý khi client ngắt kết nối
        req.on('close', () => {
            console.log('Client disconnected');
            activeStreams.forEach(stream => stream.destroy());
        });

    } catch(error) {
        console.error('Error fetching container stats:', error);
        // Chỉ gửi error response nếu headers chưa được gửi
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error fetching container stats' });
        }
    }
};

async function getContainerMetrics() {
    const containers = await docker.listContainers();
    const containerStats = await Promise.all(
      containers.map(async (container) => {
        const containerInstance = docker.getContainer(container.Id);
        const stats = await containerInstance.stats({ stream: false });
        return {
          name: container.Names[0].replace('/', ''),
          status: container.State,
          id: container.Id,
          memory_usage: stats.memory_stats.usage / (1024 * 1024), // Convert to MB
          cpu_usage: stats.cpu_stats.cpu_usage.total_usage
        };
      })
    );
    return containerStats;
}

exports.Containers_Usage_NO_Stream = async (req, res) => {
    const metrics = await getContainerMetrics();
    res.json(metrics)
}