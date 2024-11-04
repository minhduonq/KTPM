const Docker = require('dockerode');

const docker = new Docker()

exports.Containers_Status = async (req,res) => {
    try {
        const containers = await docker.listContainers({all: true});
        const containerStatus = containers.map(container => ({
            id: container.Id,
            name: container.Names[0].replace('/',''),
            status: container.State
        }));
        res.json(containerStatus);
    } catch(error) {
        console.error('Error while fetching container status:', error);
        res.status(500).json({error: 'Failed to fetch container status'});
    }
}