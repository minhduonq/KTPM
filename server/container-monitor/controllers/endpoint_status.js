const axios = require('axios');
const services = {
    goldPrice: {
        name: "Gold Price Container's Service",
        url: 'http://localhost:4000/api/gold-price',
        validate: (data) => {
            // Checking data structure to see if the data return is OK
            if(!Array.isArray(data)) return false;
            if(data.length === 0) return false;

            const sampleItem = data[0];
            const requiredFields = ['type', 'buy', 'sell'];
            return requiredFields.every(field => 
                sampleItem.hasOwnProperty(field) &&
                sampleItem[field] !== null &&
                sampleItem !== undefined
            );
        }
    },
    feRate: {
        name: "Foreign Exchange Rate Container's Service",
        url: 'http://localhost:5000/api/fe-rate',
        validate: (data) => {
            if(!data.ExrateList) return false;
            if(!Array.isArray(data.ExrateList.Exrate)) return false;

            const sampleItem = data.ExrateList.Exrate[0].$;
            const requireFields = ['CurrencyCode', 'CurrencyName', 'Buy', 'Transfer', 'Sell'];
            return requireFields.every(field => 
                sampleItem.hasOwnProperty(field) && 
                sampleItem[field] !== null && 
                sampleItem[field] !== undefined
            )
        }
    }
}

async function checkServiceHealth(service) {
    try {
        const response = await axios.get(service.url, {timeout: 5000});
        // case 1: service return data but wrong format
        if(!service.validate(response.data)) {
            return {
                status: 'degraded',
                availability: 'up',
                message: 'Service is working but the data is in the wrong format',
            }
        }
        // case 2: healthy
        return {
            status: 'healthy',
            availability: 'up',
            message: 'Service is working normally',
        };
    } catch(error) {
        // Trường hợp 3: Không thể kết nối đến service
        if (error.code === 'ECONNREFUSED') {
            return {
                status: 'error',
                availability: 'down',
                message: 'Can not connect to ' + service.name
            };
        }
        // Trường hợp 4: Service trả về status 500
        if (error.response && error.response.status === 500) {
            return {
                status: 'degraded',
                availability: 'up',
                message: 'Can not get data from third party services in ' + service.name,
            };
        }
        
        // Các lỗi khác
        return {
            status: 'error',
            availability: 'down',
            message: `Lỗi: ${error.message}`
        };
    }
}

exports.Endpoint_Status = async (req,res) => {
    try {
        const statusPromises = Object.entries(services).map(async ([id, service]) => {
          const health = await checkServiceHealth(service);
          return {
            id,
            name: service.name,
            url: service.url,
            ...health,
            checkedAt: new Date().toISOString()
          };
        });
    
        const statuses = await Promise.all(statusPromises);
        res.json(statuses);
      } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
}