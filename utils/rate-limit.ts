class RateLimit {
  protected requests: Map<string, number[]> = new Map();
  protected windowMs: number;
  protected max: number;

  constructor(options: { windowMs: number; max: number }) {
    this.windowMs = options.windowMs;
    this.max = options.max;
  }

  async check(ip: string = "default"): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this IP
    let requests = this.requests.get(ip) || [];

    // Remove old requests outside the window
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= this.max) {
      throw new Error("Too many requests");
    }

    // Add current request
    requests.push(now);
    this.requests.set(ip, requests);
  }
}

class SpeedLimit extends RateLimit {
  private delayAfter: number;
  private delayMs: number;

  constructor(options: {
    windowMs: number;
    delayAfter: number;
    delayMs: number;
  }) {
    super({ windowMs: options.windowMs, max: Infinity });
    this.delayAfter = options.delayAfter;
    this.delayMs = options.delayMs;
  }

  async check(ip: string = "default"): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let requests = this.requests.get(ip) || [];
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length > this.delayAfter) {
      const delay = this.delayMs * (requests.length - this.delayAfter);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    requests.push(now);
    this.requests.set(ip, requests);
  }
}

export const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const speedLimiter = new SpeedLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100
});
