const axios = require('axios');
const NodeCache = require('node-cache');
const winston = require('winston');
const { performance } = require('perf_hooks');

// Cấu hình cache
// const redis = require('redis');
// const client = redis.createClient({
//     url: process.env.REDIS_URL || 'redis://localhost:6379', // Sử dụng biến môi trường
// });

// client.on('error', (err) => console.error('Redis Client Error', err));
// client.connect();

// Cấu hình Cache (lưu trữ 10 phút)
const cache = new NodeCache({ stdTTL: 600 });

// Cấu hình logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

class AmbassadorService {
    constructor(url, failureThreshold = 3, successThreshold = 1, openTimeout = 5000) {
      this.url = url;
      this.failureThreshold = failureThreshold;
      this.successThreshold = successThreshold;
      this.openTimeout = openTimeout;
      this.state = 'CLOSED'; // Trạng thái ban đầu
      this.failureCount = 0;
      this.successCount = 0;
    }
  
    async fetchData() {
      // Kiểm tra trạng thái của CircuitBreaker
      if (this.state === 'OPEN') {
        logger.info('Circuit is OPEN, waiting for timeout...');
        return null; // Không thực hiện yêu cầu nếu đang OPEN
      }
  
      // Gọi dữ liệu từ remote khi trạng thái là CLOSED hoặc HALF-OPEN
      try {
        const data = await this.tryFetchDataAndLogTime();

        // Nếu thành công và ở trạng thái HALF-OPEN
        if (this.state === 'HALF-OPEN') {
            this.successCount += 1;

            if (this.successCount >= this.successThreshold) {
                logger.info(`${this.successCount}/${this.successThreshold} successful attempts.`)
                this.setState('CLOSED');
            } else {
                logger.info(`Circuit is HALF-OPEN, ${this.successCount}/${this.successThreshold} successful attempts.`);
                return this.fetchData(); // Thử lại cho đến khi đạt successThreshold
            }
        } else if (this.state === 'CLOSED') {
            // Reset failure count khi thành công trong trạng thái CLOSED
            this.failureCount = 0;
        }

        return data;
      } catch (error) {
        this.failureCount += 1;
  
        if (this.failureCount >= this.failureThreshold) {
          this.setState('OPEN');
        }
  
        // Nếu ở trạng thái CLOSED và gặp lỗi, tự động thử lại
        if (this.state === 'CLOSED') {
            logger.info(`Retrying ${this.failureCount}/${this.failureThreshold} because Circuit is CLOSED and request failed...`);
            return this.fetchData(); // Tự động thử lại
        } else if (this.state === 'HALF-OPEN') {
            // Trong trạng thái HALF-OPEN, nếu thất bại chuyển về OPEN
            this.setState('OPEN');
        }
      }
    }
  
    async tryFetchData() {
        // Muốn test circuit breaker comment phần cache này
        // Kiểm tra cache từ Redis
        // const cachedData = await client.get(this.url);
        // if (cachedData) {
        //     console.log(`Cache hit for URL: ${this.url}`);
        //     return JSON.parse(cachedData); // Trả về dữ liệu từ cache
        // }

        // Kiểm tra cache từ nodeCache
        const cachedData = cache.get(this.url)
        if (cachedData) {
          logger.info(`Cache hit for URL: ${this.url}`)
          return cachedData
        }
      
        // Nếu không có lỗi, thực hiện yêu cầu fetch
        logger.info(`Fetching data from: ${this.url}`);
        // Giả lập tỷ lệ lỗi 60%
        const failProbability = Math.random();
        if (failProbability < 0.6) {
            logger.warn(`Simulated failure for URL: ${this.url}`);
            throw new Error(`Simulated error fetching data from ${this.url}`);
        }
        const response = await axios.get(this.url); // Giả sử bạn sử dụng axios
        logger.info(`Data fetched successfully!`)
      
        if (response.status === 200) {
          // Lưu vào cache
          cache.set(this.url, response.data);

          return response.data;
        } else {
          throw new Error(`Failed to fetch data from ${this.url}`);
        }
    }

    async tryFetchDataAndLogTime() {
        const startTime = performance.now()
        const result = await this.tryFetchData()
        const duration = performance.now() - startTime;

        logger.info(`Request took: ${duration.toFixed(3)} ms`);
        // logger.info(`Success count: ${this.successCount}. Failure count: ${this.failureCount}`)
        return result
    }
  
    setState(newState) {
      logger.info(`CircuitBreaker state changed to: ${newState}`);
      this.state = newState;
  
      if (newState === 'HALF-OPEN') {
        // Reset số lần thất bại khi chuyển sang HALF-OPEN
        this.failureCount = 0;
      }
  
      if (newState === 'CLOSED') {
        // Reset số lần thành công và thất bại khi chuyển sang CLOSED
        this.successCount = 0;
        this.failureCount = 0;
      }
  
      if (newState === 'OPEN') {
        this.successCount = 0
        // Chờ thời gian timeout trước khi chuyển sang HALF-OPEN
        setTimeout(() => {
          this.state = 'HALF-OPEN';
          logger.info('Circuit is now HALF-OPEN, retrying...');
          this.fetchData(); // Tự động gọi lại để thử trạng thái HALF-OPEN
        }, this.openTimeout);
      }
    }
}

module.exports = AmbassadorService;