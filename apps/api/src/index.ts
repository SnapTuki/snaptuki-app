import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import path from "node:path";
import { readFileSync } from "node:fs";
import { gql } from "graphql-tag";
//import { resolvers } from "./graphql/resolvers"

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "graphql/schema.graphql"), {
        encoding: "utf-8",
    })
);

console.log(typeDefs)
async function startApolloServer() {
    const server = new ApolloServer({ typeDefs });
    const { url } = await startStandaloneServer(server);
    console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();