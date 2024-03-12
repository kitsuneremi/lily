import GitHub from "next-auth/providers/github"
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import type { NextAuthConfig } from "next-auth"
import { baseURL } from "./lib/functional"

export default {
    providers: [GitHub, Google, Credentials({
        name: "credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
        },
        authorize: async (credentials) => {
            console.log('auth cfg ' + credentials.password + ' ' + credentials?.username);
            if (credentials) {

                //@ts-ignore
                const username: string = credentials.username;
                //@ts-ignore
                const password: string = credentials.password;

                const res = await fetch(`${baseURL}/api/account/data`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                })
                const user = await res.json();
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarLink: user.avatarLink,
                    bannerLink: user.bannerLink,
                    username: user.username,
                    streamKey: user.streamKey
                };
            } else {
                return {};
            }

        }
    }
    )
    ],
    pages: {
        signIn: '/login',
        signOut: '/login',
        newUser: '/setting/account'
    },

} satisfies NextAuthConfig 