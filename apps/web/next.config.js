/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ],
    },
    // Allow all hosts (for Ngrok)
    allowedPatterns: [
        {
            hostname: '**',
        }
    ],
    // Disable strict host check for dev servers in some envs
    experimental: {
        // serverActions: true, // not needed in v15
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    async rewrites() {
        const API_URL = process.env.API_URL || 'http://localhost:5000';
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/api/:path*`, // Proxy to Backend
            },
            {
                source: '/uploads/:path*',
                destination: `${API_URL}/uploads/:path*`, // Proxy to Uploads
            }
        ];
    }
};

module.exports = nextConfig;
