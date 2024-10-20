const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');

const app = express();
const docker = new Docker();

app.use(cors());

app.get('/api/containers-status', async (req,res) => {
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
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log('Docker status monitoring running on port:', PORT);
});