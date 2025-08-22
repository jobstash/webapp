class RateLimiter {
  private requestTimes: number[] = [];
  private readonly maxRequestsPerSecond: number;

  constructor(maxRequestsPerSecond: number) {
    this.maxRequestsPerSecond = maxRequestsPerSecond;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    this.requestTimes = this.requestTimes.filter((time) => time > oneSecondAgo);

    if (this.requestTimes.length >= this.maxRequestsPerSecond) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = oldestRequest + 1000 - now;

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      this.requestTimes.shift();
    }

    this.requestTimes.push(Date.now());
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForSlot();
    return fn();
  }
}

export const globalRateLimiter = new RateLimiter(5);

export const rateLimitedFetch = async <T>(fn: () => Promise<T>): Promise<T> =>
  globalRateLimiter.execute(fn);
