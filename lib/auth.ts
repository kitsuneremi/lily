import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import { baseURL, fileURL } from "./functional";
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from "./prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuid } from 'uuid'
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

        }),
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
        async session({ session, token, user }) {
            if (user) {
                if (!user.image) {
                    const image = `${fileURL}/api/image?path=-1`
                    return { ...session, user: { image: image, ...token } };
                }
                return { ...session, user };
            } else {
                return { ...session }
            }
        },
        async signIn({ account, user, credentials, email, profile }) {
            console.log(account, user, profile)
            if (account?.provider === 'github') {
                if (user.email && user.image) {
                    await prisma.accounts.upsert({
                        where: {
                            email: user.email
                        },
                        create: {
                            email: user.email,
                            name: user.name!,
                            //@ts-ignore
                            password: profile!.login,
                            //@ts-ignore
                            username: profile!.login,
                            avatarLink: user.image,
                            streamKey: uuid(),
                        },
                        update: {
                            updatedAt: new Date()
                        }
                    })
                    return true;
                }else{
                    return false;
                }
            }else if(account?.provider === 'google'){
                await prisma.accounts.upsert({
                    where: {
                        email: user.email!
                    },
                    create: {
                        email: user.email!,
                        name: user.name!,
                        //@ts-ignore
                        password: profile!.given_name + profile!.family_name,
                        //@ts-ignore
                        username: profile!.given_name + profile!.family_name,
                        avatarLink: user.image!,
                        streamKey: uuid(),
                    },
                    update: {
                        updatedAt: new Date()
                    }
                }) 
                return true;
            }else{
                return true;
            }
            
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY,
}