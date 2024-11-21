// src/config/config.js
const config = {
    goldService: {
      url: process.env.GOLD_SERVICE_URL || 'http://api-gold-price:4000',
      maxConcurrent: 5,
      rateLimit: {
        windowMs: 30000, // 1 minute
        max: 15 // limit each IP to 100 requests per windowMs
      }
    },
    forexService: {
      url: process.env.FOREX_SERVICE_URL || 'http://api-fe-rate:5000',
      maxConcurrent: 5,
      rateLimit: {
        windowMs: 30000,
        max: 15
      }
    }
  };
  
  module.exports = config;
  