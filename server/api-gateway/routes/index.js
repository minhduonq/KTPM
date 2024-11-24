// src/routes/index.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const createBulkhead = require('../middleware/bulkhead');
const config = require('../config/config');
const rateLimit = require('express-rate-limit');

// Rate limiters
const goldRateLimiter = rateLimit(config.goldService.rateLimit);
const forexRateLimiter = rateLimit(config.forexService.rateLimit);

// Gold price endpoint
router.get('/api/gold-price',
  goldRateLimiter,
  createBulkhead(config.goldService.maxConcurrent),
  async (req, res) => {
    try {
      const response = await axios.get(`${config.goldService.url}/api/gold-price`)
      res.json(response.data)
    } catch(error) {
      console.error("Error fetching API:", error);
      res.status(500).send("Error fetching gold Price data fromd api-gold-price");
    }
  }
);

// Forex rate endpoint
router.get('/api/fe-rate',
  forexRateLimiter,
  createBulkhead(config.forexService.maxConcurrent),
  async (req, res) => {
    try {
      const response = await axios.get(`${config.forexService.url}/api/fe-rate`)
      res.json(response.data)
    } catch(error) {
      console.error("Error fetching API:", error);
      res.status(500).send("Error fetching FE RATE data from api-fe-rate");
    }
  }
);

router.get('/test-endpoint', 
  forexRateLimiter,
  createBulkhead(config.forexService.maxConcurrent),
  async (req, res) => {
    try {
      // Mô phỏng xử lý với độ trễ 1-2 giây
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Trả về JSON với dữ liệu ngẫu nhiên
      res.json({
        exchangeRate: Math.random() * 100, // tỷ giá ngẫu nhiên
        timestamp: new Date().toISOString(),
        requestId: Math.floor(Math.random() * 1000)
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
)

// Base URL
router.get('/', (req, res) => {
  res.send('THIS IS API GATE WAY SERVER - HELLO')
});


module.exports = router;