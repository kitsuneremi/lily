import NextAuth from "next-auth"

declare module "next-auth" {
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
        sub: number,
        iat: number,
        exp: number,
        jti: string
    }
  }
}