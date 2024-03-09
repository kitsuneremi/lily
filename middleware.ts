// export { default } from 'next-auth/middleware'
import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

const {auth} = NextAuth(authConfig)

const protectedRoute = [
    '/station'
]

const protectedApiRoute = [
    '/api/like/add',
    '/api/like/delete',
    '/api/like/find',
    '/api/live/create',
    '/api/live/update',
    '/api/message',
    '/api/notification',
]

export default auth((req) => {
    const loggedIn = !!req.auth;
    console.log("auth: " + !!req.auth)
    console.log("Request Url:" + req.nextUrl.pathname)
    if(protectedApiRoute.find(api => {return api.includes(req.nextUrl.pathname)}))
    {
        
    }
    if(protectedRoute.find(route => {route.includes(req.nextUrl.pathname)}))
    {
        if(loggedIn){
            return Response.redirect(new URL('/', req.nextUrl))
        }else{
            return Response.redirect(new URL('/login', req.nextUrl));
        }
    }

    
})

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], }