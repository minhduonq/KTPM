process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const goldPriceRoute = require('./routes/gold-price-route');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  
app.use(express.json()); 

app.use(goldPriceRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`Gold Price API running on port ${port}`);
});
