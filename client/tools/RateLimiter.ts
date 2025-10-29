import { ApolloLink } from '@apollo/client/link';
import { Observable } from 'rxjs';
 
class AniListRateLimiter {
  requests: Map<number, string>;
  maxRequestsPerMinute: number;
  retryDelays: number[];
  globalDelay: number;

  constructor() {
    this.requests = new Map();
    this.maxRequestsPerMinute = 30;
    this.retryDelays = [1000, 2000, 4000, 8000];
    this.globalDelay = 0;
  }
 
  canMakeRequest(_operationName: string ) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
     
    for (const [timestamp] of this.requests) {
      if (timestamp < oneMinuteAgo) {
        this.requests.delete(timestamp);
      }
    }
 
    console.log("🚀 ~ RateLimit ~ requests in the last 60s:", this.requests.size, "last:",_operationName);
    if (this.requests.size >= this.maxRequestsPerMinute) return false;
    
    if (this.globalDelay > now) return false;
  
    return true;
  }

  recordRequest(operationName: string) {
    this.requests.set(Date.now(), operationName);
  }

  // Handle rate limit response
  handleRateLimit(retryAfter = null) {
    const delay = retryAfter ? retryAfter * 1000 : this.getNextDelay();
    this.globalDelay = Date.now() + delay;
    console.warn(`Rate limited. Next request allowed in ${delay}ms`);
    return delay;
  }
 
  getNextDelay() {
    const baseDelay = 1000*2;
    const jitter = Math.random() * 500; // Add jitter to prevent thundering herd
    return baseDelay + jitter;
  }
 
  getTimeUntilNextRequest() {
    const now = Date.now();
    if (this.globalDelay > now) {
      return this.globalDelay - now;
    }
    return 0;
  }
}

const rateLimiter = new AniListRateLimiter();

export const rateLimitingLink = new ApolloLink((operation, forward) => {
  const operationName = operation.operationName;

  return new Observable(observer => {
    if (rateLimiter.canMakeRequest(operationName!)) executeRequest() 
    else {
      console.log(`🚀 ~ [${operationName}]: Too many requests`);    
      const delay = rateLimiter.getTimeUntilNextRequest();

      setTimeout(() => {
        executeRequest();
      }, delay);
    }

    function executeRequest() {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          rateLimiter.recordRequest(operationName!);
          observer.next(result);
        },
        error: (error) => { 
          if (error.networkError?.statusCode === 429) {
            const retryAfter = error.networkError.headers?.get('retry-after');
            const delay = rateLimiter.handleRateLimit(retryAfter) ?? 1000*60;
             
            setTimeout(() => {
              executeRequest();
            }, delay);
            return;
          }
          // observer.error(error);
        },
        complete: () => {
          observer.complete()
        },
      });

      return () => subscription.unsubscribe();
    }
  });
});
