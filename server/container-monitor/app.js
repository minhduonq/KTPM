const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const monitorRoute = require('./routes/monitorRoute')
app.use('/monitor', monitorRoute);

const PORT = 3003;
app.listen(PORT, () => {
    console.log('Docker status monitoring running on port:', PORT);
});