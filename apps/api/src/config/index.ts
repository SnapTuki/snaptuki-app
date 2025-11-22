import dotenv from 'dotenv';
import path from 'path';

interface Config {
    postgresUrl: string;
    redisUrl: string;
    nodeEnv: string
};

//helper function to  get env vars safely
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // Crashing the application immediately prevents runtime errors later.
    throw new Error(`\u26a0\ufe0f CRITICAL: Missing environment variable: ${key}`);
  }
  return value;
};

export const config: Config = {
    postgresUrl: getEnvVar('DATABASE_URL'),
    redisUrl: getEnvVar('REDIS_URL'),
    nodeEnv: process.env.NODE_ENV || 'development'
};