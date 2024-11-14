// src/routes/index.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const CircuitBreaker = require('../services/circuitBreaker');
const createBulkhead = require('../middleware/bulkhead');
const config = require('../config/config');
const rateLimit = require('express-rate-limit');

// Khởi tạo circuit breakers
const goldCircuitBreaker = new CircuitBreaker();
const forexCircuitBreaker = new CircuitBreaker();

// Rate limiters
const goldRateLimiter = rateLimit(config.goldService.rateLimit);
const forexRateLimiter = rateLimit(config.forexService.rateLimit);

// Gold price endpoint
router.get('/gold-price',
  goldRateLimiter,
  createBulkhead(config.goldService.maxConcurrent),
  async (req, res) => {
    try {
      const result = await goldCircuitBreaker.executeRequest(async () => {
        const response = await axios.get(`${config.goldService.url}/api/gold-price`, {
          timeout: config.goldService.timeout
        });
        return response.data;
      });
      res.json(result);
    } catch (error) {
      console.error('Gold service error:', error.message);
      res.status(500).json({ 
        error: 'Gold service unavailable',
        message: error.message 
      });
    } 
  }
);

// Forex rate endpoint
router.get('/fe-rate',
  forexRateLimiter,
  createBulkhead(config.forexService.maxConcurrent),
  async (req, res) => {
    try {
      const result = await forexCircuitBreaker.executeRequest(async () => {
        const response = await axios.get(`${config.forexService.url}/api/fe-rate`, {
          timeout: config.forexService.timeout
        });
        return response.data;
      });
      res.json(result);
    } catch (error) {
      console.error('Forex service error:', error.message);
      res.status(500).json({ 
        error: 'Forex service unavailable',
        message: error.message 
      });
    }
  }
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    goldService: {
      circuitState: goldCircuitBreaker.state,
      failures: goldCircuitBreaker.failures
    },
    forexService: {
      circuitState: forexCircuitBreaker.state,
      failures: forexCircuitBreaker.failures
    }
  });
});


module.exports = router;