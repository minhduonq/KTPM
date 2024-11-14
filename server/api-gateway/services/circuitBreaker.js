class CircuitBreaker {
    constructor(failureThreshold = 5, resetTimeout = 60000) {
      this.failures = 0;
      this.lastFailureTime = 0;
      this.state = 'CLOSED';
      this.failureThreshold = failureThreshold;
      this.resetTimeout = resetTimeout;
    }
  
    async executeRequest(requestFn) {
      if (this.state === 'OPEN') {
        if (Date.now() - this.lastFailureTime > this.resetTimeout) {
          this.state = 'HALF_OPEN';
        } else {
          throw new Error('Circuit breaker is OPEN');
        }
      }
  
      try {
        const result = await requestFn();
        if (this.state === 'HALF_OPEN') {
          this.state = 'CLOSED';
          this.failures = 0;
        }
        return result;
      } catch (error) {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.failures >= this.failureThreshold) {
          this.state = 'OPEN';
        }
        throw error;
      }
    }
}


module.exports = CircuitBreaker;