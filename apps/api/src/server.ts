
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { buildSchema } from "type-graphql";
import { GraphQLDateTime } from "graphql-scalars";
// IdentityAccess BC imports
import { createIdentityAccessContainer } from "./domains/identityAccess/infrastructure";
import { JwtTokenService } from "./domains/identityAccess/infrastructure/security/jwtTokenService";
import { AuthResolver } from "./domains/identityAccess/api/resolvers/authResolver";
import { UserResolver } from "./domains/identityAccess/api/resolvers/userResolver";
import { ResidentResolver } from "./domains/residentManagement/api/graphql/resolvers/ResidentResolvers";
import { TaskResolver } from "./domains/taskManagement/api/graphql/resolvers/TaskResolver";
// CaregiverManagement BC imports
import { CaregiverResolver } from "./domains/caregiverManagement/api/resolvers/CaregiverResolvers";

import { createCaregiverManagementContainer } from "./domains/caregiverManagement/infrastructure";
import { createResidentManagementContainer } from "./domains/residentManagement/infrastructure";
import { createTaskManagementContainer } from "./domains/taskManagement/infrastructure";
import { config } from "./config";

async function buildApplicationSchema() {
    return await buildSchema({
        resolvers: [
            AuthResolver,
            UserResolver, 
            CaregiverResolver,
            ResidentResolver,
            TaskResolver,
        ],
        scalarsMap: [{ type: Date, scalar: GraphQLDateTime }],
        validate: false,
    });
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

    const identityAccess = createIdentityAccessContainer();
    const caregiverManagement = createCaregiverManagementContainer();
    const residentManagement = createResidentManagementContainer();
    const taskManagement = createTaskManagementContainer();
    return {
        currentUser,
        identityAccess,
        caregiverManagement,
        residentManagement,
        taskManagement,
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
