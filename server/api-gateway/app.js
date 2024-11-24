const express = require('express');
const routes = require('./routes');
const app = express();
const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});