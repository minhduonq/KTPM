// src/config/config.js
const config = {
    goldService: {
      url: process.env.GOLD_SERVICE_URL || 'http://localhost:5000',
      maxConcurrent: 10,
      timeout: 5000,
      rateLimit: {
        windowMs: 60000, // 1 minute
        max: 100 // limit each IP to 100 requests per windowMs
      }
    },
    forexService: {
      url: process.env.FOREX_SERVICE_URL || 'http://localhost:4000',
      maxConcurrent: 10,
      timeout: 5000,
      rateLimit: {
        windowMs: 60000,
        max: 100
      }
    }
  };
  
  module.exports = config;
  