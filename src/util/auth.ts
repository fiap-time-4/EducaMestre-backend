import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {admin} from "better-auth/plugins"
import prisma from './prisma';

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3333",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [admin()],    

    trustedOrigins: [process.env.FRONTEND_ORIGIN || "*", "http://localhost:3000"],
    advanced: {
        disableOriginCheck: process.env.NODE_ENV === "development",
    },
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.OAUTH_CLIENT_ID || "",
            clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
        }
    }
});