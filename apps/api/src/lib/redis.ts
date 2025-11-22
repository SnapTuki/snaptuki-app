import { Redis } from 'ioredis';
import { config } from '../config';

// 1. Create a single client instance (Singleton Pattern)
// This is the recommended practice for connection pooling.
const redisClient = new Redis(config.redisUrl);

// 2. Add basic connection logging
redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully.');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  // In production, you might want to gracefully shut down or restart
});

// 3. Export the client for use in other services
export { redisClient };