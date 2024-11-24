const axios = require('axios');

async function testBulkhead() {
  const totalRequests = 8;
  const apiUrl = 'http://localhost:3005/test-endpoint';

  const sendRequest = async (requestNumber) => {
    try {
      const startTime = Date.now();
      const response = await axios.get(apiUrl);
      const endTime = Date.now();

      return {
        requestNumber,
        startTime,
        endTime,
        duration: endTime - startTime,
        data: response.data
      };
    } catch (error) {
      return {
        requestNumber,
        error: error.message
      };
    }
  };

  // Gửi đồng thời 20 request
  const results = await Promise.all(
    Array(totalRequests).fill().map((_, i) => sendRequest(i + 1))
  );

  // Phân tích kết quả
  console.log('\n--- Bulkhead Test Results ---');
  results.forEach(result => {
    if (result.data) {
      console.log(`Request ${result.requestNumber}: 
        Started at: ${new Date(result.startTime).toISOString()}
        Ended at: ${new Date(result.endTime).toISOString()}
        Duration: ${result.duration}ms`);
    } else {
      console.log(`Request ${result.requestNumber}: Error - ${result.error}`);
    }
  });
}

testBulkhead().catch(console.error);