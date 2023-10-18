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
            },
            {
                hostname: 'github.com',
                protocol: 'https'
            }
        ]
    },
    transpilePackages: ['@pqina/pintura', '@pqina/react-pintura'],
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
