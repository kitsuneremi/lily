/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'static.nike.com',
                protocol: 'https'
            },
            {
                hostname: 'firebasestorage.googleapis.com',
                protocol: 'https'
            }
        ]
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
