const axios = require('axios');

async function advancedRateLimitTest() {
  const url = 'http://localhost:3005/api/gold-price';
  
  // Hàm gửi request với retry và tracking
  const sendRequestWithRetry = async (index) => {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const start = Date.now();
        const response = await axios.get(url, {
          timeout: 10000 // Timeout 10 giây
        });
        
        console.log(`Request ${index}: 
          - Status: Success 
          - Attempt: ${retryCount + 1}
          - Time: ${start - startTime}ms
          - Duration: ${Date.now() - start}ms`);
        
        return response;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`Request ${index}: Rate Limited 
            - Attempt: ${retryCount + 1}
            - Waiting before retry...`);
          
          // Đợi 30 giây trước khi retry
          await new Promise(resolve => setTimeout(resolve, 30000));
          retryCount++;
        } else {
          console.error(`Request ${index} failed:`, error.message);
          throw error;
        }
      }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts`);
  };

  const startTime = Date.now();
  const requests = [];

  // Gửi 22 request (vượt quá giới hạn 10)
  for (let i = 0; i < 18; i++) {
    requests.push(
      sendRequestWithRetry(i)
        .catch(error => {
          console.error(`Final failure for request ${i}:`, error.message);
        })
    );
  }

  await Promise.allSettled(requests);

  const endTime = Date.now();
  console.log(`Total test duration: ${endTime - startTime}ms`);
}

advancedRateLimitTest();