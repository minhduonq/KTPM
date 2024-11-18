const redis = require('redis');
const REDIS_PORT = 6379;

const client = redis.createClient({
  url: `redis://redis:${REDIS_PORT}`
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  try {
    await client.connect(); // Kết nối Redis client
    console.log('Redis client connected');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

// Kết nối Redis ngay khi file này được gọi
connectRedis().catch(console.error);

module.exports = client;