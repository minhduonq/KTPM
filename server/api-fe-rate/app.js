process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const FERrateRoute = require('./routes/fe-rate-route');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());  
app.use(express.json()); 

app.use(FERrateRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`FE Rate API running on port ${port}`);
});

// docker-compose up --build
 