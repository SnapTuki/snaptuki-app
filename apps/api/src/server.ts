
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


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
// 👇 Gateway Context Builder<a
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
// 👇 Start Gateway server - Express
// -------------------------------------------------------
export async function startGatewayServer() {
    const schema = await buildApplicationSchema();

    const apollo = new ApolloServer({
        schema,
        introspection: true
    });

    await apollo.start();

    const app = express();
    app.use(
        cors({
            origin: config.frontendOriginURL,
            credentials: true,
        })
    )

    app.use(bodyParser.json());

    //mount apollow middleware
    app.use(
        "/graphql",
        expressMiddleware(apollo, {context: buildContext})
    );



    const PORT = config.serverPort || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Gateway server running at http://localhost:${PORT}/graphql`);
    })
}
