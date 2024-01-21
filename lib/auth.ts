import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { baseURL } from "./functional";
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from "./prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";

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
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            

        }),
        CredentialsProvider({
            name: "credentials",
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
            // console.log(token)
            const imageRef = ref(storage, `account/avatars/${token.id}`)
            try{
                const image = await getDownloadURL(imageRef)
                return { ...session, user: { image: image, ...token } };
            }catch(e){
                return { ...session, user: { image: '', ...token } };
            }

        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY,
}