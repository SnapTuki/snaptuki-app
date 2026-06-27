import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. Point this to your running NestJS backend
  schema: 'http://localhost:4000/graphql',
  
  // 2. Look for queries/mutations inside your feature folders
  documents: ['src/features/**/graphql/*.ts', 'src/features/**/graphql/*.tsx'],
  
  // 3. Output the generated types and hooks into a single shared file
  generates: {
    'src/lib/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true, // Generates custom React hooks (e.g., useAuthenticateUserMutation)
        withHOC: false,
        withComponent: false,
        enumsAsTypes: false
      },
      
    }
  },
  
  // Optional: Ignore the generated file so it doesn't try to parse itself
  ignoreNoDocuments: true,
};

export default config;