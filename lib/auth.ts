import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import { baseURL, fileURL, makeid } from "./functional";
import prisma from "./prisma";
import { v4 as uuid } from 'uuid'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
const key = new TextEncoder().encode(process.env.SECRET_KEY)

async function encrypt(payload: any) {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('15 sec from now').sign(key)
}

async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return
    const parsed = await decrypt(session);
    parsed.experied = new Date(Date.now() + 15 * 100);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.experied
    });

    return res;
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
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                // let details = {
                //     'username': credentials?.username,
                //     'password': credentials?.password,
                //     'grant_type': 'password'
                // };

                // var formBody = [];
                // for (var property in details) {
                //   var encodedKey = encodeURIComponent(property);
                //   var encodedValue = encodeURIComponent(details[property]);
                //   formBody.push(encodedKey + "=" + encodedValue);
                // }
                // formBody = formBody.join("&");

                const res = await fetch(`${fileURL}/api/lyart/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        'username': credentials?.username,
                        'password': credentials?.password,
                    })
                })

                const user = await res.json();
                console.log(user);
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    streamKey: user.streamKey
                };
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
            // console.log(session, token, user)
            if (user) {
                if (!user.image) {
                    const image = `${fileURL}/api/image?path=-1`
                    return { ...session, user: { image: image, ...token, ...user } };
                } else {
                    return { ...session, user: { ...token, ...user } };
                }
            } else {
                const image = `${fileURL}/api/image?path=-1`
                return { ...session, user: { image: image, ...token } }
            }
        },
        async signIn({ account, user, credentials, email, profile }) {
            // console.log(account, user, profile)
            if (account?.provider === 'github') {
                if (user.email && user.image) {
                    await prisma.account.upsert({
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
                            tagName: makeid()
                        },
                        update: {
                            updatedAt: new Date()
                        }
                    })
                    return true;
                } else {
                    return false;
                }
            } else if (account?.provider === 'google') {
                await prisma.account.upsert({
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
                        tagName: makeid()
                    },
                    update: {
                        updatedAt: new Date()
                    }
                })
                return true;
            } else {
                return true;
            }

        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY,
}