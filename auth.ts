import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import authConfig from '@/auth.config'

declare module "@auth/core" {
  interface Session {
    user: {
      id: number,
      email: string,
      name: string,
      username: string,
      createdAt: Date,
      updatedAt: Date,
      accessToken: string,
      avatarLink: string,
      bannerLink: string,
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const accountData = prisma.account.findFirst({
          where: {
            email: token.email
          }
        })
        const data = {
          ...token, ...accountData
        }
        console.log('jwt ' + JSON.stringify(data));
        return data;
      }

      return {
        ...token
      }
    },
    async session({ session, token, user }) {

      return { ...session, user: { user, ...token } }
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
              provider: 'github'
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
            provider: 'google'
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
  ...authConfig
})