import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { baseURL } from "./functional";
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from "./prisma";

type result = {
    accessToken: string;
    id: number;
    email: string;
    name: string;
    username: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export const authOptions: NextAuthOptions = {
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // })

        CredentialsProvider({
            name: "credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "test" },
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const res = await fetch(`${baseURL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    })
                })
                
                const user = await res.json();
                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    const { password, ...userWithoutPass } = user;
                    return userWithoutPass
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null
                }
            }

        })
    ],
    pages: {
        signIn: "/register",
        signOut: "/register"
    },
    callbacks: {
        async jwt({ token, user, session }) {
            return {
                ...user,
                ...token
            }
        },
        async session({ session, token }) {
            return {...session, user: token};
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY,
    debug: process.env.NODE_ENV === "development"

}