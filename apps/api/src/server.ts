
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

// IdentityAccess BC imports
import { buildIdentityAccessSchema } from "./domains/identityAccess/api/schema/buildSchema";
import { createIdentityAccessContainer } from "./domains/identityAccess/infrastructure";
import { JwtTokenService } from "./domains/identityAccess/infrastructure/security/jwtTokenService";
import { config } from "./config";

async function buildApplicationSchema() {
    const identityAccessSchema: any = await buildIdentityAccessSchema();

    return identityAccessSchema;
}



// -------------------------------------------------------
// 👇 Gateway Context Builder
// -------------------------------------------------------
async function buildContext({ req }: any) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

    // Token service to decode JWT
    const tokens = new JwtTokenService(process.env.JWT_SECRET || "dev-secret");

    let currentUser = null;

    if (token) {
        try {
            const payload = tokens.verify<{ sub: string; roles: string[] }>(token);
            currentUser = {
                userId: payload.sub,
                roles: payload.roles ?? [],
            };
        } catch {
            // invalid/expired token → currentUser stays null
        }
    }

    // Dependency injection container for IdentityAccess BC
    const identityAccess = createIdentityAccessContainer();


    return {
        currentUser,
        identityAccess,
    };

}


// -------------------------------------------------------
// 👇 Start the server using startStandaloneServer
// -------------------------------------------------------
export async function startGatewayServer() {
    const schema = await buildApplicationSchema();

    const server = new ApolloServer({
        schema,
        introspection: true,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async (ctx) => buildContext(ctx),
    });

    console.log(`🚀 Gateway server ready at: ${url}`);
}
