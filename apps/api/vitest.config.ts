import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Include all standard test files
    include: ['src/**/*.test.ts'],
    
    // CRITICAL: Explicitly block the unit test runner from touching integration files
    exclude: [
      'node_modules',
      'dist',
      'src/domains/*/useCases/**/*.test.ts', // Block use case tests
      '**/*.integration.test.ts'             // Block any file named .integration.test.ts
    ],
  },
});