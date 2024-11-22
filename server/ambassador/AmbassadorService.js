// const redis = require('redis');
const redisClient = require('./redis')
const axios = require('axios');
const winston = require('winston');
const { performance } = require('perf_hooks');
const { promisify } = require('util');
const Service = require('./service')

const TEN_MINUTES = 10 * 60 * 1000
const ONE_MINUTE = 60 * 1000

// Cấu hình logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

class AmbassadorService {
    constructor(failureThreshold = 3, successThreshold = 1, openTimeout = 5000) {
      this.url = null
      this.failureThreshold = failureThreshold;
      this.successThreshold = successThreshold;
      this.openTimeout = openTimeout;
      this.state = 'CLOSED'; // Trạng thái ban đầu
      this.failureCount = 0;
      this.successCount = 0;
      this.openCount = 0;
      this.maxOpenRetries = 5;
    }

    setUrl(url) {
      this.url = url
    }

    // Hàm lưu dữ liệu và thời gian vào Redis
    async saveDataToRedis(key, data) {
      try {
        const result = Service.checkDataType(data);  // Kiểm tra kiểu dữ liệu
        const dataToCache = (result.type === 'json') ? JSON.stringify(result.data) : result.data;
    
        // Lưu dữ liệu vào Redis với thời gian hết hạn 1 giờ
        await redisClient.setEx(key, Service.randomInRange(3600, 4200), dataToCache);
    
        // Lưu thêm `fetchTime` với khóa phụ `${key}:fetchTime`
        await redisClient.setEx(`${key}:fetchTime`, Service.randomInRange(3600, 4200), Date.now().toString());
    
        console.log(`Data and its fetchTime saved to Redis with key: ${key}`);
      } catch (error) {
        console.error(`Error saving data to Redis: ${error.message}`);
      }
    }    

    // Hàm lấy dữ liệu từ Redis, kiểm tra thời gian cache
    async getDataFromRedis(key, expiredTime = ONE_MINUTE) {
      try {
        // Lấy fetchTime từ Redis với khóa phụ
        const fetchTime = await redisClient.get(`${key}:fetchTime`);
        if (!fetchTime) {
          logger.info(`No fetchTime found in cache for key: ${key}`);
          return null;
        }
    
        // Kiểm tra nếu dữ liệu đã cũ quá 1 phút thì thôi lấy mới
        const elapsedTime = Date.now() - parseInt(fetchTime, 10);
        logger.info(`Latest data for key: ${key} was ${elapsedTime}ms ago`);
        if (elapsedTime > expiredTime) {
          logger.info(`Cache expired for key: ${key}, fetching new data...`);
          return null;
        }
    
        // Nếu dữ liệu chưa cũ quá 1 phút, lấy dữ liệu từ Redis
        const cachedData = await redisClient.get(key);
        if (!cachedData) {
          logger.info(`No data found in cache for key: ${key}`);
          return null;
        }
    
        // Kiểm tra kiểu dữ liệu và parse nếu là JSON
        const result = Service.checkDataType(cachedData);
        return result.data;
    
      } catch (error) {
        console.error(`Error retrieving data from Redis: ${error.message}`);
        return null;
      }
    }    
  
    async fetchData() {
      if (!this.url) {
        throw new Error("URL has not been set");
      }

      // Khi demo circuit breaker comment phần này
      const cachedData = await this.tryFetchDataFromCacheAndLogTime()
      if (cachedData) {
        return cachedData
      }

      // Kiểm tra trạng thái của CircuitBreaker
      while (this.state === 'OPEN') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Đợi 500ms rồi kiểm tra lại
      }
  
      // Gọi dữ liệu từ remote khi trạng thái là CLOSED hoặc HALF-OPEN
      try {
        const data = await this.tryFetchDataFromURLAndLogTime();

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
            logger.info(`Retrying ${this.failureCount + 1}/${this.failureThreshold} because Circuit is CLOSED and request failed...`);
            return this.fetchData(); // Tự động thử lại
        } else if (this.state === 'HALF-OPEN') {
            // Trong trạng thái HALF-OPEN, nếu thất bại chuyển về OPEN
            this.setState('OPEN');
        }
      }
    }

    async tryFetchDataFromCacheAndLogTime() {
      const startTime = performance.now()

      let cachedData
      // Nếu số lần OPEN vượt quá maxOpenRetries, trả về cache mới nhất
      if (this.openCount >= this.maxOpenRetries) {
        logger.warn(`CircuitBreaker has been OPEN ${this.openCount} times, remote server might be down, returning latest cache...`);
        cachedData = await this.getDataFromRedis(this.url, TEN_MINUTES);
      } else { // Chưa quá maxOpenRetries
        cachedData = await this.getDataFromRedis(this.url);
      }

      if (cachedData) {
        logger.info(`Cache hit for url: ${this.url}`);
        const duration = performance.now() - startTime;
        logger.info(`Request took: ${duration.toFixed(3)} ms`);
        return cachedData
      }

      return null
    }
  
    async tryFetchDataFromURL() {      
        logger.info(`Fetching data from: ${this.url}`);
        /* Giả lập tỷ lệ lỗi 60%
        const failProbability = Math.random();
        if (failProbability >= 0) {
            logger.warn(`Simulated failure for url: ${this.url}`);
            throw new Error(`Simulated error fetching data from ${this.url}`);
        }
        */
        const response = await axios.get(this.url)
        logger.info(`Data fetched successfully!`)
      
        if (response.status === 200) {
          // Lưu vào cache
          this.saveDataToRedis(this.url, response.data)

          return response.data;
        } else {
          throw new Error(`Failed to fetch data from ${this.url}`);
        }
    }

    async tryFetchDataFromURLAndLogTime() {
        const startTime = performance.now()
        const result = await this.tryFetchDataFromURL()
        const duration = performance.now() - startTime;

        logger.info(`Request took: ${duration.toFixed(3)} ms`);
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
        this.openCount = 0;
      }
  
      if (newState === 'OPEN') {
        this.successCount = 0
        this.openCount += 1;
        // Chờ thời gian timeout trước khi chuyển sang HALF-OPEN
        return new Promise(resolve => {
          setTimeout(async () => {
              this.state = 'HALF-OPEN';
              logger.info('Circuit is now HALF-OPEN, retrying...');
              const result = await this.fetchData();  // Đợi fetchData() hoàn tất
              resolve(result);  // Trả về kết quả sau khi thử lại
          }, this.openTimeout);
        });
      }
    }
}

module.exports = AmbassadorService;