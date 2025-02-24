export const monitoring = {
  logError: (error: Error, context?: Record<string, unknown>) => {
    // Send to your error tracking service (e.g., Sentry)
    console.error("[Error]", {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  },

  logPerformance: (metric: string, duration: number) => {
    // Send to your analytics service (e.g., Google Analytics)
    console.log("[Performance]", {
      metric,
      duration,
      timestamp: new Date().toISOString(),
    });
  },

  logApiCall: (endpoint: string, success: boolean, duration: number) => {
    // Track API performance
    console.log("[API]", {
      endpoint,
      success,
      duration,
      timestamp: new Date().toISOString(),
    });
  },
};
