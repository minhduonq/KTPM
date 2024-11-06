const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const monitorRoute = require('./routes/monitorRoute')
app.use('/monitor', monitorRoute);

const PORT = 3003;
app.listen(PORT, () => {
    console.log('Docker status monitoring running on port:', PORT);
});